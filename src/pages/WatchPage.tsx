import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";
import { useVideos } from "../hooks/useVideos";
import AdBanner from "../components/AdBanner";

type CommentRow = {
  id: number;
  content: string;
  created_at: string;
  user_id: string;
  user_name: string | null;
  user_avatar_url: string | null;
};

const FACEBOOK_APP_ID = "YOUR_FACEBOOK_APP_ID";

export default function WatchPage() {
  const { slug } = useParams();
  const { videos, loading: videosLoading } = useVideos();
  const { user } = useAuth();

  const video = useMemo(
    () => videos.find((item) => item.slug === slug),
    [videos, slug]
  );

  const related = useMemo(
    () => videos.filter((item) => item.slug !== slug).slice(0, 4),
    [videos, slug]
  );

  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [commentText, setCommentText] = useState("");
  const [message, setMessage] = useState("");

  const [liking, setLiking] = useState(false);
  const [savingFavorite, setSavingFavorite] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [postingComment, setPostingComment] = useState(false);

  useEffect(() => {
    async function loadEngagement() {
      if (!video) return;

      setMessage("");

      try {
        const [
          likesCountRes,
          commentsRes,
          likeRes,
          favoriteRes,
        ] = await Promise.all([
          supabase
            .from("likes")
            .select("*", { count: "exact", head: true })
            .eq("video_id", video.id),

          supabase
            .from("comments")
            .select("id, content, created_at, user_id, user_name, user_avatar_url")
            .eq("video_id", video.id)
            .order("created_at", { ascending: false }),

          user
            ? supabase
                .from("likes")
                .select("id")
                .eq("video_id", video.id)
                .eq("user_id", user.id)
                .maybeSingle()
            : Promise.resolve({ data: null, error: null }),

          user
            ? supabase
                .from("favorites")
                .select("id")
                .eq("video_id", video.id)
                .eq("user_id", user.id)
                .maybeSingle()
            : Promise.resolve({ data: null, error: null }),
        ]);

        setLikesCount(likesCountRes.count || 0);
        setComments((commentsRes.data || []) as CommentRow[]);
        setLiked(!!likeRes.data);
        setSaved(!!favoriteRes.data);
      } catch (err: any) {
        setMessage(err.message || "Could not load video activity.");
      }
    }

    loadEngagement();
  }, [video, user]);

  async function toggleLike() {
    if (!user || !video) {
      setMessage("Please log in first.");
      return;
    }

    if (liking) return;

    setLiking(true);
    setMessage("");

    try {
      if (liked) {
        const { error } = await supabase
          .from("likes")
          .delete()
          .eq("user_id", user.id)
          .eq("video_id", video.id);

        if (error) throw error;

        setLiked(false);
        setLikesCount((n) => Math.max(0, n - 1));
        setMessage("Removed from liked videos.");
      } else {
        const { error } = await supabase
          .from("likes")
          .upsert(
            {
              user_id: user.id,
              video_id: video.id,
            },
            { onConflict: "user_id,video_id" }
          );

        if (error) throw error;

        setLiked(true);
        setLikesCount((n) => n + 1);
        setMessage("Added to liked videos.");
      }
    } catch (err: any) {
      setMessage(err.message || "Could not update like.");
    } finally {
      setLiking(false);
    }
  }

  async function toggleFavorite() {
    if (!user || !video) {
      setMessage("Please log in first.");
      return;
    }

    if (savingFavorite) return;

    setSavingFavorite(true);
    setMessage("");

    try {
      if (saved) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("video_id", video.id);

        if (error) throw error;

        setSaved(false);
        setMessage("Removed from saved videos.");
      } else {
        const { error } = await supabase
          .from("favorites")
          .upsert(
            {
              user_id: user.id,
              video_id: video.id,
            },
            { onConflict: "user_id,video_id" }
          );

        if (error) throw error;

        setSaved(true);
        setMessage("Saved to your profile.");
      }
    } catch (err: any) {
      setMessage(err.message || "Could not save video.");
    } finally {
      setSavingFavorite(false);
    }
  }

  async function handleShare() {
    if (!video) return;

    const shareUrl = `${window.location.origin}/watch/${video.slug}`;

    if (sharing) return;

    setSharing(true);
    setMessage("");

    try {
      if (navigator.share) {
        await navigator.share({
          title: video.title,
          text: `Watch ${video.title} on FaithTube`,
          url: shareUrl,
        });
        setMessage("Shared successfully.");
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setMessage("Link copied to clipboard.");
      }
    } catch (err: any) {
      if (err?.name === "AbortError") {
        setMessage("Share cancelled.");
      } else {
        setMessage("Could not share this video.");
      }
    } finally {
      setSharing(false);
    }
  }

  function shareToFacebook() {
    if (!video) return;

    const shareUrl = `${window.location.origin}/watch/${video.slug}`;
    const url =
      `https://www.facebook.com/dialog/share?app_id=${FACEBOOK_APP_ID}` +
      `&display=popup&href=${encodeURIComponent(shareUrl)}`;

    window.open(url, "_blank", "width=700,height=600");
  }

  async function shareToInstagram() {
    if (!video) return;

    const shareUrl = `${window.location.origin}/watch/${video.slug}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setMessage("Link copied. Paste it into Instagram.");
    } catch {
      setMessage("Could not copy link for Instagram.");
    }
  }

  async function addComment(e: React.FormEvent) {
    e.preventDefault();

    if (!user || !video) {
      setMessage("Please log in first.");
      return;
    }

    if (!commentText.trim() || postingComment) return;

    setPostingComment(true);
    setMessage("");

    try {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("name, avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      const { data, error } = await supabase
        .from("comments")
        .insert({
          user_id: user.id,
          video_id: video.id,
          content: commentText.trim(),
          user_name:
            profileData?.name ||
            user.user_metadata?.name ||
            user.email?.split("@")[0] ||
            "User",
          user_avatar_url: profileData?.avatar_url || null,
        })
        .select("id, content, created_at, user_id, user_name, user_avatar_url")
        .single();

      if (error) throw error;

      if (data) {
        setComments((prev) => [data as CommentRow, ...prev]);
        setCommentText("");
        setMessage("Comment posted.");
      }
    } catch (err: any) {
      setMessage(err.message || "Could not post comment.");
    } finally {
      setPostingComment(false);
    }
  }

  if (!videosLoading && !video) {
    return <Navigate to="/browse" replace />;
  }

  if (!video) {
    return (
      <section className="section">
        <div className="info-card">
          <h1 className="section-title">Loading...</h1>
        </div>
      </section>
    );
  }

  return (
    <section className="watch-layout">
      <div>
        <div className="player-card">
          <div className="player-frame">
            {video.source_type === "embed" ? (
              <iframe
                src={video.video_url}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ width: "100%", height: "100%", border: "none" }}
              />
            ) : (
              <video controls style={{ width: "100%", height: "100%" }}>
                <source src={video.video_url} />
              </video>
            )}
          </div>
        </div>

        <div className="info-card">
          <h1 className="watch-title">{video.title}</h1>

          <div className="watch-meta">
            <span>{video.category || "Video"}</span>
            <span>{video.duration || ""}</span>
            <span>{likesCount} likes</span>
            <span>Original AI Content</span>
          </div>

          <p className="watch-description">{video.description}</p>

          <div style={{ marginTop: 20 }}>
            <AdBanner adSlot="YOUR_AD_SLOT_1" />
          </div>

          <div className="action-bar">
            <button
              className="icon-btn"
              onClick={toggleLike}
              disabled={liking}
            >
              {liking ? "Working..." : liked ? "Unlike" : "Like"}
            </button>

            <button
              className="icon-btn"
              onClick={toggleFavorite}
              disabled={savingFavorite}
            >
              {savingFavorite ? "Working..." : saved ? "Saved" : "Save"}
            </button>

            <button
              className="icon-btn"
              onClick={handleShare}
              disabled={sharing}
            >
              {sharing ? "Working..." : "Share"}
            </button>

            <button className="icon-btn" onClick={shareToFacebook}>
              Facebook
            </button>

            <button className="icon-btn" onClick={shareToInstagram}>
              Instagram
            </button>
          </div>

          {message && <p className="soft mt-2">{message}</p>}
        </div>

        <div className="comments-card">
          <h2 className="section-title">Comments</h2>

          <form className="comment-form" onSubmit={addComment}>
            <textarea
              className="textarea"
              placeholder="Share your thoughts about this video..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button
              className="btn btn-primary"
              type="submit"
              disabled={postingComment}
            >
              {postingComment ? "Posting..." : "Post Comment"}
            </button>
          </form>

          <div style={{ marginTop: 20, marginBottom: 20 }}>
            <AdBanner adSlot="YOUR_AD_SLOT_2" />
          </div>

          <div className="comment-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-head">
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "999px",
                        overflow: "hidden",
                        background: "rgba(255,255,255,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {comment.user_avatar_url ? (
                        <img
                          src={comment.user_avatar_url}
                          alt={comment.user_name || "User"}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <span style={{ fontWeight: 700 }}>
                          {(comment.user_name || "U").charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div>
                      <strong className="comment-author">
                        {comment.user_name || "User"}
                      </strong>
                      <div className="comment-date">
                        {new Date(comment.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="comment-text">{comment.content}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <aside className="sidebar-card">
        <h2 className="sidebar-title">More Like This</h2>

        <div style={{ marginBottom: 20 }}>
          <AdBanner adSlot="YOUR_AD_SLOT_3" />
        </div>

        <div className="related-list">
          {related.map((item) => (
            <Link
              key={item.id}
              to={`/watch/${item.slug}`}
              className="related-item"
            >
              <div className="related-thumb">
                <img src={item.poster_url ?? ""} alt={item.title || ""} />
              </div>

              <div>
                <div className="related-title">{item.title}</div>
                <div className="related-meta">
                  {(item.category || "Video")} • {item.duration || ""}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </aside>
    </section>
  );
}