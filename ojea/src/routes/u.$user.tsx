import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ClipGrid } from "@/components/clip-grid";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/lib/i18n";
import { fetchPublicProfile } from "@/lib/ojea-api";
import { useOjea } from "@/lib/store";
import { AvatarCircle } from "@/components/avatar";

export const Route = createFileRoute("/u/$user")({ component: Creator });

function Creator() {
  const { user } = Route.useParams();
  const { clips, followed, toggleFollow, avatars } = useOjea();
  const c = useCopy();
  const theirs = clips.filter((clip) => clip.user === user);
  const [profile, setProfile] = useState<{
    displayName: string;
    city: string | null;
    bio: string | null;
    avatarUrl: string | null;
  } | null>(null);
  const name = profile?.displayName ?? theirs[0]?.displayName ?? user;
  const city = profile?.city ?? theirs[0]?.city;
  const isFollowed = !!followed[user];

  useEffect(() => {
    let alive = true;
    void fetchPublicProfile(user).then((row) => {
      if (alive && row) {
        setProfile({
          displayName: row.displayName,
          city: row.city,
          bio: row.bio,
          avatarUrl: row.avatarUrl,
        });
      }
    });
    return () => {
      alive = false;
    };
  }, [user]);

  return (
    <div className="mx-auto max-w-lg px-5 py-10">
      <div className="flex items-center gap-4">
        <AvatarCircle name={name} src={profile?.avatarUrl ?? avatars[user]} size="lg" />
        <div>
          <h1 className="font-display text-3xl tracking-tight">@{user}</h1>
          <p className="text-sm text-muted">
            {name}
            {city ? ` · ${city}` : ""}
          </p>
        </div>
      </div>
      {profile?.bio ? (
        <p className="mt-4 max-w-sm text-sm text-fg/90">{profile.bio}</p>
      ) : null}
      <div className="mt-6 flex gap-2">
        <Button onClick={() => toggleFollow(user)}>
          {isFollowed ? c.following : c.follow}
        </Button>
        <Link
          to="/inbox"
          search={{ to: user }}
          className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-transparent px-4 text-sm font-medium text-primary"
        >
          {c.creatorMessage}
        </Link>
        <Link
          to="/"
          className="inline-flex h-11 items-center justify-center rounded-md px-4 text-sm font-medium text-fg hover:bg-elevated"
        >
          {c.seeInFeed}
        </Link>
      </div>
      <p className="mt-8 text-xs tracking-widest text-muted uppercase">
        {theirs.length} {c.clips.toLowerCase()}
      </p>
      <div className="mt-3">
        <ClipGrid clips={theirs} />
      </div>
    </div>
  );
}
