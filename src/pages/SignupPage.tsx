import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorText("");
    setMessage("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      setErrorText(error.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      navigate("/profile");
    } else {
      setMessage("Check your email to confirm your account, then log in.");
    }

    setLoading(false);
  }

  return (
    <section className="auth-wrap">
      <div className="form-card">
        <h1 className="form-title">Create Account</h1>

        <form className="form-fields" onSubmit={handleSubmit}>
          <div className="form-row">
            <label className="label">Name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="form-row">
            <label className="label">Email</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="form-row">
            <label className="label">Password</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {errorText && <p className="soft">{errorText}</p>}
          {message && <p className="soft">{message}</p>}

          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}