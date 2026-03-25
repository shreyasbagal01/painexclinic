import { useParams, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import BlogCard from "@/components/BlogCard";
import CTABanner from "@/components/CTABanner";
import { blogPosts, categories } from "@/data/blogData";
import { categoryImages } from "@/data/categoryImages";

const categoryDescriptions: Record<string, string> = {
  migraine: "Expert articles on migraine and headache treatment, triggers, prevention, and when to see a headache specialist in Pune. Our fellowship-certified migraine specialists cover Botox treatment, nerve blocks, chronic migraine management, and medication-overuse headache.",
  "back-pain": "Learn about back pain causes, slip disc treatment, radiofrequency ablation, epidural injections, and modern non-surgical pain management options from back pain specialists in Pune.",
  sciatica: "Comprehensive guides on sciatica pain — symptoms, causes, yoga exercises, sleeping positions, and non-surgical treatments including epidural injections and nerve blocks available in Pune.",
  "neck-pain": "Explore neck pain causes including text neck syndrome, cervical spondylosis, and cervicogenic headache. Non-surgical treatment options from neck pain specialists in Pune.",
  "knee-pain": "Expert articles on knee pain, osteoarthritis, PRP therapy, knee pain when climbing stairs, and non-surgical treatment alternatives to knee replacement from pain specialists in Pune.",
  "shoulder-pain": "Learn about frozen shoulder stages and recovery, rotator cuff injuries, shoulder pain at night, and effective injection therapy from shoulder pain specialists in Pune.",
  "nerve-pain": "Understand nerve pain conditions including diabetic neuropathy, carpal tunnel syndrome, pinched nerves, and find effective treatments from nerve pain specialists in Pune.",
  "facial-pain": "Expert information on trigeminal neuralgia, TMJ disorders, and facial pain conditions with non-surgical treatment options available from pain specialists in Pune.",
  "heel-pain": "Guides on plantar fasciitis treatment, Achilles tendon pain, morning heel pain causes, and best shoes for heel pain from a heel pain specialist in Pune.",
  "general-pain": "Comprehensive guides on chronic pain management, pain specialist consultation, nerve block injections, treatment costs, and when to see a pain specialist in Pune.",
};

const categorySeoContent: Record<string, { heading: string; text: string }> = {
  migraine: {
    heading: "About Migraine Treatment in Pune",
    text: "Migraine is a neurological condition that affects millions of Indians, causing throbbing headaches, nausea, and sensitivity to light and sound. At Painex Clinic, our migraine specialists offer advanced treatments including Botox injections for chronic migraine, occipital nerve blocks, and preventive medication management. If you experience more than 4 migraines per month, it may be time to consult a headache specialist in Pune for a personalised prevention plan.",
  },
  "back-pain": {
    heading: "About Back Pain Treatment in Pune",
    text: "Back pain is the most common pain condition we treat at Painex Clinic, Pune — particularly among IT professionals and working adults. Our back pain specialists offer non-surgical treatments including epidural steroid injections, radiofrequency ablation (RFA) for facet joint pain, and PRP therapy. Most slip disc cases and chronic lower back pain can be effectively managed without surgery using modern interventional pain management techniques.",
  },
  sciatica: {
    heading: "About Sciatica Treatment in Pune",
    text: "Sciatica causes shooting pain from the lower back down the leg due to nerve compression. At our clinic in Pune, we treat sciatica with targeted epidural injections, nerve blocks, and guided physiotherapy. Over 80% of sciatica cases resolve without surgery. Our specialists also differentiate between true sciatica and piriformis syndrome, which require different treatment approaches.",
  },
  "neck-pain": {
    heading: "About Neck Pain Treatment in Pune",
    text: "Neck pain from cervical spondylosis, text neck syndrome, and cervical disc problems is increasingly common in Pune's IT professionals. Our neck pain specialists offer non-surgical treatments including cervical facet joint injections, radiofrequency ablation, and structured physiotherapy. Most cervical spondylosis cases are effectively managed without surgery.",
  },
  "knee-pain": {
    heading: "About Knee Pain Treatment in Pune",
    text: "Knee osteoarthritis, patellofemoral pain, and meniscal injuries are common causes of knee pain that we treat at Painex Clinic, Pune. Our specialists offer PRP therapy, hyaluronic acid injections, genicular nerve blocks, and radiofrequency ablation as alternatives to knee replacement surgery. Many patients delay or avoid surgery entirely with these modern treatments.",
  },
  "shoulder-pain": {
    heading: "About Shoulder Pain Treatment in Pune",
    text: "Frozen shoulder, rotator cuff injuries, and calcific tendinitis are common shoulder conditions we treat at Painex Clinic. Our shoulder pain specialists offer hydrodilatation, corticosteroid injections, and guided physiotherapy. Frozen shoulder follows three predictable stages, and early treatment can significantly shorten the recovery timeline.",
  },
  "nerve-pain": {
    heading: "About Nerve Pain Treatment in Pune",
    text: "Nerve pain (neuropathic pain) feels different from regular pain — burning, tingling, electric shocks, or numbness. Common conditions include diabetic neuropathy, carpal tunnel syndrome, and pinched nerves. Our specialists use targeted medications like pregabalin, nerve blocks, and neuromodulation techniques to manage nerve pain effectively.",
  },
  "facial-pain": {
    heading: "About Facial Pain Treatment in Pune",
    text: "Trigeminal neuralgia and TMJ disorders are the most common causes of severe facial pain. Trigeminal neuralgia, often called the most painful condition known, responds well to carbamazepine and radiofrequency ablation. TMJ disorders are treated with bite splints, Botox injections, and trigger point therapy — surgery is rarely needed.",
  },
  "heel-pain": {
    heading: "About Heel Pain Treatment in Pune",
    text: "Plantar fasciitis is the most common cause of heel pain, causing stabbing pain with the first steps every morning. Achilles tendinopathy causes pain at the back of the heel. Our specialists offer shockwave therapy, PRP injections, corticosteroid injections, and structured stretching programmes. Over 90% of heel pain cases resolve without surgery.",
  },
  "general-pain": {
    heading: "About Pain Management in Pune",
    text: "Modern pain management goes far beyond painkillers. At Painex Clinic, our fellowship-certified pain specialists (FIPM, FIAPM) use interventional procedures including nerve blocks, radiofrequency ablation, epidural injections, and regenerative treatments like PRP therapy. Whether you have chronic back pain, migraine, sciatica, or nerve pain, non-surgical treatment options can provide lasting relief.",
  },
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

      {/* SEO Content Block */}
      {categorySeoContent[slug || ""] && (
        <section className="border-t border-border bg-secondary/20 py-8 md:py-10">
          <div className="container px-4 md:px-8 max-w-3xl">
            <h2 className="text-lg font-bold text-foreground">{categorySeoContent[slug!].heading}</h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{categorySeoContent[slug!].text}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href="https://www.painex.org/book-an-appointment/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Book Appointment
              </a>
              <Link
                to="/conditions"
                className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
              >
                View All Conditions
              </Link>
            </div>
          </div>
        </section>
      )}

      <CTABanner />
    </Layout>
  );
};

export default Category;
