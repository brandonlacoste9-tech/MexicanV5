import { create } from "zustand";
import { mergeClipFeeds, mergeIntoShuffled, shuffleClips, SEED_CLIPS, SEED_NOTES, type Clip } from "./clips";
import { tCopy } from "./i18n";
import {
  fetchClips,
  fetchDms,
  fetchEngagement,
  fetchUsernames,
  persistClip,
  persistClipIdea,
  persistComment,
  persistFollow,
  persistLike,
  persistSave,
  persistReport,
  persistNotification,
  fetchNotifications,
  markNotificationsRead,
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
  uploadAvatar,
  deleteOwnAccount,
  type BackendStatus,
  type DirectMessage,
} from "./ojea-api";
import { setHomeCity, type RegionCity } from "./region";
import type { ClipCountry, SeriesId } from "./culture";
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
  avatarUrl?: string | null;
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
  countryFilter: "ALL" | ClipCountry;
  seriesFilter: "ALL" | SeriesId;
  index: number;
  user: string | null;
  userId: string | null;
  displayName: string | null;
  city: string | null;
  bio: string | null;
  email: string | null;
  avatarUrl: string | null;
  avatars: Record<string, string>;
  guest: boolean;
  guestRemainingMs: number;
  backend: BackendStatus;
  muted: boolean;
  paused: boolean;
  cinema: boolean;
  toast: string | null;
  authOpen: boolean;
  setTab: (tab: Tab) => void;
  setCountryFilter: (f: "ALL" | ClipCountry) => void;
  setSeriesFilter: (f: "ALL" | SeriesId) => void;
  setIndex: (i: number) => void;
  toggleLike: (id: string) => void;
  toggleSave: (id: string) => void;
  toggleFollow: (user: string) => void;
  hideClip: (id: string) => void;
  reportClip: (id: string) => Promise<void>;
  toggleRepost: (id: string) => void;
  bumpShares: (id: string) => void;
  addComment: (id: string, text: string) => void;
  publish: (clip: Clip, file?: File | null) => Promise<void>;
  submitIdea: (input: {
    title: string;
    series: string;
    country: string;
    scriptOutline: string;
    notes?: string;
  }) => Promise<string | null>;
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
  toggleCinema: () => void;
  showToast: (msg: string) => void;
  openAuth: () => void;
  closeAuth: () => void;
  markNotesRead: () => void;
  sendMessage: (recipient: string, body: string) => Promise<string | null>;
  refreshDms: () => Promise<void>;
  saveProfile: (displayName: string, bio: string) => Promise<string | null>;
  uploadPhoto: (file: File) => Promise<string | null>;
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
  clips: mergeClipFeeds(SEED_CLIPS),
  liked: {},
  saved: {},
  followed: {},
  hidden: {},
  reposted: {},
  notes: SEED_NOTES,
  dms: [],
  directory: [],
  tab: "foryou",
  countryFilter: "MX",
  seriesFilter: "ALL",
  index: 0,
  user: null,
  userId: null,
  displayName: null,
  city: null,
  bio: null,
  email: null,
  avatarUrl: null,
  avatars: {},
  guest: false,
  guestRemainingMs: 0,
  backend: "loading",
  muted: true,
  paused: false,
  cinema: false,
  toast: null,
  authOpen: false,
  setTab: (tab) => set({ tab, index: 0, paused: false, cinema: false }),
  setCountryFilter: (countryFilter) => set({ countryFilter, index: 0, paused: false }),
  setSeriesFilter: (seriesFilter) => set({ seriesFilter, index: 0, paused: false }),
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
    void persistLike(userId, id, liked)
      .then(() => {
        if (!liked) return;
        const clip = get().clips.find((c) => c.id === id);
        const actor = get().user;
        if (clip && actor) {
          void persistNotification({
            recipient: clip.user,
            actor,
            kind: "like",
            clipId: id,
          });
        }
      })
      .catch(() => {
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
    void persistFollow(userId, user, following)
      .then(() => {
        const actor = get().user;
        if (following && actor) {
          void persistNotification({
            recipient: user,
            actor,
            kind: "follow",
          });
        }
      })
      .catch(() => {
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
  reportClip: async (id) => {
    const userId = get().userId;
    if (!userId) {
      get().openAuth();
      get().showToast(tCopy().reportedNeedLogin);
      return;
    }
    try {
      const result = await persistReport(userId, id);
      set({ hidden: { ...get().hidden, [id]: true } });
      const visible = get().clips.filter((c) => !get().hidden[c.id]);
      const i = Math.min(get().index, Math.max(0, visible.length - 1));
      set({ index: i, paused: false });
      get().showToast(
        result === "already" ? tCopy().reportedAlready : tCopy().reportedOk,
      );
    } catch (err) {
      get().showToast(
        err instanceof Error ? err.message : tCopy().reportedFail,
      );
    }
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
    void persistComment(id, who, text, get().userId)
      .then(() => {
        const clip = get().clips.find((c) => c.id === id);
        if (clip) {
          void persistNotification({
            recipient: clip.user,
            actor: who,
            kind: "comment",
            clipId: id,
          });
        }
      })
      .catch(() => {
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
  submitIdea: async (input) => {
    const userId = get().userId;
    if (!userId) {
      get().openAuth();
      return tCopy().reportedNeedLogin;
    }
    if (!input.title.trim() || !input.scriptOutline.trim()) return tCopy().ideaNeed;
    try {
      await persistClipIdea({ userId, ...input });
      get().showToast(tCopy().ideaOk);
      return null;
    } catch (err) {
      return err instanceof Error ? err.message : tCopy().ideaFail;
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
        avatarUrl: profile.avatarUrl,
        avatars: profile.avatarUrl
          ? { ...get().avatars, [profile.username]: profile.avatarUrl }
          : get().avatars,
        guest: false,
        guestRemainingMs: 0,
        authOpen: false,
        tab: "foryou",
        index: 0,
        paused: false,
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
      avatarUrl: null,
      guest: true,
      guestRemainingMs: remainingMs,
      authOpen: false,
      tab: "foryou",
      countryFilter: "MX",
      seriesFilter: "ALL",
      index: 0,
      paused: false,
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
      avatarUrl: null,
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
  toggleCinema: () => set({ cinema: !get().cinema }),
  showToast: (msg) => {
    set({ toast: msg });
    window.setTimeout(() => {
      if (get().toast === msg) set({ toast: null });
    }, 1800);
  },
  openAuth: () => set({ authOpen: true }),
  closeAuth: () => set({ authOpen: false }),
  markNotesRead: () => {
    set({ notes: get().notes.map((n) => ({ ...n, unread: false })) });
    const user = get().user;
    if (user && get().userId) void markNotificationsRead(user);
  },
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
      const [dms, directory, notes] = await Promise.all([
        fetchDms(user),
        fetchUsernames().catch(() => get().directory),
        fetchNotifications(user).catch(() => get().notes),
      ]);
      set({
        dms,
        directory,
        notes,
        avatars: mergeAvatars(get().avatars, directory, get().user, get().avatarUrl),
      });
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
  uploadPhoto: async (file) => {
    const userId = get().userId;
    const user = get().user;
    if (!userId) return tCopy().errProfileLogin;
    try {
      const url = await uploadAvatar(userId, file);
      set({
        avatarUrl: url,
        avatars: user ? { ...get().avatars, [user]: url } : get().avatars,
      });
      get().showToast(tCopy().photoOk);
      return null;
    } catch (err) {
      return err instanceof Error ? err.message : tCopy().photoFail;
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
      set({
        clips: mergeIntoShuffled(get().clips, mergeClipFeeds(clips, SEED_CLIPS)),
        backend: "live",
      });
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
        clips: shuffleClips(mergeClipFeeds(clips, SEED_CLIPS)),
        backend: "live",
        muted: true,
        paused: false,
        tab: get().tab === "following" && !session ? "foryou" : get().tab,
        user: session?.username ?? (guestState.guest ? "invitado" : null),
        userId: session?.userId ?? null,
        displayName: session?.displayName ?? (guestState.guest ? "Invitado" : null),
        city: session?.city ?? null,
        bio: session?.bio ?? null,
        email: session?.email ?? null,
        avatarUrl: session?.avatarUrl ?? null,
        avatars: session?.avatarUrl
          ? { ...get().avatars, [session.username]: session.avatarUrl }
          : get().avatars,
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
            avatarUrl: next.avatarUrl,
            avatars: next.avatarUrl
              ? { ...get().avatars, [next.username]: next.avatarUrl }
              : get().avatars,
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
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "OT";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function mergeAvatars(
  prev: Record<string, string>,
  directory: DirectoryUser[],
  username?: string | null,
  url?: string | null,
) {
  const next = { ...prev };
  for (const row of directory) {
    if (row.avatarUrl) next[row.username] = row.avatarUrl;
  }
  if (username && url) next[username] = url;
  return next;
}
