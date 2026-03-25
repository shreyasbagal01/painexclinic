import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ChevronRight, Phone, MessageCircle, MapPin } from "lucide-react";
import Layout from "@/components/Layout";
import CTABanner from "@/components/CTABanner";
import BlogCard from "@/components/BlogCard";
import { getLocationBySlug } from "@/data/locationData";
import { blogPosts } from "@/data/blogData";

const formatInline = (text: string) =>
  text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline hover:decoration-primary font-medium">$1</a>'
    )
    .replace(
      /\[([^\]]+)\]\((tel:[^)]+)\)/g,
      '<a href="$2" class="text-primary underline font-medium">$1</a>'
    );

const renderMarkdown = (md: string) => {
  const lines = md.split("\n");
  const blocks: string[] = [];
  let current = "";

  for (const line of lines) {
    const t = line.trim();
    if (!t) {
      if (current.trim()) { blocks.push(current.trim()); current = ""; }
    } else {
      if (current.trim() && t.startsWith("- ") && !current.trim().startsWith("- ")) {
        blocks.push(current.trim()); current = t;
      } else if (current.trim() && current.trim().startsWith("- ") && !t.startsWith("- ")) {
        blocks.push(current.trim()); current = t;
      } else {
        current += (current ? "\n" : "") + t;
      }
    }
  }
  if (current.trim()) blocks.push(current.trim());

  return blocks.map((block, i) => {
    if (!block) return null;
    if (block.startsWith("## ")) {
      const text = block.replace("## ", "");
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return <h2 key={i} id={id} className="mb-4 mt-10 text-2xl font-bold text-foreground">{text}</h2>;
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
    return <p key={i} className="mb-5 text-foreground/80 leading-[1.8]" dangerouslySetInnerHTML={{ __html: formatInline(block) }} />;
  });
};

const LocationPage = () => {
  const { slug } = useParams();
  const location = slug ? getLocationBySlug(slug) : undefined;

  if (!location) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">Location Not Found</h1>
          <Link to="/" className="mt-4 inline-block text-primary hover:underline">← Back to Home</Link>
        </div>
      </Layout>
    );
  }

  const relatedPosts = blogPosts.slice(0, 3);

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: "Painex Pain Management Clinic",
    url: "https://www.painspecialist.blog",
    telephone: "+91-8390442266",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Apte Road, Deccan Gymkhana",
      addressLocality: "Pune",
      addressRegion: "Maharashtra",
      postalCode: "411004",
      addressCountry: "IN",
    },
    areaServed: {
      "@type": "City",
      name: location.area,
    },
    medicalSpecialty: "Pain Management",
    sameAs: ["https://www.painex.org"],
  };

  return (
    <Layout>
      <Helmet>
        <title>{location.title}</title>
        <meta name="description" content={location.metaDescription} />
        <link rel="canonical" href={`https://www.painspecialist.blog/pune/${location.slug}`} />
        <meta property="og:title" content={location.title} />
        <meta property="og:description" content={location.metaDescription} />
        <meta property="og:url" content={`https://www.painspecialist.blog/pune/${location.slug}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={location.title} />
        <meta name="twitter:description" content={location.metaDescription} />
        <script type="application/ld+json">{JSON.stringify(localBusinessJsonLd)}</script>
      </Helmet>

      {/* Breadcrumb */}
      <div className="border-b border-border bg-card">
        <div className="container px-4 md:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-xs md:text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors shrink-0">Home</Link>
            <ChevronRight size={10} className="shrink-0 text-muted-foreground/40" />
            <span className="text-foreground truncate">Pain Specialist in {location.area}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-accent/30 to-background py-8 md:py-12">
        <div className="container px-4 md:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-4">
            <MapPin size={12} /> {location.area}, Pune
          </div>
          <h1 className="text-2xl font-bold text-foreground md:text-4xl leading-tight">
            {location.title}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm md:text-base text-muted-foreground">
            {location.metaDescription}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://wa.me/918390442266"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <MessageCircle size={14} /> WhatsApp Us
            </a>
            <a
              href="tel:+918390442266"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
            >
              <Phone size={14} /> +91-8390442266
            </a>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="py-8 md:py-12">
        <div className="container px-4 md:px-8">
          <div className="mx-auto max-w-3xl">
            {renderMarkdown(location.content)}
          </div>
        </div>
      </article>

      {/* Google Maps */}
      <section className="border-t border-border bg-card py-8 md:py-12">
        <div className="container px-4 md:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-xl font-bold text-foreground mb-4">Find Us on the Map</h2>
            <div className="aspect-video rounded-xl overflow-hidden border border-border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.5!2d73.8405!3d18.5150!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDMwJzU0LjAiTiA3M8KwNTAnMjUuOCJF!5e0!3m2!1sen!2sin!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Painex Clinic location near ${location.area}`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="border-t border-border py-8 md:py-12">
        <div className="container px-4 md:px-8">
          <h2 className="text-xl font-bold text-foreground mb-6">Related Pain Management Articles</h2>
          <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </Layout>
  );
};

export default LocationPage;
