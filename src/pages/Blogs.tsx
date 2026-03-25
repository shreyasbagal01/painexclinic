import { useState, useMemo } from "react";
import { Search, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import BlogCard from "@/components/BlogCard";
import CTABanner from "@/components/CTABanner";
import { blogPosts, categories } from "@/data/blogData";
import { blogPostImages } from "@/data/blogPostImages";
import { categoryImages } from "@/data/categoryImages";

const Blogs = () => {
  const [active, setActive] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let posts = active === "all" ? blogPosts : blogPosts.filter((p) => p.category === active);
    if (search.trim()) {
      const q = search.toLowerCase();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.keywords.some((kw) => kw.toLowerCase().includes(q)) ||
          p.category.replace("-", " ").toLowerCase().includes(q)
      );
    }
    return posts;
  }, [active, search]);

  const featured = filtered[0];
  const rest = filtered.slice(1);
  const featuredImage = featured ? (blogPostImages[featured.slug] || categoryImages[featured.category]) : null;

  return (
    <Layout>
      <Helmet>
        <title>Pain Management Blog – Articles by Specialists in Pune</title>
        <meta name="description" content="Browse expert articles on migraine, back pain, sciatica, knee pain, and more. Evidence-based pain management guides from specialists in Pune." />
        <link rel="canonical" href="https://www.painspecialist.blog/blogs" />
        <meta property="og:title" content="Pain Management Blog | Pain Specialist Blog" />
        <meta property="og:description" content="Browse expert articles on migraine, back pain, sciatica, knee pain, and more." />
        <meta property="og:url" content="https://www.painspecialist.blog/blogs" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Pain Management Blog | Pain Specialist Blog" />
        <meta name="twitter:description" content="Browse expert articles on migraine, back pain, sciatica, knee pain, and more." />
      </Helmet>
      <section className="border-b border-border bg-card py-8 md:py-10">
        <div className="container px-4 md:px-8">
          <h1 className="text-2xl font-bold text-foreground md:text-4xl">Pain Management Blog</h1>
          <p className="mt-2 max-w-xl text-sm md:text-base text-muted-foreground">
            Expert articles on pain relief, treatment options, and wellness — written by pain specialists for patients in Pune.
          </p>

          {/* Search */}
          <div className="relative mt-5 md:mt-6 max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Filters — horizontal scroll on mobile */}
          <div className="mt-3 md:mt-4 -mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto scrollbar-none">
            <div className="flex gap-2 pb-1 md:flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setActive(cat.slug)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all active:scale-95 ${
                    active === cat.slug
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "border border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured + Grid */}
      <section className="py-8 md:py-10">
        <div className="container px-4 md:px-8">
          {/* Featured Article */}
          {featured && (
            <div className="mb-8 md:mb-10">
              <div className="grid gap-5 lg:grid-cols-2 lg:gap-10 items-center rounded-2xl border border-border bg-card p-4 md:p-0 lg:overflow-hidden">
                {featuredImage && (
                  <Link to={`/blog/${featured.slug}`} className="group overflow-hidden rounded-xl lg:rounded-none lg:rounded-l-2xl">
                    <img
                      src={featuredImage}
                      alt={featured.title}
                      className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      width={800}
                      height={500}
                    />
                  </Link>
                )}
                <div className="lg:pr-8 lg:py-8">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                    {featured.category.replace("-", " ")}
                  </span>
                  <Link to={`/blog/${featured.slug}`}>
                    <h2 className="mt-2.5 text-lg font-bold text-foreground md:text-2xl hover:text-primary transition-colors leading-tight">
                      {featured.title}
                    </h2>
                  </Link>
                  <p className="mt-2 text-sm md:text-base text-muted-foreground leading-relaxed line-clamp-3">{featured.excerpt}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs md:text-sm text-muted-foreground">
                    <span>{new Date(featured.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
                    <span>·</span>
                    <span>{featured.readTime}</span>
                  </div>
                  <Link
                    to={`/blog/${featured.slug}`}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                  >
                    Read Article <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Grid */}
          {rest.length > 0 && (
            <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          )}

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-lg text-muted-foreground">
                No articles found{search ? ` for "${search}"` : " in this category"}.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">Try a different search term or category.</p>
            </div>
          )}
        </div>
      </section>

      <CTABanner />
    </Layout>
  );
};

export default Blogs;