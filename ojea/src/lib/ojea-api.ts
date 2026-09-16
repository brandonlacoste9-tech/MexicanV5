import type { Clip, Comment } from "./clips";
import { tCopy } from "./i18n";
import { supabase } from "./supabase";

export type BackendStatus = "loading" | "live" | "offline";

export type SessionProfile = {
  userId: string;
  username: string;
  displayName: string;
  city: string | null;
  bio: string | null;
  email: string | null;
  avatarUrl: string | null;
};

export type DirectMessage = {
  id: string;
  sender: string;
  recipient: string;
  body: string;
  createdAt: string;
};

type ClipRow = {
  id: string;
  username: string;
  display_name: string;
  caption: string;
  city: string;
  image: string;
  video: string | null;
  likes_count: number;
  tags: string[] | null;
  sound: string;
  sound_artist: string;
  live: boolean | null;
  viewers: number | null;
};

type CommentRow = {
  clip_id: string;
  username: string;
  body: string;
};

function asError(err: unknown, fallback: string) {
  const c = tCopy();
  const msg =
    err && typeof err === "object" && "message" in err
      ? String((err as { message: unknown }).message)
      : fallback;
  if (/invalid login/i.test(msg)) return c.errInvalidLogin;
  if (/already registered/i.test(msg)) return c.errAlready;
  if (/password/i.test(msg) && /6|8|characters/i.test(msg)) return c.errPasswordLen;
  if (/duplicate key/i.test(msg) && /username/i.test(msg)) return c.errUsernameTaken;
  if (/provider is not enabled/i.test(msg) || /unsupported provider/i.test(msg))
    return c.errGoogleOff;
  if (/email not confirmed/i.test(msg)) return c.errEmailConfirm;
  if (/rate limit/i.test(msg)) return c.errRate;
  return msg || fallback;
}

export function accountUsername(raw: string) {
  const trimmed = raw.trim();
  if (trimmed.includes("@")) {
    return trimmed
      .split("@")[0]
      .toLowerCase()
      .replace(/[^a-z0-9._]/g, "")
      .slice(0, 24);
  }
  return trimmed
    .toLowerCase()
    .replace(/\s+/g, ".")
    .replace(/[^a-z0-9._]/g, "")
    .slice(0, 24);
}

export function accountEmail(raw: string) {
  const trimmed = raw.trim();
  if (trimmed.includes("@")) return trimmed.toLowerCase();
  const slug = accountUsername(trimmed) || "otealo";
  return `${slug}@otealo.com`;
}

function rowToClip(row: ClipRow, comments: Comment[]): Clip {
  return {
    id: row.id,
    user: row.username,
    displayName: row.display_name,
    caption: row.caption,
    city: row.city,
    image: row.image,
    video: row.video ?? undefined,
    likes: row.likes_count,
    comments,
    tags: row.tags ?? [],
    sound: row.sound,
    soundArtist: row.sound_artist,
    live: Boolean(row.live),
    viewers: row.viewers ?? undefined,
  };
}

export async function fetchClips(): Promise<Clip[]> {
  const [{ data: clipRows, error: clipErr }, { data: commentRows, error: commentErr }] =
    await Promise.all([
      supabase
        .from("clips")
        .select(
          "id,username,display_name,caption,city,image,video,likes_count,tags,sound,sound_artist,live,viewers",
        )
        .order("created_at", { ascending: false }),
      supabase
        .from("comments")
        .select("clip_id,username,body")
        .order("created_at", { ascending: true }),
    ]);

  if (clipErr) throw clipErr;
  if (commentErr) throw commentErr;

  const byClip = new Map<string, Comment[]>();
  for (const row of (commentRows ?? []) as CommentRow[]) {
    const list = byClip.get(row.clip_id) ?? [];
    list.push({ user: row.username, text: row.body });
    byClip.set(row.clip_id, list);
  }

  return ((clipRows ?? []) as ClipRow[]).map((row) =>
    rowToClip(row, byClip.get(row.id) ?? []),
  );
}

export async function fetchClipById(id: string): Promise<Clip | null> {
  const [{ data: row, error: clipErr }, { data: commentRows }] = await Promise.all([
    supabase
      .from("clips")
      .select(
        "id,username,display_name,caption,city,image,video,likes_count,tags,sound,sound_artist,live,viewers",
      )
      .eq("id", id)
      .maybeSingle(),
    supabase.from("comments").select("clip_id,username,body").eq("clip_id", id),
  ]);
  if (clipErr || !row) return null;
  const comments = ((commentRows ?? []) as CommentRow[]).map((item) => ({
    user: item.username,
    text: item.body,
  }));
  return rowToClip(row as ClipRow, comments);
}

export async function fetchEngagement(userId: string) {
  const [likes, saves, follows] = await Promise.all([
    supabase.from("likes").select("clip_id").eq("user_id", userId),
    supabase.from("saves").select("clip_id").eq("user_id", userId),
    supabase.from("follows").select("target_username").eq("follower_id", userId),
  ]);
  if (likes.error) throw likes.error;
  if (saves.error) throw saves.error;
  if (follows.error) throw follows.error;

  return {
    liked: Object.fromEntries(
      (likes.data ?? []).map((r: { clip_id: string }) => [r.clip_id, true]),
    ) as Record<string, boolean>,
    saved: Object.fromEntries(
      (saves.data ?? []).map((r: { clip_id: string }) => [r.clip_id, true]),
    ) as Record<string, boolean>,
    followed: Object.fromEntries(
      (follows.data ?? []).map((r: { target_username: string }) => [
        r.target_username,
        true,
      ]),
    ) as Record<string, boolean>,
  };
}

export async function persistLike(userId: string, clipId: string, liked: boolean) {
  if (liked) {
    const { error } = await supabase
      .from("likes")
      .upsert({ user_id: userId, clip_id: clipId });
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("user_id", userId)
      .eq("clip_id", clipId);
    if (error) throw error;
  }
}

export async function persistSave(userId: string, clipId: string, saved: boolean) {
  if (saved) {
    const { error } = await supabase
      .from("saves")
      .upsert({ user_id: userId, clip_id: clipId });
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("saves")
      .delete()
      .eq("user_id", userId)
      .eq("clip_id", clipId);
    if (error) throw error;
  }
}

export async function persistFollow(
  userId: string,
  username: string,
  following: boolean,
) {
  if (following) {
    const { error } = await supabase
      .from("follows")
      .upsert({ follower_id: userId, target_username: username });
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("follows")
      .delete()
      .eq("follower_id", userId)
      .eq("target_username", username);
    if (error) throw error;
  }
}

export async function persistComment(clipId: string, username: string, text: string) {
  const { error } = await supabase.from("comments").insert({
    clip_id: clipId,
    username,
    body: text,
  });
  if (error) throw error;
}

export async function uploadClipMedia(userId: string, file: File) {
  const ext = (file.name.split(".").pop() || "jpg").replace(/[^a-z0-9]/gi, "") || "jpg";
  const path = `${userId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("clips").upload(path, file, {
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw error;
  const { data } = supabase.storage.from("clips").getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const type = file.type.toLowerCase();
  const ok =
    type === "image/jpeg" ||
    type === "image/jpg" ||
    type === "image/png" ||
    type === "image/webp" ||
    /\.(jpe?g|png|webp)$/i.test(file.name);
  if (!ok) throw new Error(tCopy().photoBadType);
  if (file.size > 2 * 1024 * 1024) throw new Error(tCopy().photoTooBig);
  const ext = type.includes("png")
    ? "png"
    : type.includes("webp")
      ? "webp"
      : "jpg";
  const path = `${userId}/avatar.${ext}`;
  const { error } = await supabase.storage.from("clips").upload(path, file, {
    upsert: true,
    contentType: file.type || "image/jpeg",
  });
  if (error) throw new Error(asError(error, tCopy().photoFail));
  const { data } = supabase.storage.from("clips").getPublicUrl(path);
  const url = `${data.publicUrl}?t=${Date.now()}`;
  const { error: upErr } = await supabase
    .from("profiles")
    .update({ avatar_url: url })
    .eq("id", userId);
  if (upErr) throw new Error(asError(upErr, tCopy().photoFail));
  return url;
}

export async function persistClip(clip: Clip, authorId: string) {
  const { error } = await supabase.from("clips").insert({
    id: clip.id,
    author_id: authorId,
    username: clip.user,
    display_name: clip.displayName,
    caption: clip.caption,
    city: clip.city,
    image: clip.image,
    video: clip.video ?? null,
    likes_count: clip.likes,
    tags: clip.tags,
    sound: clip.sound,
    sound_artist: clip.soundArtist,
    live: Boolean(clip.live),
    viewers: clip.viewers ?? null,
  });
  if (error) throw error;
}

async function loadProfile(
  userId: string,
  fallbackName: string,
  email: string | null = null,
  picture: string | null = null,
): Promise<SessionProfile> {
  const { data } = await supabase
    .from("profiles")
    .select("username,display_name,city,bio,avatar_url")
    .eq("id", userId)
    .maybeSingle();
  if (data?.username) {
    const avatarUrl = (data.avatar_url as string | null) || picture;
    if (!data.avatar_url && picture) {
      await supabase.from("profiles").update({ avatar_url: picture }).eq("id", userId);
    }
    return {
      userId,
      username: data.username,
      displayName: data.display_name,
      city: data.city ?? null,
      bio: data.bio ?? null,
      email,
      avatarUrl,
    };
  }
  const username = accountUsername(fallbackName) || "otealo";
  await supabase.from("profiles").upsert({
    id: userId,
    username,
    display_name: fallbackName.trim() || username,
    hive_id: "mexico",
    region: "MX",
    avatar_url: picture,
  });
  return {
    userId,
    username,
    displayName: fallbackName.trim() || username,
    city: null,
    bio: null,
    email,
    avatarUrl: picture,
  };
}

export async function readSession(): Promise<SessionProfile | null> {
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return null;
  const meta = (user.user_metadata ?? {}) as {
    username?: string;
    display_name?: string;
    picture?: string;
    avatar_url?: string;
  };
  const picture =
    (typeof meta.picture === "string" && meta.picture) ||
    (typeof meta.avatar_url === "string" && meta.avatar_url) ||
    null;
  return loadProfile(
    user.id,
    meta.display_name || meta.username || user.email || "otealo",
    user.email ?? null,
    picture,
  );
}

export async function resolveLoginEmail(raw: string) {
  const trimmed = raw.trim();
  if (trimmed.includes("@")) return trimmed.toLowerCase();
  const { data, error } = await supabase.rpc("login_email_for_username", {
    u: accountUsername(trimmed),
  });
  if (!error && typeof data === "string" && data.includes("@")) return data;
  return accountEmail(trimmed);
}

export async function signInAccount(
  name: string,
  password: string,
): Promise<SessionProfile> {
  const email = await resolveLoginEmail(name);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(asError(error, "No se pudo entrar."));
  const user = data.user;
  if (!user) throw new Error("No se pudo entrar.");
  return loadProfile(user.id, name, user.email ?? null);
}

export async function signUpAccount(
  name: string,
  password: string,
  email?: string,
): Promise<SessionProfile> {
  const username = accountUsername(name);
  if (username.length < 3) {
    throw new Error("El usuario debe tener al menos 3 caracteres.");
  }
  if (password.length < 8) {
    throw new Error("La contraseña debe tener al menos 8 caracteres.");
  }
  const mail = email?.includes("@") ? email.trim().toLowerCase() : accountEmail(name);
  const { data, error } = await supabase.auth.signUp({
    email: mail,
    password,
    options: {
      data: { username, display_name: name.trim() || username },
      emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
    },
  });
  if (error) throw new Error(asError(error, "No se pudo crear la cuenta."));
  const user = data.user;
  if (!user) throw new Error("Revisa tu correo para confirmar la cuenta.");
  return loadProfile(user.id, name.trim() || username, user.email ?? mail);
}

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo:
        typeof window !== "undefined"
          ? `${window.location.origin}/`
          : "https://otealo.com/",
      queryParams: { prompt: "select_account" },
    },
  });
  if (error) throw new Error(asError(error, "No se pudo conectar con Google."));
}

export async function requestPasswordReset(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
    redirectTo:
      typeof window !== "undefined"
        ? `${window.location.origin}/nueva-clave`
        : undefined,
  });
  if (error) throw new Error(asError(error, "No se pudo enviar el correo."));
}

export async function updateAccountPassword(password: string) {
  if (password.length < 8) {
    throw new Error("La contraseña debe tener al menos 8 caracteres.");
  }
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw new Error(asError(error, "No se pudo guardar la nueva clave."));
}

export async function signOutAccount() {
  await supabase.auth.signOut();
}

export async function fetchDms(username: string): Promise<DirectMessage[]> {
  const { data, error } = await supabase
    .from("dms")
    .select("id,sender,recipient,body,created_at")
    .or(`sender.eq.${username},recipient.eq.${username}`)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return ((data ?? []) as { id: string; sender: string; recipient: string; body: string; created_at: string }[]).map(
    (row) => ({
      id: row.id,
      sender: row.sender,
      recipient: row.recipient,
      body: row.body,
      createdAt: row.created_at,
    }),
  );
}

export async function sendDm(
  senderId: string,
  sender: string,
  recipient: string,
  body: string,
) {
  const { error } = await supabase.from("dms").insert({
    sender_id: senderId,
    sender,
    recipient: accountUsername(recipient),
    body,
  });
  if (error) throw error;
}

export async function updateProfile(
  userId: string,
  patch: { displayName: string; bio: string },
): Promise<void> {
  const name = patch.displayName.trim();
  if (name.length < 2) throw new Error("El nombre debe tener al menos 2 caracteres.");
  const bio = patch.bio.trim().slice(0, 160);
  const { error } = await supabase
    .from("profiles")
    .update({ display_name: name, bio })
    .eq("id", userId);
  if (error) throw new Error(asError(error, "No se pudo guardar el perfil."));
  await supabase.auth.updateUser({ data: { display_name: name, bio } });
}

export async function fetchPublicProfile(username: string) {
  const { data } = await supabase
    .from("profiles")
    .select("username,display_name,city,bio,avatar_url")
    .eq("username", username)
    .maybeSingle();
  if (!data) return null;
  return {
    username: data.username as string,
    displayName: data.display_name as string,
    city: (data.city as string | null) ?? null,
    bio: (data.bio as string | null) ?? null,
    avatarUrl: (data.avatar_url as string | null) ?? null,
  };
}

export async function deleteOwnAccount(): Promise<void> {
  const { error } = await supabase.rpc("delete_own_account");
  if (error) throw new Error(asError(error, "No se pudo borrar la cuenta."));
  await supabase.auth.signOut();
}

export async function updateHomeCity(userId: string, city: string): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({ city, region: "MX", hive_id: "mexico" })
    .eq("id", userId);
  if (error) throw new Error(asError(error, "No se pudo guardar la ciudad."));
}

export async function fetchUsernames() {
  const { data, error } = await supabase
    .from("profiles")
    .select("username,display_name,avatar_url")
    .order("username", { ascending: true })
    .limit(80);
  if (error) throw error;
  return ((data ?? []) as { username: string; display_name: string; avatar_url: string | null }[]).map(
    (row) => ({
      username: row.username,
      displayName: row.display_name,
      avatarUrl: row.avatar_url,
    }),
  );
}

export function subscribeOjea(onChange: () => void) {
  const channel = supabase
    .channel("ojea-live")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "clips" },
      onChange,
    )
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "comments" },
      onChange,
    )
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "dms" },
      onChange,
    )
    .subscribe();
  return () => {
    void supabase.removeChannel(channel);
  };
}

export function subscribeAuth(onChange: () => void) {
  const { data } = supabase.auth.onAuthStateChange(() => {
    onChange();
  });
  return () => data.subscription.unsubscribe();
}
