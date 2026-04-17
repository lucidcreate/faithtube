import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";

type Profile = {
  role: string;
};

export default function AdminPage() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [category, setCategory] = useState("Short Film");
  const [duration, setDuration] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      setProfile(data);
    }

    loadProfile();
  }, [user]);

  async function handleCreateVideo(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setMessage("");

    const { error } = await supabase.from("videos").insert({
      title,
      slug,
      description,
      poster_url: posterUrl,
      video_url: videoUrl,
      source_type: "embed",
      category,
      duration,
      published: true,
      ai_generated: true,
      ownership_type: "original_ai",
      created_by: user.id,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Video added successfully.");
      setTitle("");
      setSlug("");
      setDescription("");
      setPosterUrl("");
      setVideoUrl("");
      setCategory("Short Film");
      setDuration("");
    }

    setSaving(false);
  }

  if (!loading && !user) {
    return <Navigate to="/login" replace />;
  }

  if (!loading && profile && profile.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <section className="admin-wrap">
      <div className="admin-card">
        <h1 className="section-title">Add New Video</h1>

        <form className="admin-form" onSubmit={handleCreateVideo}>
          <div className="admin-columns">
            <div className="form-row">
              <label className="label">Title</label>
              <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="form-row">
              <label className="label">Slug</label>
              <input className="input" value={slug} onChange={(e) => setSlug(e.target.value)} />
            </div>
          </div>

          <div className="form-row">
            <label className="label">Description</label>
            <textarea className="textarea" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="admin-columns">
            <div className="form-row">
              <label className="label">Poster URL</label>
              <input className="input" value={posterUrl} onChange={(e) => setPosterUrl(e.target.value)} />
            </div>

            <div className="form-row">
              <label className="label">Video URL</label>
              <input className="input" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
            </div>
          </div>

          <div className="admin-columns">
            <div className="form-row">
              <label className="label">Category</label>
              <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option>Bible Story</option>
                <option>Short Film</option>
                <option>Testimony</option>
                <option>Kids</option>
                <option>Worship</option>
              </select>
            </div>

            <div className="form-row">
              <label className="label">Duration</label>
              <input className="input" value={duration} onChange={(e) => setDuration(e.target.value)} />
            </div>
          </div>

          {message && <p className="soft">{message}</p>}

          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Add Video"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}