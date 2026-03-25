import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, Share2, ChevronRight, Lightbulb } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import CTABanner from "@/components/CTABanner";
import BlogCard from "@/components/BlogCard";
import AuthorCard from "@/components/AuthorCard";
import MedicalDisclaimer from "@/components/MedicalDisclaimer";
import { blogPosts, sampleBlogContent } from "@/data/blogData";
import { blogContents } from "@/data/blogContents";
import { categoryImages } from "@/data/categoryImages";
import { blogPostImages } from "@/data/blogPostImages";
import { getPostAuthor, getPersonJsonLd } from "@/data/authorData";

const renderMarkdown = (md: string) => {
  const lines = md.split("\n");
  const blocks: string[] = [];
  let current = "";

  for (const line of lines) {
    const trimLine = line.trim();
    if (trimLine === "") {
      if (current.trim()) {
        blocks.push(current.trim());
        current = "";
      }
    } else {
      if (current.trim() && trimLine.startsWith("- ") && !current.trim().startsWith("- ")) {
        blocks.push(current.trim());
        current = trimLine;
      } else if (current.trim() && current.trim().startsWith("- ") && !trimLine.startsWith("- ")) {
        blocks.push(current.trim());
        current = trimLine;
      } else {
        current += (current ? "\n" : "") + trimLine;
      }
    }
  }
  if (current.trim()) blocks.push(current.trim());

  return blocks.map((block, i) => {
    if (!block) return null;

    if (block.startsWith("### ")) {
      return <h3 key={i} className="mb-3 mt-10 text-xl font-bold text-foreground">{block.replace("### ", "")}</h3>;
    }
    if (block.startsWith("## ")) {
      const text = block.replace("## ", "");
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return <h2 key={i} id={id} className="mb-4 mt-12 text-2xl font-bold text-foreground">{text}</h2>;
    }
    if (block.startsWith("- ")) {
      const items = block.split("\n").filter((l) => l.trim().startsWith("- "));
      return (
        <ul key={i} className="mb-5 ml-5 list-disc space-y-2 text-foreground/85 leading-relaxed">
          {items.map((item, j) => (
            <li key={j} dangerouslySetInnerHTML={{ __html: formatInline(item.replace(/^- /, "")) }} />
          ))}
        </ul>
      );
    }
    return (
      <p key={i} className="mb-5 text-foreground/80 leading-[1.8]" dangerouslySetInnerHTML={{ __html: formatInline(block) }} />
    );
  });
};

const formatInline = (text: string) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
    .replace(
      /\[([^\]]+)\]\((\/[^)]+)\)/g,
      '<a href="$2" class="text-primary underline decoration-primary/30 hover:decoration-primary font-medium transition-colors">$1</a>'
    )
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline decoration-primary/30 hover:decoration-primary font-medium transition-colors">$1</a>'
    );
};

const extractHeadings = (md: string) => {
  const headings: { level: number; text: string; id: string }[] = [];
  md.split("\n").forEach((line) => {
    const h2 = line.match(/^## (.+)/);
    const h3 = line.match(/^### (.+)/);
    if (h2) {
      const text = h2[1].trim();
      headings.push({ level: 2, text, id: text.toLowerCase().replace(/[^a-z0-9]+/g, "-") });
    }
    if (h3) {
      const text = h3[1].trim();
      headings.push({ level: 3, text, id: text.toLowerCase().replace(/[^a-z0-9]+/g, "-") });
    }
  });
  return headings;
};

/** Extract FAQ Q&A pairs from markdown — looks for ### headings with ? */
const extractFAQs = (md: string): { question: string; answer: string }[] => {
  const faqs: { question: string; answer: string }[] = [];
  const lines = md.split("\n");
  let currentQ = "";
  let currentA = "";
  let inFaq = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("### ") && trimmed.includes("?")) {
      if (currentQ && currentA.trim()) {
        faqs.push({ question: currentQ, answer: currentA.trim() });
      }
      currentQ = trimmed.replace("### ", "");
      currentA = "";
      inFaq = true;
    } else if (inFaq && trimmed.startsWith("### ")) {
      // New H3 that isn't a question — stop FAQ collection
      if (currentQ && currentA.trim()) {
        faqs.push({ question: currentQ, answer: currentA.trim() });
      }
      currentQ = "";
      currentA = "";
      inFaq = false;
    } else if (inFaq && trimmed.startsWith("## ")) {
      if (currentQ && currentA.trim()) {
        faqs.push({ question: currentQ, answer: currentA.trim() });
      }
      currentQ = "";
      currentA = "";
      inFaq = false;
    } else if (inFaq && currentQ) {
      currentA += (currentA ? " " : "") + trimmed;
    }
  }
  if (currentQ && currentA.trim()) {
    faqs.push({ question: currentQ, answer: currentA.trim() });
  }
  return faqs;
};

/** Generate key takeaways from H2 headings and post excerpt */
const generateKeyTakeaways = (
  headings: { level: number; text: string }[],
  excerpt: string,
  category: string
): string[] => {
  const takeaways: string[] = [];
  // First takeaway from excerpt
  takeaways.push(excerpt);
  // Add from H2 headings (rephrase as takeaway statements)
  const h2s = headings.filter((h) => h.level === 2).slice(0, 4);
  h2s.forEach((h) => {
    const text = h.text;
    // Convert question headings to statement-like takeaways
    if (text.includes("?")) {
      takeaways.push(`This article answers: "${text}"`);
    } else {
      takeaways.push(`Learn about: ${text}`);
    }
  });
  return takeaways.slice(0, 5);
};

const BlogPost = () => {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);

  const relatedPosts = blogPosts
    .filter((p) => p.slug !== slug)
    .sort((a, b) => {
      if (a.category === post?.category && b.category !== post?.category) return -1;
      if (b.category === post?.category && a.category !== post?.category) return 1;
      return 0;
    })
    .slice(0, 3);

  if (!post) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">Article Not Found</h1>
          <Link to="/blogs" className="mt-4 inline-block text-primary hover:underline">← Back to Blog</Link>
        </div>
      </Layout>
    );
  }

  const author = getPostAuthor(post.slug, post.category);
  const content = blogContents[post.slug] || (post.slug === sampleBlogContent.slug ? sampleBlogContent.content : null);
  const headings = content ? extractHeadings(content) : [];
  const heroImage = blogPostImages[post.slug] || categoryImages[post.category];
  const faqs = content ? extractFAQs(content) : [];
  const keyTakeaways = generateKeyTakeaways(headings, post.excerpt, post.category);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: post.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const blogPostJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.date,
    dateModified: post.date,
    image: heroImage || "",
    keywords: post.keywords.join(", "),
    author: getPersonJsonLd(author),
    publisher: {
      "@type": "Organization",
      name: "Painex Pain Management Clinic",
      url: "https://www.painspecialist.blog",
    },
  };

  const medicalWebPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: post.title,
    description: post.metaDescription,
    url: `https://www.painspecialist.blog/blog/${post.slug}`,
    specialty: "Pain Management",
    lastReviewed: post.date,
    author: getPersonJsonLd(author),
  };

  const faqPageJsonLd = faqs.length >= 1
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer.replace(/\*\*/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"),
          },
        })),
      }
    : null;

  const categoryName = post.category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.painspecialist.blog/" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.painspecialist.blog/blogs" },
      { "@type": "ListItem", position: 3, name: categoryName, item: `https://www.painspecialist.blog/category/${post.category}` },
      { "@type": "ListItem", position: 4, name: post.title },
    ],
  };

  const speakableJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: post.title,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".prose-custom > p:first-of-type", ".prose-custom > h2"],
    },
    url: `https://www.painspecialist.blog/blog/${post.slug}`,
  };

  return (
    <Layout>
      <Helmet>
        <title>{post.title} – Pain Specialist Blog</title>
        <meta name="description" content={post.metaDescription} />
        <link rel="canonical" href={`https://www.painspecialist.blog/blog/${post.slug}`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.metaDescription} />
        <meta property="og:url" content={`https://www.painspecialist.blog/blog/${post.slug}`} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:section" content={categoryName} />
        <meta property="article:author" content={author.name} />
        {heroImage && <meta property="og:image" content={heroImage} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.metaDescription} />
        <meta name="keywords" content={post.keywords.join(", ")} />
        <meta name="author" content={author.name} />
        <script type="application/ld+json">{JSON.stringify(blogPostJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(medicalWebPageJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(speakableJsonLd)}</script>
        {faqPageJsonLd && (
          <script type="application/ld+json">{JSON.stringify(faqPageJsonLd)}</script>
        )}
      </Helmet>

      {/* Breadcrumb */}
      <div className="border-b border-border bg-card">
        <div className="container px-4 md:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-xs md:text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors shrink-0">Home</Link>
            <ChevronRight size={10} className="shrink-0 text-muted-foreground/40" />
            <Link to="/blogs" className="hover:text-primary transition-colors shrink-0">Blog</Link>
            <ChevronRight size={10} className="shrink-0 text-muted-foreground/40" />
            <Link to={`/category/${post.category}`} className="hover:text-primary transition-colors capitalize truncate">
              {post.category.replace(/-/g, " ")}
            </Link>
          </nav>
        </div>
      </div>

      <article className="py-6 md:py-10">
        <div className="container px-4 md:px-8">
          <div className="mx-auto max-w-3xl">
            {/* Category + Meta */}
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              {post.category.replace("-", " ")}
            </span>

            <h1 className="mt-3 text-2xl font-bold leading-tight text-foreground md:text-4xl">
              {post.title}
            </h1>

            {/* Author Byline */}
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-border bg-secondary/30 px-4 py-3">
              <Link
                to={`/authors/${author.slug}`}
                className="h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-primary/20 hover:ring-primary transition-all"
              >
                <img src={author.photo} alt={author.name} className="h-full w-full object-cover object-top" width={36} height={36} />
              </Link>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <Link to={`/authors/${author.slug}`} className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
                    Written by {author.name}
                  </Link>
                  <span className="text-xs text-muted-foreground">{author.credentialsDisplay}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Reviewed: {new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs md:text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} /> {post.readTime}
              </span>
              <button
                onClick={handleShare}
                className="ml-auto flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium hover:bg-accent transition-colors"
              >
                <Share2 size={12} /> Share
              </button>
            </div>
          </div>

          {/* Hero Image */}
          {heroImage && (
            <div className="mx-auto mt-5 md:mt-8 max-w-4xl">
              <img
                src={heroImage}
                alt={post.title}
                className="w-full rounded-xl md:rounded-2xl object-cover"
                width={800}
                height={450}
              />
            </div>
          )}

          {/* Content Area */}
          <div className="mx-auto mt-6 md:mt-10 max-w-3xl">
            {content ? (
              <>
                {/* Key Takeaways Box */}
                {keyTakeaways.length > 0 && (
                  <div className="mb-8 rounded-xl border-2 border-primary/20 bg-primary/5 p-5 md:p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb size={18} className="text-primary" />
                      <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">Key Takeaways</h4>
                    </div>
                    <ul className="space-y-2">
                      {keyTakeaways.map((t, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground/80 leading-relaxed">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Table of Contents */}
                {headings.length > 3 && (
                  <div className="mb-10 rounded-xl border border-border bg-secondary/30 p-6">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-3">In This Article</h4>
                    <ul className="space-y-1.5">
                      {headings.filter((h) => h.level === 2).map((h, i) => (
                        <li key={i}>
                          <a href={`#${h.id}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            {h.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="prose-custom">{renderMarkdown(content)}</div>
              </>
            ) : (
              <div className="rounded-xl border border-border bg-accent/30 p-10 text-center">
                <p className="text-lg font-medium text-foreground">Full article coming soon</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  We're working on this article. In the meantime, book a consultation.
                </p>
                <a
                  href="https://www.painex.org/book-an-appointment/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
                >
                  Book Appointment
                </a>
              </div>
            )}

            {/* Medical Disclaimer */}
            <div className="mt-10">
              <MedicalDisclaimer />
            </div>

            {/* Author Card */}
            <div className="mt-6">
              <AuthorCard author={author} reviewDate={post.date} />
            </div>

            {/* Keywords */}
            <div className="mt-8 border-t border-border pt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Related Topics</p>
              <div className="flex flex-wrap gap-1.5">
                {post.keywords.map((kw) => (
                  <span key={kw} className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </article>

      <CTABanner />

      {/* Related Articles */}
      <section className="py-10 md:py-14 bg-secondary/20">
        <div className="container px-4 md:px-8">
          <h2 className="text-2xl font-bold text-foreground">You Might Also Like</h2>
          <div className="mt-5 md:mt-6 grid gap-4 md:gap-6 sm:grid-cols-2 md:grid-cols-3">
            {relatedPosts.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BlogPost;
