import { useMemo, useState } from "react";
import VideoCard from "../components/VideoCard";
import { useVideos } from "../hooks/useVideos";

export default function BrowsePage() {
  const { videos, loading } = useVideos();
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();

    videos.forEach((video) => {
      (video.tags || []).forEach((tag) => tagSet.add(tag));
    });

    return ["All", ...Array.from(tagSet).sort()];
  }, [videos]);

  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      const matchesSearch =
        video.title?.toLowerCase().includes(search.toLowerCase()) ||
        video.description?.toLowerCase().includes(search.toLowerCase()) ||
        video.category?.toLowerCase().includes(search.toLowerCase()) ||
        (video.tags || []).some((tag) =>
          tag.toLowerCase().includes(search.toLowerCase())
        );

      const matchesTag =
        selectedTag === "All" || (video.tags || []).includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [videos, search, selectedTag]);

  return (
    <section className="section">
      <h1 className="section-title">Browse Library</h1>
      <p className="section-subtitle">
        Search movies, explore topics, and discover faith-filled content.
      </p>

      <div className="mt-4" style={{ display: "grid", gap: "16px" }}>
        <input
          className="input"
          type="text"
          placeholder="Search by title, description, category, or tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {allTags.map((tag) => (
            <button
              key={tag}
              className="icon-btn"
              type="button"
              onClick={() => setSelectedTag(tag)}
              style={{
                border:
                  selectedTag === tag
                    ? "1px solid rgba(250,204,21,0.5)"
                    : undefined,
                background:
                  selectedTag === tag ? "rgba(250,204,21,0.12)" : undefined,
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="soft mt-4">Loading library...</p>
      ) : filteredVideos.length === 0 ? (
        <p className="soft mt-4">No videos found.</p>
      ) : (
        <div className="video-grid mt-4">
          {filteredVideos.map((video) => (
            <VideoCard key={video.id} video={{ ...video, category: video.category ?? undefined }} />
          ))}
        </div>
      )}
    </section>
  );
}