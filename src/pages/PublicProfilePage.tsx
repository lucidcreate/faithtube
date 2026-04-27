import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import VideoCard from "../components/VideoCard";

type Profile = {
  id: string;
  name: string | null;
  bio: string | null;
  avatar_url: string | null;
  show_likes: boolean | null;
};

export default function PublicProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [likedVideos, setLikedVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPublicProfile() {
      if (!id) return;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, name, bio, avatar_url, show_likes")
        .eq("id", id)
        .maybeSingle();

      setProfile(profileData);

      if (profileData?.show_likes) {
        const { data } = await supabase
          .from("likes")
          .select(`
            videos (
              id,
              title,
              slug,
              poster_url,
              description,
              duration,
              category,
              tags
            )
          `)
          .eq("user_id", id);

        setLikedVideos((data || []).map((item: any) => item.videos).filter(Boolean));
      }

      setLoading(false);
    }

    loadPublicProfile();
  }, [id]);

  if (loading) {
    return (
      <section className="section">
        <p className="soft">Loading profile...</p>
      </section>
    );
  }

  if (!profile) return <Navigate to="/" replace />;

  return (
    <section className="profile-wrap">
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.name || "Profile"}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              profile.name?.charAt(0)?.toUpperCase() || "F"
            )}
          </div>

          <div>
            <h1 className="profile-name">{profile.name || "FaithTube User"}</h1>
            <div className="profile-meta">FaithTube Profile</div>
          </div>
        </div>

        <p className="profile-bio">{profile.bio || "No bio added yet."}</p>
      </div>

      {profile.show_likes && (
        <div className="section">
          <h2 className="section-title">Liked Videos</h2>

          {likedVideos.length === 0 ? (
            <p className="soft">No public liked videos yet.</p>
          ) : (
            <div className="video-grid">
              {likedVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}