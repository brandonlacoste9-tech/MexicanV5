import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { ClipStage } from "@/components/clip-stage";
import { FRIEND_USERS } from "@/lib/clips";
import { useOjea } from "@/lib/store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { clips, tab, followed, hidden, setIndex, setTab } = useOjea();
  const searchStr = useRouterState({ select: (s) => s.location.searchStr });

  useEffect(() => {
    const params = new URLSearchParams(
      searchStr.startsWith("?") ? searchStr.slice(1) : searchStr,
    );
    const v = params.get("v");
    const feed = params.get("tab");
    if (feed === "following" || feed === "live" || feed === "friends" || feed === "foryou") {
      setTab(feed);
    }
    if (!v) return;
    const i = clips.findIndex((c) => c.id === v);
    if (i >= 0) {
      setTab("foryou");
      setIndex(i);
    }
  }, [searchStr, clips, setIndex, setTab]);

  const list = clips.filter((c) => !hidden[c.id]).filter((c) => {
    if (tab === "following") return followed[c.user];
    if (tab === "live") return c.live;
    if (tab === "friends") return followed[c.user] && FRIEND_USERS.includes(c.user);
    return true;
  });

  return <ClipStage clips={list} />;
}