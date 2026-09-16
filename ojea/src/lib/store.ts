import { create } from "zustand";
import { mergeClipFeeds, SEED_CLIPS, SEED_NOTES, type Clip } from "./clips";
import { MX_CLIPS } from "./mx-clips";
import { tCopy } from "./i18n";
import {
  fetchClips,
  fetchDms,
  fetchEngagement,
  fetchUsernames,
  persistClip,
  persistComment,
  persistFollow,
  persistLike,
  persistSave,
  readSession,
  sendDm,
  signInAccount,
  signInWithGoogle,
  signOutAccount,
  signUpAccount,
  subscribeAuth,
  subscribeOjea,
  updateProfile,
  updateHomeCity,
  uploadClipMedia,
  deleteOwnAccount,
  type BackendStatus,
  type DirectMessage,
} from "./ojea-api";
import { setHomeCity, type RegionCity } from "./region";
import {
  clearGuestSession,
  readGuestSession,
  startGuestSession,
  readMuted,
  writeMuted,
} from "./session";

export type Tab = "foryou" | "following" | "live" | "friends";

export type Note = {
  id: string;
  text: string;
  time: string;
  unread: boolean;
  kind: "feed" | "user" | "sound";
  user?: string;
  sound?: string;
};

export type DirectoryUser = {
  username: string;
  displayName: string;
};

type State = {
  clips: Clip[];
  liked: Record<string, boolean>;
  saved: Record<string, boolean>;
  followed: Record<string, boolean>;
  hidden: Record<string, boolean>;
  reposted: Record<string, boolean>;
  notes: Note[];
  dms: DirectMessage[];
  directory: DirectoryUser[];
  tab: Tab;
  index: number;
  user: string | null;
  userId: string | null;
  displayName: string | null;
  city: string | null;
  bio: string | null;
  email: string | null;
  guest: boolean;
  guestRemainingMs: number;
  backend: BackendStatus;
  muted: boolean;
  paused: boolean;
  toast: string | null;
  authOpen: boolean;
  setTab: (tab: Tab) => void;
  setIndex: (i: number) => void;
  toggleLike: (id: string) => void;
  toggleSave: (id: string) => void;
  toggleFollow: (user: string) => void;
  hideClip: (id: string) => void;
  toggleRepost: (id: string) => void;
  bumpShares: (id: string) => void;
  addComment: (id: string, text: string) => void;
  publish: (clip: Clip, file?: File | null) => Promise<void>;
  login: (
    name: string,
    password: string,
    mode: "in" | "up",
    email?: string,
  ) => Promise<string | null>;
  loginGoogle: () => Promise<string | null>;
  enterGuest: () => void;
  logout: () => void;
  toggleMute: () => void;
  setMuted: (muted: boolean) => void;
  togglePaused: () => void;
  setPaused: (paused: boolean) => void;
  showToast: (msg: string) => void;
  openAuth: () => void;
  closeAuth: () => void;
  markNotesRead: () => void;
  sendMessage: (recipient: string, body: string) => Promise<string | null>;
  refreshDms: () => Promise<void>;
  saveProfile: (displayName: string, bio: string) => Promise<string | null>;
  saveHomeCity: (city: RegionCity) => Promise<string | null>;
  deleteAccount: () => Promise<string | null>;
  hydrate: (
    partial: Partial<Pick<State, "liked" | "saved" | "followed" | "hidden" | "reposted">>,
  ) => void;
  boot: () => Promise<void>;
  refreshClips: () => Promise<void>;
};

let unsubLive: (() => void) | null = null;
let unsubAuth: (() => void) | null = null;

export const useOjea = create<State>()((set, get) => ({
  clips: mergeClipFeeds(MX_CLIPS, SEED_CLIPS),
  liked: {},
  saved: {},
  followed: Object.fromEntries(
    SEED_CLIPS.filter((c) => c.following).map((c) => [c.user, true]),
  ),
  hidden: {},
  reposted: {},
  notes: SEED_NOTES,
  dms: [],
  directory: [],
  tab: "foryou",
  index: 0,
  user: null,
  userId: null,
  displayName: null,
  city: null,
  bio: null,
  email: null,
  guest: false,
  guestRemainingMs: 0,
  backend: "loading",
  muted: typeof window === "undefined" ? true : readMuted(),
  paused: false,
  toast: null,
  authOpen: false,
  setTab: (tab) => set({ tab, index: 0, paused: false }),
  setIndex: (index) => set({ index, paused: false }),
  toggleLike: (id) => {
    const liked = !get().liked[id];
    set({
      liked: { ...get().liked, [id]: liked },
      clips: get().clips.map((c) =>
        c.id === id ? { ...c, likes: c.likes + (liked ? 1 : -1) } : c,
      ),
    });
    const userId = get().userId;
    if (!userId) return;
    void persistLike(userId, id, liked).catch(() => {
      set({
        liked: { ...get().liked, [id]: !liked },
        clips: get().clips.map((c) =>
          c.id === id ? { ...c, likes: c.likes + (liked ? -1 : 1) } : c,
        ),
      });
      get().showToast(tCopy().errLike);
    });
  },
  toggleSave: (id) => {
    const saved = !get().saved[id];
    set({ saved: { ...get().saved, [id]: saved } });
    const userId = get().userId;
    if (!userId) return;
    void persistSave(userId, id, saved).catch(() => {
      set({ saved: { ...get().saved, [id]: !saved } });
      get().showToast(tCopy().errSave);
    });
  },
  toggleFollow: (user) => {
    const following = !get().followed[user];
    set({ followed: { ...get().followed, [user]: following } });
    const userId = get().userId;
    if (!userId) return;
    void persistFollow(userId, user, following).catch(() => {
      set({ followed: { ...get().followed, [user]: !following } });
      get().showToast(tCopy().errFollow);
    });
  },
  hideClip: (id) => {
    set({ hidden: { ...get().hidden, [id]: true } });
    get().showToast(tCopy().notInterestedOk);
    const visible = get().clips.filter((c) => !get().hidden[c.id]);
    const i = Math.min(get().index, Math.max(0, visible.length - 1));
    set({ index: i, paused: false });
  },
  toggleRepost: (id) => {
    const on = !get().reposted[id];
    set({ reposted: { ...get().reposted, [id]: on } });
    get().showToast(on ? tCopy().repostedOk : tCopy().repostedOff);
  },
  bumpShares: (id) => {
    set({
      clips: get().clips.map((c) =>
        c.id === id ? { ...c, shares: (c.shares ?? 0) + 1 } : c,
      ),
    });
  },
  addComment: (id, text) => {
    const who = get().user ?? "invitado";
    set({
      clips: get().clips.map((c) =>
        c.id === id
          ? { ...c, comments: [...c.comments, { user: who, text }] }
          : c,
      ),
    });
    if (!get().userId) return;
    void persistComment(id, who, text).catch(() => {
      get().showToast(tCopy().errComment);
    });
  },
  publish: async (clip, file) => {
    const userId = get().userId;
    if (!userId) {
      get().openAuth();
      throw new Error("login required");
    }
    let next = clip;
    if (file) {
      const url = await uploadClipMedia(userId, file);
      if (file.type.startsWith("video/")) {
        next = { ...clip, video: url };
      } else {
        next = { ...clip, image: url, video: undefined };
      }
    }
    set({ clips: [next, ...get().clips], index: 0, tab: "foryou" });
    try {
      await persistClip(next, userId);
      get().showToast(tCopy().errPublishOk);
    } catch {
      set({ clips: get().clips.filter((c) => c.id !== next.id) });
      get().showToast(tCopy().errPublish);
      throw new Error("publish failed");
    }
  },
  login: async (name, password, mode, email) => {
    try {
      const profile =
        mode === "up"
          ? await signUpAccount(name, password, email)
          : await signInAccount(name, password);
      const engagement = await fetchEngagement(profile.userId);
      clearGuestSession();
      set({
        user: profile.username,
        userId: profile.userId,
        displayName: profile.displayName,
        city: profile.city,
        bio: profile.bio,
        email: profile.email,
        guest: false,
        guestRemainingMs: 0,
        authOpen: false,
        liked: { ...get().liked, ...engagement.liked },
        saved: { ...get().saved, ...engagement.saved },
        followed: { ...get().followed, ...engagement.followed },
      });
      void get().refreshDms();
      return null;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : tCopy().errLogin;
      return message;
    }
  },
  loginGoogle: async () => {
    try {
      await signInWithGoogle();
      return null;
    } catch (err) {
      return err instanceof Error ? err.message : tCopy().errGoogle;
    }
  },
  enterGuest: () => {
    startGuestSession();
    const { remainingMs } = readGuestSession();
    set({
      user: "invitado",
      userId: null,
      displayName: "Invitado",
      city: null,
      bio: null,
      email: null,
      guest: true,
      guestRemainingMs: remainingMs,
      authOpen: false,
    });
  },
  logout: () => {
    clearGuestSession();
    void signOutAccount();
    set({
      user: null,
      userId: null,
      displayName: null,
      city: null,
      bio: null,
      email: null,
      guest: false,
      guestRemainingMs: 0,
      dms: [],
    });
  },
  toggleMute: () => get().setMuted(!get().muted),
  setMuted: (muted) => {
    writeMuted(muted);
    set({ muted });
  },
  togglePaused: () => set({ paused: !get().paused }),
  setPaused: (paused) => set({ paused }),
  showToast: (msg) => {
    set({ toast: msg });
    window.setTimeout(() => {
      if (get().toast === msg) set({ toast: null });
    }, 1800);
  },
  openAuth: () => set({ authOpen: true }),
  closeAuth: () => set({ authOpen: false }),
  markNotesRead: () =>
    set({ notes: get().notes.map((n) => ({ ...n, unread: false })) }),
  sendMessage: async (recipient, body) => {
    const { userId, user } = get();
    if (!userId || !user) return tCopy().errDmLogin;
    const to = recipient.replace(/^@/, "").trim();
    if (!to) return tCopy().errDmTo;
    const text = body.trim();
    if (!text) return tCopy().errDmBody;
    try {
      await sendDm(userId, user, to, text);
      await get().refreshDms();
      return null;
    } catch {
      return tCopy().errDm;
    }
  },
  refreshDms: async () => {
    const user = get().user;
    const userId = get().userId;
    if (!user || !userId) return;
    try {
      const [dms, directory] = await Promise.all([
        fetchDms(user),
        fetchUsernames().catch(() => get().directory),
      ]);
      set({ dms, directory });
    } catch {
      /* keep current */
    }
  },
  saveProfile: async (displayName, bio) => {
    const userId = get().userId;
    if (!userId) return tCopy().errProfileLogin;
    try {
      await updateProfile(userId, { displayName, bio });
      set({ displayName: displayName.trim(), bio: bio.trim() });
      get().showToast(tCopy().errProfileOk);
      return null;
    } catch (err) {
      return err instanceof Error ? err.message : tCopy().errGeneric;
    }
  },
  deleteAccount: async () => {
    const userId = get().userId;
    if (!userId) return tCopy().errProfileLogin;
    try {
      await deleteOwnAccount();
      get().logout();
      return null;
    } catch (err) {
      return err instanceof Error ? err.message : tCopy().errDelete;
    }
  },
  saveHomeCity: async (city) => {
    setHomeCity(city);
    const userId = get().userId;
    if (!userId) return null;
    try {
      await updateHomeCity(userId, city);
      set({ city });
      return null;
    } catch (err) {
      return err instanceof Error ? err.message : tCopy().errGeneric;
    }
  },
  hydrate: (partial) => set(partial),
  refreshClips: async () => {
    try {
      const clips = await fetchClips();
      set({ clips: mergeClipFeeds(MX_CLIPS, clips, SEED_CLIPS), backend: "live" });
    } catch {
      /* keep current */
    }
  },
  boot: async () => {
    try {
      const [clips, session] = await Promise.all([fetchClips(), readSession()]);
      const engagement = session
        ? await fetchEngagement(session.userId)
        : null;
      const guestState = !session ? readGuestSession() : { guest: false, remainingMs: 0 };
      set({
        clips: mergeClipFeeds(MX_CLIPS, clips, SEED_CLIPS),
        backend: "live",
        user: session?.username ?? (guestState.guest ? "invitado" : null),
        userId: session?.userId ?? null,
        displayName: session?.displayName ?? (guestState.guest ? "Invitado" : null),
        city: session?.city ?? null,
        bio: session?.bio ?? null,
        email: session?.email ?? null,
        guest: guestState.guest,
        guestRemainingMs: guestState.remainingMs,
        liked: engagement ? { ...get().liked, ...engagement.liked } : get().liked,
        saved: engagement ? { ...get().saved, ...engagement.saved } : get().saved,
        followed: engagement
          ? { ...get().followed, ...engagement.followed }
          : get().followed,
      });
      if (session) void get().refreshDms();
      if (session?.city) setHomeCity(session.city as RegionCity);
      unsubLive?.();
      unsubLive = subscribeOjea(() => {
        void get().refreshClips();
        void get().refreshDms();
      });
      unsubAuth?.();
      unsubAuth = subscribeAuth(() => {
        void readSession().then(async (next) => {
          if (!next) return;
          const eng = await fetchEngagement(next.userId);
          clearGuestSession();
          set({
            user: next.username,
            userId: next.userId,
            displayName: next.displayName,
            city: next.city,
            bio: next.bio,
            email: next.email,
            guest: false,
            guestRemainingMs: 0,
            liked: { ...get().liked, ...eng.liked },
            saved: { ...get().saved, ...eng.saved },
            followed: { ...get().followed, ...eng.followed },
          });
          void get().refreshDms();
        });
      });
    } catch {
      set({ backend: "offline" });
    }
  },
}));

export function formatCount(n: number) {
  const c = tCopy();
  if (n >= 1_000_000)
    return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}${c.mSuffix}`;
  if (n >= 1000)
    return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "")}${c.kSuffix}`;
  return String(n);
}

export function initials(name: string) {
  return name
    .split(/[.\s_]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");
}
