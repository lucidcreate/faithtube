import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./useAuth";

export function useUserLibrary() {
  const { user } = useAuth();

  const [likedVideos, setLikedVideos] = useState<any[]>([]);
  const [savedVideos, setSavedVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadLibrary() {
    if (!user) return;

    setLoading(true);

    const [likesRes, favRes] = await Promise.all([
      supabase
        .from("likes")
        .select(`videos (*)`)
        .eq("user_id", user.id),

      supabase
        .from("favorites")
        .select(`videos (*)`)
        .eq("user_id", user.id),
    ]);

    setLikedVideos(
      (likesRes.data || []).map((x: any) => x.videos).filter(Boolean)
    );

    setSavedVideos(
      (favRes.data || []).map((x: any) => x.videos).filter(Boolean)
    );

    setLoading(false);
  }

  useEffect(() => {
    loadLibrary();
  }, [user]);

  return {
    likedVideos,
    savedVideos,
    refreshLibrary: loadLibrary,
    loading,
  };
}