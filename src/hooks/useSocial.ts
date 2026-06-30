import { useCallback, useState } from "react";
import type { AuthStatus, SocialAccount, SocialPost } from "@/lib/types";

type Busy = "status" | "accounts" | "posts" | "repost" | null;

export function useSocial() {
  const [auth, setAuth] = useState<AuthStatus | null>(null); // null = not yet checked
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [target, setTarget] = useState<string | null>(null);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [busy, setBusy] = useState<Busy>(null);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = useCallback(async (t: string) => {
    setBusy("posts");
    setError(null);
    setPosts([]);
    try {
      const res = await fetch(`/api/social/posts?target=${encodeURIComponent(t)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Couldn't load posts.");
      setPosts(data.posts as SocialPost[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't load posts.");
    } finally {
      setBusy(null);
    }
  }, []);

  const loadAccounts = useCallback(async () => {
    setBusy("accounts");
    setError(null);
    try {
      const res = await fetch("/api/social/accounts");
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Couldn't load accounts.");
      const list = data.accounts as SocialAccount[];
      setAccounts(list);
      if (list.length > 0) {
        setTarget(list[0].target);
        await loadPosts(list[0].target);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't load accounts.");
    } finally {
      setBusy(null);
    }
  }, [loadPosts]);

  const refreshStatus = useCallback(async () => {
    setBusy("status");
    try {
      const res = await fetch("/api/auth/status");
      const data = (await res.json()) as AuthStatus;
      setAuth(data);
      if (data.connected) await loadAccounts();
    } catch {
      setAuth({ configured: false, connected: false });
    } finally {
      setBusy(null);
    }
  }, [loadAccounts]);

  function connect() {
    window.location.href = "/api/auth/facebook/login";
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setAuth((a) => (a ? { ...a, connected: false, name: undefined } : a));
    setAccounts([]);
    setPosts([]);
    setTarget(null);
  }

  function selectTarget(t: string) {
    setTarget(t);
    void loadPosts(t);
  }

  async function repost(target: string, postId: string, text: string): Promise<void> {
    setBusy("repost");
    setError(null);
    try {
      const res = await fetch("/api/social/repost", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ target, postId, text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Couldn't update the post.");
    } finally {
      setBusy(null);
    }
  }

  const currentAccount = accounts.find((a) => a.target === target) ?? null;

  return {

    auth,
    accounts,
    target,
    currentAccount,
    posts,
    busy,
    error,
    refreshStatus,
    connect,
    logout,
    selectTarget,
    repost,
  };
}

export type SocialApi = ReturnType<typeof useSocial>;
