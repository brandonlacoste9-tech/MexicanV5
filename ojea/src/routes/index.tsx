import { createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { ClipStage } from "@/components/clip-stage";
import { FRIEND_USERS } from "@/lib/clips";
import { useOjea } from "@/lib/store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { clips, tab, followed, hidden, setTab } = useOjea();
  const searchStr = useRouterState({ select: (s) => s.location.searchStr });
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(
      searchStr.startsWith("?") ? searchStr.slice(1) : searchStr,
    );
    const v = params.get("v");
    const feed = params.get("tab");
    if (feed === "following" || feed === "foryou") {
      setTab(feed);
    }
    if (!v) return;
    void navigate({ to: "/c/$id", params: { id: v }, replace: true });
  }, [searchStr, navigate, setTab]);

  const list = clips.filter((c) => !hidden[c.id]).filter((c) => {
    if (tab === "following") return followed[c.user];
    if (tab === "live") return c.live;
    if (tab === "friends") return followed[c.user] && FRIEND_USERS.includes(c.user);
    return true;
  });

  return <ClipStage clips={list} />;
}