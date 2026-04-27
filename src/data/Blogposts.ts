export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
  content: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "best-christian-movies",
    title: "Best Christian Movies to Watch Online",
    excerpt:
      "Discover inspiring Christian movies, Bible stories, and faith-based films to strengthen your walk with God.",
    image: "/hero-bg.png",
    date: "April 2026",
    readTime: "4 min read",
    content: [
      "Christian movies are a powerful way to experience stories of faith, hope, forgiveness, and redemption. They help bring biblical truth to life through emotional storytelling and memorable characters.",
      "On FaithTube, viewers can discover Christian films, Bible stories, testimonies, and short films that encourage spiritual growth and family-friendly entertainment.",
      "Whether you are watching alone, with your family, or with a church group, faith-based movies can inspire meaningful conversations about God, purpose, and trust.",
    ],
  },
  {
    slug: "christian-short-films",
    title: "Top Christian Short Films That Inspire Faith",
    excerpt:
      "Short Christian films can deliver powerful messages about prayer, forgiveness, and trusting God.",
    image: "/hero-bg.png",
    date: "April 2026",
    readTime: "3 min read",
    content: [
      "Christian short films are effective because they communicate deep spiritual truths in a short amount of time.",
      "Many short films focus on real-life struggles such as doubt, fear, temptation, forgiveness, and restoration.",
      "FaithTube highlights short films that encourage viewers to reflect on their relationship with God and live with greater purpose.",
    ],
  },
  {
    slug: "bible-stories-online",
    title: "Watch Bible Stories Online for Free",
    excerpt:
      "Bible stories help families, children, and believers understand Scripture in a memorable way.",
    image: "/hero-bg.png",
    date: "April 2026",
    readTime: "4 min read",
    content: [
      "Bible stories have shaped generations by teaching faith, obedience, courage, and God’s love.",
      "Stories like David and Goliath, Noah’s Ark, Moses, Jonah, and the life of Jesus continue to inspire people around the world.",
      "Watching Bible stories online can help children and adults better understand Scripture through visual storytelling.",
    ],
  },
  {
    slug: "faith-based-films",
    title: "How Faith-Based Films Strengthen Your Faith",
    excerpt:
      "Faith-based films remind viewers of God’s promises and encourage hope during difficult seasons.",
    image: "/hero-bg.png",
    date: "April 2026",
    readTime: "5 min read",
    content: [
      "Faith-based films can encourage viewers when life feels uncertain. They often show characters facing challenges while learning to trust God.",
      "These stories remind us that faith is not only something we talk about, but something we live out every day.",
      "By watching Christian content regularly, viewers can stay encouraged and focused on spiritual growth.",
    ],
  },
  {
    slug: "christian-movies-for-families",
    title: "Christian Movies for Families and Kids",
    excerpt:
      "Family-friendly Christian movies are great for home movie nights, Sunday school, and church groups.",
    image: "/hero-bg.png",
    date: "April 2026",
    readTime: "3 min read",
    content: [
      "Christian movies for families and kids teach biblical values in a way that is simple, engaging, and memorable.",
      "Animated Bible stories and family films can help children learn about obedience, kindness, courage, and faith.",
      "FaithTube aims to make uplifting Christian content easier for families to discover online.",
    ],
  },
];