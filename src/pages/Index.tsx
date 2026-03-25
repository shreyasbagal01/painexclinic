import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Shield, Stethoscope, MapPin, BookOpen, Search, Award } from "lucide-react";
import Layout from "@/components/Layout";
import BlogCard from "@/components/BlogCard";
import CTABanner from "@/components/CTABanner";
import CredentialsBadge from "@/components/CredentialsBadge";
import { blogPosts, categories } from "@/data/blogData";
import { categoryImages } from "@/data/categoryImages";
import { authors } from "@/data/authorData";

const Index = () => {
  const editorPicks = blogPosts.slice(0, 3);
  const latestPosts = blogPosts.slice(3, 9);

  const homepageJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "MedicalBusiness",
      name: "Painex Pain Management Clinic",
      url: "https://www.painspecialist.blog",
      telephone: "+91-8390442266",
      medicalSpecialty: "Pain Management",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Pune",
        addressRegion: "Maharashtra",
        addressCountry: "IN",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Painex Pain Management Clinic",
      url: "https://www.painex.org",
      logo: "https://www.painspecialist.blog/favicon.png",
      sameAs: ["https://www.painex.org", "https://www.headacheandmigraineclinic.com"],
      member: authors.map((a) => ({
        "@type": "Person",
        name: a.name,
        jobTitle: a.jobTitle,
        url: `https://www.painspecialist.blog/authors/${a.slug}`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Pain Specialist Blog",
      url: "https://www.painspecialist.blog",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://www.painspecialist.blog/blogs?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ];

  return (
    <Layout>
      <Helmet>
        <title>Pain Management in Pune | Pain Specialist Blog</title>
        <meta name="description" content="Evidence-based pain management articles by Dr. Kashinath Bangar, Dr. Nivedita Page & Dr. Gayatri Bangar – fellowship-certified pain specialists (FIPM, FIAPM) at Painex Clinic, Pune." />
        <link rel="canonical" href="https://www.painspecialist.blog/" />
        <meta property="og:title" content="Pain Management in Pune | Pain Specialist Blog" />
        <meta property="og:description" content="Evidence-based pain management articles by fellowship-certified pain specialists at Painex Clinic, Pune." />
        <meta property="og:url" content="https://www.painspecialist.blog/" />
        <meta property="og:image" content="https://www.painspecialist.blog/favicon.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Pain Management in Pune | Pain Specialist Blog" />
        <meta name="twitter:description" content="Evidence-based pain management articles by fellowship-certified pain specialists at Painex Clinic, Pune." />
        <meta property="og:type" content="website" />
        {homepageJsonLd.map((schema, i) => (
          <script key={i} type="application/ld+json">{JSON.stringify(schema)}</script>
        ))}
      </Helmet>

      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-br from-card via-background to-accent/20 py-10 md:py-16">
        <div className="container px-4 md:px-8 text-center">
          <h1 className="text-2xl font-bold text-foreground md:text-4xl lg:text-5xl leading-tight">
            Expert Pain Management Guides by<br className="hidden sm:block" /> Pune's Leading <span className="text-primary">Pain Specialists</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm md:text-base text-muted-foreground leading-relaxed">
            Evidence-based articles written and reviewed by{" "}
            <strong>Dr. Kashinath Bangar</strong> (MBBS DNB FIPM FIAPM),{" "}
            <strong>Dr. Nivedita Page</strong> (MBBS MD FIPM FIAPM), and{" "}
            <strong>Dr. Gayatri Bangar</strong> (MBBS DNB FIPM FIAPM) —
            Pain Specialists at Painex Clinic, Pune.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Search size={14} /> Browse Articles
            </Link>
            <Link
              to="/conditions"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
            >
              View Conditions <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Meet Our Doctors */}
      <section className="border-b border-border bg-card py-10 md:py-14">
        <div className="container px-4 md:px-8">
          <h2 className="text-center text-xl font-bold text-foreground md:text-3xl">Meet Our Doctors</h2>
          <p className="mx-auto mt-2 max-w-lg text-center text-sm text-muted-foreground">
            Three fellowship-certified pain specialists ensuring every article is medically accurate.
          </p>
          <div className="mt-6 md:mt-8 grid gap-4 md:gap-6 md:grid-cols-3">
            {authors.map((author) => (
              <Link
                key={author.slug}
                to={`/authors/${author.slug}`}
                className="group flex flex-col items-center rounded-xl border border-border bg-background p-5 md:p-6 text-center transition-all hover:border-primary hover:shadow-md active:scale-[0.98]"
              >
                <img src={author.photo} alt={author.name} className="h-16 w-16 rounded-full object-cover object-top ring-2 ring-primary/20 group-hover:ring-primary transition-all" width={64} height={64} loading="lazy" />
                <h3 className="mt-3 text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  {author.name}
                </h3>
                <div className="mt-1.5">
                  <CredentialsBadge degrees={author.degrees} />
                </div>
                <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                  {author.degrees
                    .filter((d) => d === "FIPM" || d === "FIAPM")
                    .map((d) => (
                      <span
                        key={d}
                        className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary"
                      >
                        <Award size={10} /> {d}
                      </span>
                    ))}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {author.jobTitle}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="border-b border-border bg-secondary/30 py-3 md:py-4">
        <div className="container px-4 md:px-8 flex flex-wrap items-center justify-center gap-4 md:gap-10 text-xs md:text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5"><Shield size={14} className="text-primary" /> 3 Fellowship-Certified Specialists</span>
          <span className="flex items-center gap-1.5"><Award size={14} className="text-primary" /> FIPM & FIAPM Qualified</span>
          <span className="hidden sm:flex items-center gap-1.5"><Stethoscope size={14} className="text-primary" /> Painex Clinic Pune</span>
          <span className="hidden md:flex items-center gap-1.5"><BookOpen size={14} className="text-primary" /> Evidence-Based Content</span>
        </div>
      </section>

      {/* Editor's Picks */}
      <section className="py-10 md:py-14">
        <div className="container px-4 md:px-8">
          <div className="flex items-end justify-between mb-6 md:mb-8">
            <div>
              <h2 className="text-xl font-bold text-foreground md:text-3xl">Editor's Picks</h2>
              <p className="mt-1 text-sm text-muted-foreground">Hand-picked articles our patients find most helpful.</p>
            </div>
            <Link to="/blogs" className="hidden md:inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid gap-4 md:gap-6 md:grid-cols-3">
            {editorPicks.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Topic */}
      <section className="border-y border-border bg-card py-10 md:py-14">
        <div className="container px-4 md:px-8">
          <h2 className="text-center text-xl font-bold text-foreground md:text-3xl">Browse by Topic</h2>
          <p className="mx-auto mt-2 max-w-lg text-center text-sm text-muted-foreground">
            Find expert articles on the condition that matters to you.
          </p>
          <div className="mt-6 md:mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-5">
            {categories.filter((c) => c.slug !== "all").map((cat) => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className="group flex flex-col items-center gap-2 md:gap-3 rounded-xl border border-border bg-background p-3.5 md:p-5 text-center transition-all hover:border-primary hover:shadow-md active:scale-[0.98]"
              >
                {categoryImages[cat.slug] && (
                  <img
                    src={categoryImages[cat.slug]}
                    alt={cat.name}
                    className="h-12 w-12 md:h-14 md:w-14 rounded-full object-cover ring-2 ring-border group-hover:ring-primary transition-all"
                    width={56}
                    height={56}
                    loading="lazy"
                  />
                )}
                <span className="text-xs md:text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-tight">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-10 md:py-14">
        <div className="container px-4 md:px-8">
          <div className="flex items-end justify-between mb-6 md:mb-8">
            <div>
              <h2 className="text-xl font-bold text-foreground md:text-3xl">Latest Articles</h2>
              <p className="mt-1 text-sm text-muted-foreground">Fresh insights from our pain management specialists.</p>
            </div>
            <Link to="/blogs" className="hidden md:inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              All Articles <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
          <div className="mt-6 text-center md:hidden">
            <Link to="/blogs" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              View All Articles <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* SEO Internal Links Section */}
      <section className="border-t border-border bg-card py-10 md:py-14">
        <div className="container px-4 md:px-8 max-w-5xl">
          <h2 className="text-xl font-bold text-foreground md:text-3xl text-center">
            Pain Management Resources for Pune Patients
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-muted-foreground">
            Explore our comprehensive guides written by fellowship-certified pain specialists (FIPM, FIAPM) at Painex Clinic, Pune.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {/* Migraine & Headache */}
            <div className="rounded-xl border border-border bg-background p-5">
              <h3 className="text-base font-bold text-foreground mb-3">
                <Link to="/category/migraine" className="hover:text-primary transition-colors">Migraine & Headache Treatment in Pune</Link>
              </h3>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>→ <Link to="/blog/migraine-vs-normal-headache-difference" className="text-foreground/80 hover:text-primary transition-colors">Migraine vs Normal Headache — How to Tell the Difference</Link></li>
                <li>→ <Link to="/blog/botox-for-migraine-how-it-works" className="text-foreground/80 hover:text-primary transition-colors">Botox for Chronic Migraine Treatment</Link></li>
                <li>→ <Link to="/blog/botox-for-migraine-cost-pune" className="text-foreground/80 hover:text-primary transition-colors">Botox for Migraine Cost in Pune</Link></li>
                <li>→ <Link to="/blog/common-migraine-triggers-to-avoid" className="text-foreground/80 hover:text-primary transition-colors">10 Common Migraine Triggers to Avoid</Link></li>
                <li>→ <Link to="/blog/best-treatment-chronic-migraine" className="text-foreground/80 hover:text-primary transition-colors">Best Treatment for Chronic Migraine</Link></li>
              </ul>
            </div>

            {/* Back Pain */}
            <div className="rounded-xl border border-border bg-background p-5">
              <h3 className="text-base font-bold text-foreground mb-3">
                <Link to="/category/back-pain" className="hover:text-primary transition-colors">Back Pain Specialist in Pune</Link>
              </h3>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>→ <Link to="/blog/non-surgical-treatment-back-pain" className="text-foreground/80 hover:text-primary transition-colors">Non-Surgical Treatment for Back Pain</Link></li>
                <li>→ <Link to="/blog/radiofrequency-ablation-for-back-pain" className="text-foreground/80 hover:text-primary transition-colors">Radiofrequency Ablation for Back Pain</Link></li>
                <li>→ <Link to="/blog/radiofrequency-ablation-cost-pune" className="text-foreground/80 hover:text-primary transition-colors">Radiofrequency Ablation Cost in Pune</Link></li>
                <li>→ <Link to="/blog/epidural-injection-back-pain" className="text-foreground/80 hover:text-primary transition-colors">Epidural Injection for Back Pain</Link></li>
                <li>→ <Link to="/blog/best-treatment-for-slip-disc-without-surgery" className="text-foreground/80 hover:text-primary transition-colors">Slip Disc Treatment Without Surgery</Link></li>
              </ul>
            </div>

            {/* Sciatica */}
            <div className="rounded-xl border border-border bg-background p-5">
              <h3 className="text-base font-bold text-foreground mb-3">
                <Link to="/category/sciatica" className="hover:text-primary transition-colors">Sciatica Treatment in Pune</Link>
              </h3>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>→ <Link to="/blog/sciatica-pain-symptoms-not-ignore" className="text-foreground/80 hover:text-primary transition-colors">Sciatica Symptoms You Should Not Ignore</Link></li>
                <li>→ <Link to="/blog/best-non-surgical-treatment-sciatica" className="text-foreground/80 hover:text-primary transition-colors">Best Non-Surgical Sciatica Treatment</Link></li>
                <li>→ <Link to="/blog/sciatica-vs-piriformis-syndrome" className="text-foreground/80 hover:text-primary transition-colors">Sciatica vs Piriformis Syndrome</Link></li>
                <li>→ <Link to="/blog/yoga-for-sciatica-pain-relief" className="text-foreground/80 hover:text-primary transition-colors">Yoga for Sciatica Pain Relief</Link></li>
                <li>→ <Link to="/blog/best-sleeping-position-for-sciatica-pain" className="text-foreground/80 hover:text-primary transition-colors">Best Sleeping Position for Sciatica</Link></li>
              </ul>
            </div>

            {/* Knee Pain */}
            <div className="rounded-xl border border-border bg-background p-5">
              <h3 className="text-base font-bold text-foreground mb-3">
                <Link to="/category/knee-pain" className="hover:text-primary transition-colors">Knee Pain Treatment in Pune</Link>
              </h3>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>→ <Link to="/blog/prp-therapy-for-knee-pain-pune" className="text-foreground/80 hover:text-primary transition-colors">PRP Therapy for Knee Pain</Link></li>
                <li>→ <Link to="/blog/prp-therapy-cost-pune" className="text-foreground/80 hover:text-primary transition-colors">PRP Therapy Cost in Pune</Link></li>
                <li>→ <Link to="/blog/knee-pain-climbing-stairs-causes" className="text-foreground/80 hover:text-primary transition-colors">Knee Pain When Climbing Stairs</Link></li>
                <li>→ <Link to="/blog/knee-replacement-alternatives-pune" className="text-foreground/80 hover:text-primary transition-colors">Knee Replacement Alternatives in Pune</Link></li>
                <li>→ <Link to="/blog/best-treatment-knee-osteoarthritis" className="text-foreground/80 hover:text-primary transition-colors">Best Treatment for Knee Osteoarthritis</Link></li>
              </ul>
            </div>

            {/* Neck Pain */}
            <div className="rounded-xl border border-border bg-background p-5">
              <h3 className="text-base font-bold text-foreground mb-3">
                <Link to="/category/neck-pain" className="hover:text-primary transition-colors">Neck Pain Specialist in Pune</Link>
              </h3>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>→ <Link to="/blog/cervical-spondylosis-treatment-without-surgery" className="text-foreground/80 hover:text-primary transition-colors">Cervical Spondylosis Treatment Without Surgery</Link></li>
                <li>→ <Link to="/blog/text-neck-syndrome-causes-treatment" className="text-foreground/80 hover:text-primary transition-colors">Text Neck Syndrome — Causes and Treatment</Link></li>
                <li>→ <Link to="/blog/best-exercises-for-neck-pain-relief" className="text-foreground/80 hover:text-primary transition-colors">Best Exercises for Neck Pain Relief</Link></li>
                <li>→ <Link to="/blog/neck-pain-and-headache-connection" className="text-foreground/80 hover:text-primary transition-colors">Neck Pain and Headache Connection</Link></li>
              </ul>
            </div>

            {/* Shoulder Pain */}
            <div className="rounded-xl border border-border bg-background p-5">
              <h3 className="text-base font-bold text-foreground mb-3">
                <Link to="/category/shoulder-pain" className="hover:text-primary transition-colors">Shoulder Pain Treatment in Pune</Link>
              </h3>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>→ <Link to="/blog/frozen-shoulder-stages-recovery" className="text-foreground/80 hover:text-primary transition-colors">Frozen Shoulder — Stages and Recovery</Link></li>
                <li>→ <Link to="/blog/shoulder-pain-at-night-causes" className="text-foreground/80 hover:text-primary transition-colors">Shoulder Pain at Night — Causes and Fix</Link></li>
                <li>→ <Link to="/blog/rotator-cuff-injury-treatment-options" className="text-foreground/80 hover:text-primary transition-colors">Rotator Cuff Injury Treatment Options</Link></li>
                <li>→ <Link to="/blog/shoulder-injection-therapy-pune" className="text-foreground/80 hover:text-primary transition-colors">Shoulder Injection Therapy in Pune</Link></li>
              </ul>
            </div>

            {/* Nerve & Facial Pain */}
            <div className="rounded-xl border border-border bg-background p-5">
              <h3 className="text-base font-bold text-foreground mb-3">
                <Link to="/category/nerve-pain" className="hover:text-primary transition-colors">Nerve Pain & Facial Pain Treatment</Link>
              </h3>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>→ <Link to="/blog/diabetic-neuropathy-treatment-pune" className="text-foreground/80 hover:text-primary transition-colors">Diabetic Neuropathy Treatment in Pune</Link></li>
                <li>→ <Link to="/blog/carpal-tunnel-syndrome-pain-management" className="text-foreground/80 hover:text-primary transition-colors">Carpal Tunnel Syndrome Pain Management</Link></li>
                <li>→ <Link to="/blog/trigeminal-neuralgia-treatment-pune" className="text-foreground/80 hover:text-primary transition-colors">Trigeminal Neuralgia Treatment in Pune</Link></li>
                <li>→ <Link to="/blog/tmj-pain-treatment-without-surgery" className="text-foreground/80 hover:text-primary transition-colors">TMJ Pain Treatment Without Surgery</Link></li>
              </ul>
            </div>

            {/* Cost & General */}
            <div className="rounded-xl border border-border bg-background p-5">
              <h3 className="text-base font-bold text-foreground mb-3">
                <Link to="/category/general-pain" className="hover:text-primary transition-colors">Pain Treatment Cost & General Guides</Link>
              </h3>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>→ <Link to="/blog/pain-specialist-consultation-fees-pune" className="text-foreground/80 hover:text-primary transition-colors">Pain Specialist Consultation Fees in Pune</Link></li>
                <li>→ <Link to="/blog/nerve-block-injection-cost-india" className="text-foreground/80 hover:text-primary transition-colors">Nerve Block Injection Cost in India</Link></li>
                <li>→ <Link to="/blog/epidural-injection-cost-pune" className="text-foreground/80 hover:text-primary transition-colors">Epidural Injection Cost in Pune</Link></li>
                <li>→ <Link to="/blog/what-does-pain-specialist-do" className="text-foreground/80 hover:text-primary transition-colors">What Does a Pain Specialist Do?</Link></li>
                <li>→ <Link to="/blog/pain-management-without-surgery-pune" className="text-foreground/80 hover:text-primary transition-colors">Pain Management Without Surgery in Pune</Link></li>
              </ul>
            </div>
          </div>

          {/* Heel Pain & Plantar Fasciitis */}
          <div className="mt-6 rounded-xl border border-border bg-background p-5">
            <h3 className="text-base font-bold text-foreground mb-3">
              <Link to="/category/heel-pain" className="hover:text-primary transition-colors">Heel Pain & Plantar Fasciitis Treatment in Pune</Link>
            </h3>
            <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-sm text-muted-foreground">
              <span>→ <Link to="/blog/plantar-fasciitis-treatment-pune" className="text-foreground/80 hover:text-primary transition-colors">Plantar Fasciitis Treatment in Pune</Link></span>
              <span>→ <Link to="/blog/achilles-tendon-pain-causes-treatment" className="text-foreground/80 hover:text-primary transition-colors">Achilles Tendon Pain Treatment</Link></span>
              <span>→ <Link to="/blog/what-causes-heel-pain-in-morning" className="text-foreground/80 hover:text-primary transition-colors">Why Heel Pain is Worst in the Morning</Link></span>
              <span>→ <Link to="/blog/heel-pain-best-shoes-and-insoles" className="text-foreground/80 hover:text-primary transition-colors">Best Shoes and Insoles for Heel Pain</Link></span>
            </div>
          </div>

          {/* Location Links */}
          <div className="mt-6 rounded-xl border border-border bg-background p-5">
            <h3 className="text-base font-bold text-foreground mb-3">Pain Specialist by Location in Pune</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "Deccan", slug: "deccan-pain-specialist" },
                { name: "Baner", slug: "baner-pain-specialist" },
                { name: "Kothrud", slug: "kothrud-pain-specialist" },
                { name: "Hinjewadi", slug: "hinjewadi-pain-specialist" },
                { name: "Wakad", slug: "wakad-pain-specialist" },
                { name: "Aundh", slug: "aundh-pain-specialist" },
                { name: "Viman Nagar", slug: "viman-nagar-pain-specialist" },
                { name: "Shivajinagar", slug: "shivajinagar-pain-specialist" },
                { name: "PCMC", slug: "pcmc-pain-specialist" },
                { name: "Kharadi", slug: "kharadi-pain-specialist" },
              ].map((loc) => (
                <Link
                  key={loc.slug}
                  to={`/pune/${loc.slug}`}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  Pain Specialist in {loc.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTABanner />
    </Layout>
  );
};

export default Index;
