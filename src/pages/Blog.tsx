import { Link } from "react-router-dom";

export default function BlogPage() {
  return (
    <section className="section">
      <div className="blog-page">
        <div className="blog-hero">
          
          <div className="blog-hero-overlay">
            <span className="blog-badge">FaithTube Blog</span>
            <h1 className="blog-title">
              Top Christian Movies to Strengthen Your Faith
            </h1>
            <p className="blog-subtitle">
              Discover powerful Christian films, Bible stories, and faith-filled
              content that inspire hope, prayer, and spiritual growth.
            </p>
          </div>
        </div>

        <article className="blog-card">
          <div className="blog-meta">
            <span>FaithTube Editorial</span>
            <span>•</span>
            <span>April 2026</span>
            <span>•</span>
            <span>5 min read</span>
          </div>

          <img
            src="/hero-bg.png"
            alt="Christian movies article"
            className="blog-featured-image"
          />

          <p className="blog-paragraph">
            Christian movies have the power to inspire, uplift, and draw people
            closer to God. Through compelling storytelling, these films bring
            biblical truths to life and help viewers reflect on faith, grace,
            forgiveness, and perseverance.
          </p>

          <p className="blog-paragraph">
            At FaithTube, our goal is to create a home for meaningful Christian
            entertainment. Whether you enjoy Bible stories, short films,
            testimonies, or family-focused faith content, there is something
            here to encourage your walk with God.
          </p>

          <h2 className="blog-heading">Why Christian Movies Matter</h2>

          <p className="blog-paragraph">
            Faith-based films remind us that God is present in every season of
            life. They can help us reflect on scripture, strengthen our trust in
            God, and start important spiritual conversations with family and
            friends. Great Christian storytelling is not only entertaining, but
            also deeply encouraging.
          </p>

          <blockquote className="blog-quote">
            “Faith-filled stories can move the heart, renew the mind, and remind
            us of God’s promises.”
          </blockquote>

          <h2 className="blog-heading">What You Can Watch on FaithTube</h2>

          <div className="blog-grid">
            <div className="blog-grid-card">
              <h3>Bible Stories</h3>
              <p>
                Watch cinematic retellings of scripture and timeless stories of
                faith, courage, and redemption.
              </p>
            </div>

            <div className="blog-grid-card">
              <h3>Christian Short Films</h3>
              <p>
                Discover modern, emotionally powerful short films that speak to
                daily life, prayer, forgiveness, and purpose.
              </p>
            </div>

            <div className="blog-grid-card">
              <h3>Testimonies</h3>
              <p>
                Hear real stories of transformation, healing, hope, and the
                faithfulness of God.
              </p>
            </div>
          </div>

          <h2 className="blog-heading">A Platform Built for Inspiration</h2>

          <p className="blog-paragraph">
            FaithTube is more than a streaming platform. It is a growing library
            of Christian content designed to encourage believers and make
            faith-based stories easier to discover online. We believe visual
            storytelling can be a powerful way to share God’s truth with a new
            generation.
          </p>

          <p className="blog-paragraph">
            As we continue building FaithTube, we are expanding our collection
            of Christian films, original features, Bible content, and inspiring
            articles that help viewers stay connected to faith-filled media.
          </p>

          <div className="blog-cta">
            <h3>Start Watching on FaithTube</h3>
            <p>
              Explore Christian movies, uplifting videos, and inspiring stories
              made to strengthen your faith.
            </p>

            <div className="hero-actions">
              <Link to="/browse" className="btn btn-primary">
                Browse Library
              </Link>
              <Link to="/signup" className="btn btn-secondary">
                Join Free
              </Link>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}