import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";
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
  poster_url: string | null;
  description: string | null;
  duration: string | null;
  category?: string | null;
  tags?: string[] | null;
};

export default function ProfilePage() {
  const { user, loading } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [likedVideos, setLikedVideos] = useState<VideoItem[]>([]);
  const [savedVideos, setSavedVideos] = useState<VideoItem[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [message, setMessage] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [showLikes, setShowLikes] = useState(true);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProfilePage() {
      if (!user) return;

      setLoadingProfile(true);
      setMessage("");

      try {
        const [
          { data: profileData, error: profileError },
          { data: likesData, error: likesError },
          { data: favoritesData, error: favoritesError },
        ] = await Promise.all([
          supabase
            .from("profiles")
            .select("id, name, bio, avatar_url, show_likes")
            .eq("id", user.id)
            .maybeSingle(),

          supabase
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
            .eq("user_id", user.id),

          supabase
            .from("favorites")
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
            .eq("user_id", user.id),
        ]);

        if (profileError) throw profileError;
        if (likesError) throw likesError;
        if (favoritesError) throw favoritesError;

        let currentProfile = profileData;

        if (!currentProfile) {
          const defaultName =
            user.user_metadata?.name ||
            user.email?.split("@")[0] ||
            "FaithViewer";

          const { data: insertedProfile, error: insertError } = await supabase
            .from("profiles")
            .upsert(
              {
                id: user.id,
                name: defaultName,
                bio: "",
                avatar_url: null,
                show_likes: true,
              },
              { onConflict: "id" }
            )
            .select("id, name, bio, avatar_url, show_likes")
            .maybeSingle();

          if (insertError) throw insertError;
          currentProfile = insertedProfile;
        }

        setProfile(currentProfile);
        setName(currentProfile?.name || "");
        setBio(currentProfile?.bio || "");
        setShowLikes(currentProfile?.show_likes ?? true);
        setAvatarPreview(currentProfile?.avatar_url || "");

        const liked = ((likesData || []) as any[])
          .map((item) => item.videos)
          .filter(Boolean)
          .map((video) => ({
            ...video,
            category: video.category || "Video",
          }));

        const saved = ((favoritesData || []) as any[])
          .map((item) => item.videos)
          .filter(Boolean)
          .map((video) => ({
            ...video,
            category: video.category || "Video",
          }));

        setLikedVideos(liked);
        setSavedVideos(saved);
      } catch (err: any) {
        setMessage(err.message || "Could not load profile.");
      } finally {
        setLoadingProfile(false);
      }
    }

    if (user) {
      loadProfilePage();
    } else if (!loading) {
      setLoadingProfile(false);
    }
  }, [user, loading]);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please choose an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage("Image must be under 2MB.");
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setMessage("");
  }

  async function uploadAvatar(file: File, userId: string) {
    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    const filePath = `${userId}/avatar-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    return data.publicUrl;
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setMessage("");

    try {
      let avatarUrl = profile?.avatar_url || null;

      if (avatarFile) {
        avatarUrl = await uploadAvatar(avatarFile, user.id);
      }

      const { data, error } = await supabase
        .from("profiles")
        .upsert(
          {
            id: user.id,
            name,
            bio,
            avatar_url: avatarUrl,
            show_likes: showLikes,
          },
          { onConflict: "id" }
        )
        .select("id, name, bio, avatar_url, show_likes")
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error("Could not save profile.");

      setProfile(data);
      setName(data.name || "");
      setBio(data.bio || "");
      setShowLikes(data.show_likes ?? true);
      setAvatarPreview(data.avatar_url || "");
      setAvatarFile(null);
      setEditMode(false);
      setMessage("Profile updated successfully.");
    } catch (err: any) {
      setMessage(err.message || "Could not update profile.");
    } finally {
      setSaving(false);
    }
  }

  async function handleShareProfile() {
    if (!user) return;

    const profileUrl = `${window.location.origin}/#/profile/${user.id}`;

    try {
      await navigator.clipboard.writeText(profileUrl);
      setMessage("Profile link copied.");
    } catch {
      setMessage(`Copy this link: ${profileUrl}`);
    }
  }

  if (!loading && !user) {
    return <Navigate to="/login" replace />;
  }

  if (loading || loadingProfile) {
    return (
      <section className="profile-wrap">
        <div className="profile-card">
          <p className="soft">Loading profile...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="profile-wrap">
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt={profile?.name || "Profile"}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              profile?.name?.charAt(0)?.toUpperCase() || "F"
            )}
          </div>

          <div>
            <h1 className="profile-name">{profile?.name || "FaithViewer"}</h1>
            <div className="profile-meta">{user?.email}</div>
          </div>
        </div>

        {!editMode ? (
          <>
            <p className="profile-bio">
              {profile?.bio || "No bio added yet."}
            </p>

            <p className="soft mt-2">
              Public liked videos: {profile?.show_likes ? "On" : "Off"}
            </p>

            <div className="form-actions mt-3">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setEditMode(true);
                  setMessage("");
                }}
              >
                Edit Profile
              </button>

              <button className="btn btn-primary" onClick={handleShareProfile}>
                Copy Profile Link
              </button>
            </div>
          </>
        ) : (
          <form className="form-fields mt-3" onSubmit={handleSaveProfile}>
            <div className="form-row">
              <label className="label">Display Name</label>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div className="form-row">
              <label className="label">Bio</label>
              <textarea
                className="textarea"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell people about yourself"
              />
            </div>

            <div className="form-row">
              <label className="label">Profile Image</label>
              <input
                className="input"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>

            <div className="form-row">
              <label className="label">
                <input
                  type="checkbox"
                  checked={showLikes}
                  onChange={(e) => setShowLikes(e.target.checked)}
                  style={{ marginRight: 8 }}
                />
                Show liked videos on my public profile
              </label>
            </div>

            <div className="form-actions">
              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setAvatarFile(null);
                  setAvatarPreview(profile?.avatar_url || "");
                  setName(profile?.name || "");
                  setBio(profile?.bio || "");
                  setShowLikes(profile?.show_likes ?? true);
                  setMessage("");
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {message && <p className="soft mt-2">{message}</p>}
      </div>

      <div className="section">
        <h2 className="section-title">Liked Videos</h2>
        {likedVideos.length === 0 ? (
          <p className="soft">No liked videos yet.</p>
        ) : (
          <div className="video-grid">
            {likedVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </div>

      <div className="section">
        <h2 className="section-title">Saved Videos</h2>
        {savedVideos.length === 0 ? (
          <p className="soft">No saved videos yet.</p>
        ) : (
          <div className="video-grid">
            {savedVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}