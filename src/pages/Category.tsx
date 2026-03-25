import { useParams, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import BlogCard from "@/components/BlogCard";
import CTABanner from "@/components/CTABanner";
import { blogPosts, categories } from "@/data/blogData";
import { categoryImages } from "@/data/categoryImages";

const categoryDescriptions: Record<string, string> = {
  migraine: "Expert articles on migraine and headache treatment, triggers, prevention, and when to see a headache specialist in Pune.",
  "back-pain": "Learn about back pain causes, slip disc treatment, and modern pain management options available in Pune.",
  sciatica: "Comprehensive guides on sciatica pain – symptoms, causes, exercises, and non-surgical treatments available in Pune.",
  "neck-pain": "Explore neck pain causes including tech neck, cervical spondylosis, and treatment options from pain specialists in Pune.",
  "knee-pain": "Expert articles on knee pain, osteoarthritis, and non-surgical treatment options available from pain specialists in Pune.",
  "shoulder-pain": "Learn about frozen shoulder, shoulder pain causes, and effective treatment options from a pain specialist in Pune.",
  "nerve-pain": "Understand nerve pain conditions including neuropathy, burning sensations, and find effective treatments in Pune.",
  "facial-pain": "Expert information on trigeminal neuralgia and facial pain conditions with treatment options available in Pune.",
  "heel-pain": "Guides on plantar fasciitis, morning heel pain, and effective treatments from a pain specialist in Pune.",
  "general-pain": "Comprehensive guides on pain management, chronic pain, and when to see a pain specialist in Pune.",
};

const Category = () => {
  const { slug } = useParams();
  const cat = categories.find((c) => c.slug === slug);
  const posts = blogPosts.filter((p) => p.category === slug);
  const heroImage = categoryImages[slug || ""];

  if (!cat) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">Category Not Found</h1>
          <Link to="/blogs" className="mt-4 inline-block text-primary hover:underline">← Browse all blogs</Link>
        </div>
      </Layout>
    );
  }

  const desc = categoryDescriptions[slug || ""] || `Expert articles on ${cat.name} treatment and management in Pune.`;

  return (
    <Layout>
      <Helmet>
        <title>{cat.name} – Pain Specialist Blog Pune</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={`https://www.painspecialist.blog/category/${slug}`} />
        <meta property="og:title" content={`${cat.name} Treatment in Pune | Pain Specialist Blog`} />
        <meta property="og:description" content={desc} />
        <meta property="og:url" content={`https://www.painspecialist.blog/category/${slug}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${cat.name} Treatment in Pune | Pain Specialist Blog`} />
        <meta name="twitter:description" content={desc} />
      </Helmet>
      <div className="border-b border-border bg-card">
        <div className="container py-3">
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link to="/blogs" className="hover:text-primary transition-colors">Blog</Link>
            <ChevronRight size={12} />
            <span className="text-foreground font-medium">{cat.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-card">
        <div className="container py-10 lg:py-14">
          <div className="flex items-center gap-6">
            {heroImage && (
              <img
                src={heroImage}
                alt={cat.name}
                className="hidden md:block h-20 w-20 rounded-2xl object-cover ring-2 ring-border"
                width={80}
                height={80}
                loading="lazy"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-foreground md:text-4xl">{cat.name}</h1>
              <p className="mt-2 max-w-xl text-muted-foreground">{categoryDescriptions[slug!]}</p>
              <p className="mt-2 text-sm text-muted-foreground">{posts.length} article{posts.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12">
        <div className="container">
          {posts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <p className="py-10 text-center text-muted-foreground">No articles in this category yet. Check back soon!</p>
          )}
        </div>
      </section>

      <CTABanner />
    </Layout>
  );
};

export default Category;
