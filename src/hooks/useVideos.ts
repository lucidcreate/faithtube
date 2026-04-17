import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export type VideoRow = {
  id: number;
  title: string;
  slug: string;
  poster_url: string | null;
  description: string | null;
  duration: string | null;
  category?: string | null;
  video_url: string;
  source_type: string;
  tags?: string[] | null;
};

export function useVideos() {
  const [videos, setVideos] = useState<VideoRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVideos() {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setVideos(data as VideoRow[]);
      }

      setLoading(false);
    }

    loadVideos();
  }, []);

  return { videos, loading };
}