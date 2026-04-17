import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Replace this later with Supabase save or email API
    setSubmitted(true);
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  }

  return (
    <section className="section">
      <div className="profile-card">
        <h1 className="section-title">Contact Us</h1>
        <p className="soft">
          Have a question, support request, copyright concern, or partnership
          inquiry? Send us a message.
        </p>

        <div className="mt-4">
          <p className="soft">Email: support@faithtube.com</p>
        </div>

        {submitted ? (
          <div className="mt-4">
            <p className="soft">
              Thanks for reaching out. Your message has been received.
            </p>
          </div>
        ) : (
          <form className="form-fields mt-4" onSubmit={handleSubmit}>
            <div className="form-row">
              <label className="label">Name</label>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>

            <div className="form-row">
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="form-row">
              <label className="label">Subject</label>
              <input
                className="input"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="How can we help?"
                required
              />
            </div>

            <div className="form-row">
              <label className="label">Message</label>
              <textarea
                className="textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here"
                required
              />
            </div>

            <div className="form-actions">
              <button className="btn btn-primary" type="submit">
                Send Message
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}