import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import VideoCard from "../components/VideoCard";
import { useVideos } from "../hooks/useVideos";

type VideoItem = {
  id: number;
  title: string;
  slug: string;
  poster_url?: string | null;
  description?: string | null;
  duration?: string | null;
  category?: string | null;
  tags?: string[] | null;
};

function FeaturedRow({
  title,
  items,
}: {
  title: string;
  items: VideoItem[];
}) {
  if (!items.length) return null;

  return (
    <section className="section">
      <div className="row-header">
        <h2 className="section-title">{title}</h2>
        <Link to="/browse" className="row-link">
          View all
        </Link>
      </div>

      <div className="video-row">
        {items.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  const { videos, loading } = useVideos();
  const [search, setSearch] = useState("");

  const filteredVideos = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return videos as VideoItem[];

    return (videos as VideoItem[]).filter((video) => {
      const title = video.title?.toLowerCase() || "";
      const description = video.description?.toLowerCase() || "";
      const category = video.category?.toLowerCase() || "";
      const tags = Array.isArray(video.tags) ? video.tags : [];

      return (
        title.includes(q) ||
        description.includes(q) ||
        category.includes(q) ||
        tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [videos, search]);

  const latestReleases = filteredVideos.slice(0, 10);

  const bibleStories = filteredVideos.filter((v) =>
    (v.category || "").toLowerCase().includes("bible")
  );

  const shortFilms = filteredVideos.filter((v) =>
    (v.category || "").toLowerCase().includes("short")
  );

  const testimonies = filteredVideos.filter((v) =>
    (v.category || "").toLowerCase().includes("testimony")
  );

  const worship = filteredVideos.filter((v) =>
    (v.category || "").toLowerCase().includes("worship")
  );

  const kids = filteredVideos.filter((v) =>
    (v.category || "").toLowerCase().includes("kid")
  );

  return (
    <>
      <section className="hero hero-bg-only">
        <div className="hero-bg-image" />

        <div className="hero-overlay">
          <div className="hero-badge">Christian Streaming Platform</div>

          <h1 className="hero-title">
            Watch faith-filled and Christian movies.
          </h1>

          <p className="hero-subtitle">
            Stream inspiring Christian films, testimonies, worship content, and
            uplifting stories for the whole family on FaithTube.
          </p>

          <div className="hero-actions">
            <Link to="/browse" className="btn btn-primary">
              Start Watching
            </Link>

            <Link to="/signup" className="btn btn-secondary">
              Join Free
            </Link>
          </div>

          <div style={{ marginTop: "22px", maxWidth: "520px" }}>
            <input
              className="input"
              type="text"
              placeholder="Search movies, Bible stories, testimonies, tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="section">
        {loading ? (
          <p className="soft">Loading videos...</p>
        ) : filteredVideos.length === 0 ? (
          <div className="info-card">
            <h2 className="section-title">No videos found</h2>
            <p className="soft">
              Try a different search term or add more movies to Supabase.
            </p>
          </div>
        ) : (
          <>
            <FeaturedRow title="Latest Releases" items={latestReleases} />
            <FeaturedRow title="Bible Stories" items={bibleStories} />
            <FeaturedRow title="Short Films" items={shortFilms} />
            <FeaturedRow title="Testimonies" items={testimonies} />
            <FeaturedRow title="Worship" items={worship} />
            <FeaturedRow title="Kids & Family" items={kids} />

            <section className="section">
              <div className="row-header">
                <h2 className="section-title">Browse Everything</h2>
                <Link to="/browse" className="row-link">
                  Full library
                </Link>
              </div>

              <div className="video-grid">
                {filteredVideos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            </section>
          </>
        )}
      </section>
      <section className="section">
  <div className="info-card">
    <h2 className="section-title">About FaithTube</h2>

    <p className="soft">
      FaithTube is a Christian streaming platform dedicated to sharing
      faith-filled movies, Bible stories, testimonies, and inspiring content
      for believers around the world. Our mission is to provide uplifting,
      family-friendly entertainment that strengthens faith and encourages
      spiritual growth.
    </p>

    <p className="soft">
      From powerful Bible stories to modern Christian short films, FaithTube
      curates meaningful video content designed to inspire, teach, and bring
      hope to viewers of all ages.
    </p>
  </div>
</section>
<section className="section">
  <div className="info-card">
    <h2 className="section-title">Why Christian Movies Matter</h2>

    <p className="soft">
      Christian movies and faith-based films play a powerful role in sharing
      the message of hope, redemption, and God’s love. Through storytelling,
      these films bring Biblical truths to life and help viewers connect with
      Scripture in a meaningful way.
    </p>

    <p className="soft">
      Whether you are watching a Bible story, a testimony, or a short film,
      each piece of content on FaithTube is designed to encourage your walk
      with God and inspire your daily life.
    </p>
  </div>
</section>

    </>
  );
}