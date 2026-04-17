import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import VideoCard from "../components/VideoCard";

type Profile = {
  id: string;
  name: string | null;
  bio: string | null;
  avatar_url: string | null;
  show_likes: boolean;
};

type VideoItem = {
  id: number;
  title: string;
  slug: string;
  poster_url: string;
  description: string;
  duration: string;
  category: string;
};

export default function PublicProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [likedVideos, setLikedVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadPublicProfile() {
      if (!id) return;

      setLoading(true);
      setMessage("");

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, name, bio, avatar_url, show_likes")
        .eq("id", id)
        .maybeSingle();

      if (profileError) {
        setMessage(profileError.message);
        setLoading(false);
        return;
      }

      if (!profileData) {
        setMessage("Profile not found.");
        setLoading(false);
        return;
      }

      setProfile(profileData);

      if (profileData.show_likes) {
        const { data: likesData, error: likesError } = await supabase
          .from("likes")
          .select(`
            videos (
              id,
              title,
              slug,
              poster_url,
              description,
              duration,
              category
            )
          `)
          .eq("user_id", id);

        if (likesError) {
          setMessage(likesError.message);
        } else {
          const liked = (likesData || [])
            .map((item: any) => item.videos)
            .filter(Boolean);
          setLikedVideos(liked);
        }
      }

      setLoading(false);
    }

    loadPublicProfile();
  }, [id]);

  async function handleShareProfile() {
    if (!profile) return;

    const profileUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: profile.name || "FaithTube Profile",
          text: "Check out this FaithTube profile",
          url: profileUrl,
        });
        setMessage("Profile shared.");
        return;
      }

      await navigator.clipboard.writeText(profileUrl);
      setMessage("Profile link copied.");
    } catch (err: any) {
      if (err?.name === "AbortError") {
        setMessage("Share cancelled.");
      } else {
        setMessage("Could not share profile.");
      }
    }
  }

  if (loading) {
    return (
      <section className="profile-wrap">
        <div className="profile-card">
          <p className="soft">Loading profile...</p>
        </div>
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="profile-wrap">
        <div className="profile-card">
          <h1 className="section-title">Profile not found</h1>
          {message && <p className="soft mt-2">{message}</p>}
        </div>
      </section>
    );
  }

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
            <h1 className="profile-name">{profile.name || "FaithViewer"}</h1>
            <div className="profile-meta">Public FaithTube Profile</div>
          </div>
        </div>

        <p className="profile-bio">
          {profile.bio || "No bio added yet."}
        </p>

        <div className="form-actions mt-3">
          <button className="btn btn-primary" onClick={handleShareProfile}>
            Share Profile
          </button>
        </div>

        {message && <p className="soft mt-2">{message}</p>}
      </div>

      <div className="section">
        <h2 className="section-title">Liked Videos</h2>

        {!profile.show_likes ? (
          <p className="soft">This user has hidden their liked videos.</p>
        ) : likedVideos.length === 0 ? (
          <p className="soft">No liked videos yet.</p>
        ) : (
          <div className="video-grid">
            {likedVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}