import { Link } from "react-router-dom";
import { blogPosts } from "../data/Blogposts";

export default function BlogPage() {
  return (
    <section className="section">
      <div className="blog-list-hero">
        <span className="blog-badge">FaithTube Blog</span>
        <h1 className="blog-title">Christian Movies, Bible Stories & Faith Articles</h1>
        <p className="blog-subtitle">
          Read inspiring articles about Christian films, Bible stories, testimonies,
          family-friendly faith content, and spiritual growth.
        </p>
      </div>

      <div className="blog-card-grid">
        {blogPosts.map((post) => (
          <Link to={`/blog/${post.slug}`} className="blog-preview-card" key={post.slug}>
            <img src={post.image} alt={post.title} className="blog-preview-img" />

            <div className="blog-preview-body">
              <div className="blog-meta">
                <span>{post.date}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>

              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>

              <span className="blog-read-more">Read article →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}