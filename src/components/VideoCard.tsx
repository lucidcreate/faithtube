import { Link } from "react-router-dom";

type Video = {
  id: number;
  title: string;
  slug: string;
  poster_url?: string | null;
  description?: string | null;
  duration?: string | null;
  category?: string | null;
  tags?: string[] | null;
};

export default function VideoCard({ video }: { video: Video }) {
  return (
    <Link to={`/watch/${video.slug}`} className="video-card">
      <div className="video-poster">
        {video.poster_url ? (
          <img src={video.poster_url} alt={video.title} />
        ) : (
          <div className="no-poster">No Poster</div>
        )}

        <div className="video-overlay">
          <span className="video-badge">{video.category || "Video"}</span>
          <span className="video-duration">{video.duration || ""}</span>
        </div>
      </div>

      <div className="video-body">
        <h3 className="video-title">{video.title}</h3>
        <p className="video-desc">
          {video.description || "Faith-filled content."}
        </p>

        {video.tags && video.tags.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              marginTop: "10px",
            }}
          >
            {video.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: "12px",
                  padding: "4px 8px",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}