import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import CTABanner from "@/components/CTABanner";
import BlogCard from "@/components/BlogCard";
import { blogPosts } from "@/data/blogData";
import { categoryImages } from "@/data/categoryImages";

interface Condition {
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  category: string;
  blogCategory: string;
}

const conditions: Condition[] = [
  { name: "Migraine", slug: "migraine", subtitle: "More than just a headache — it can take over your whole day", description: "Imagine a throbbing pain so intense that light, sound, even the smell of food makes it worse. That's migraine. We see patients who've lived with this for years, thinking it's 'just a bad headache.' It's not. It's a neurological condition, and the good news? It responds really well to the right treatment.", category: "Headache & Migraine", blogCategory: "migraine" },
  { name: "Chronic Daily Migraine", slug: "chronic-daily-migraine", subtitle: "When headaches become your constant companion", description: "Some of our patients tell us they can't remember the last day they woke up without a headache. If you're having headaches more than 15 days a month — that's not normal, and painkillers alone won't cut it. We use preventive strategies that can genuinely give you your life back.", category: "Headache & Migraine", blogCategory: "migraine" },
  { name: "Tension-Type Headache", slug: "tension-type-headache", subtitle: "That tight, band-like pressure around your head", description: "This is the headache most people shrug off — the one that sits like a tight band around your forehead. It's usually tied to stress, poor posture, or screen time. Most of the time, lifestyle changes help enormously. But when it becomes chronic, we need to dig deeper.", category: "Headache & Migraine", blogCategory: "migraine" },
  { name: "Cervicogenic Headache", slug: "cervicogenic-headache", subtitle: "Your headache might actually be coming from your neck", description: "Here's something many patients don't know: your headache could be starting in your neck. We often see IT professionals who come in for headache treatment, and the real culprit turns out to be their cervical spine. Once we treat the neck, the headaches disappear.", category: "Headache & Migraine", blogCategory: "neck-pain" },
  { name: "Medication Overuse Headache", slug: "medication-overuse-headache", subtitle: "The painkillers you're taking might be making things worse", description: "This one surprises people. If you're reaching for a painkiller more than 2-3 times a week, the medication itself can start causing headaches. It's a vicious cycle — and breaking it requires a careful, specialist-guided approach.", category: "Headache & Migraine", blogCategory: "migraine" },
  { name: "Neuralgic Headache", slug: "neuralgic-headache", subtitle: "Sharp, electric jolts of pain in the head", description: "Patients describe it as a sudden electric shock at the back of the head. It comes out of nowhere, lasts seconds, and can be terrifying. This is usually occipital neuralgia — a nerve issue that responds beautifully to targeted nerve blocks.", category: "Headache & Migraine", blogCategory: "nerve-pain" },
  { name: "Trigeminal Neuralgia", slug: "trigeminal-neuralgia", subtitle: "Often called the 'suicide disease' because of how severe it is", description: "This is one of the most painful conditions we treat. Patients describe it as an electric shock across the face — triggered by something as simple as a breeze, brushing teeth, or chewing food. It's life-altering, but very treatable with the right specialist.", category: "Headache & Migraine", blogCategory: "facial-pain" },
  { name: "Lower Back Pain", slug: "lower-back-pain", subtitle: "The complaint we hear most — from software engineers to grandparents", description: "Nearly everyone will experience lower back pain at some point. But when it lingers for weeks, starts waking you up at night, or shoots down your leg — that's your body telling you something deeper is going on. We help figure out exactly what, and treat it without surgery in most cases.", category: "Back & Spine", blogCategory: "back-pain" },
  { name: "Slip Disc (Herniated Disc)", slug: "slip-disc", subtitle: "When a spinal disc pushes out and presses on a nerve", description: "The word 'slip disc' scares people — they imagine they'll need surgery. In reality, the vast majority of disc herniations heal with the right non-surgical care. We've helped hundreds of patients avoid surgery with targeted injections and rehabilitation.", category: "Back & Spine", blogCategory: "back-pain" },
  { name: "Sciatica", slug: "sciatica", subtitle: "That shooting pain from your back all the way down your leg", description: "You know it's sciatica when the pain doesn't stay in your back — it travels. Down through your buttock, the back of your thigh, sometimes all the way to your foot. Sitting makes it worse. Coughing makes it worse. It's miserable, but it's also one of the conditions we treat most successfully.", category: "Back & Spine", blogCategory: "sciatica" },
  { name: "Spinal Stenosis", slug: "spinal-stenosis", subtitle: "The spinal canal narrows, squeezing the nerves inside", description: "This usually happens as we age. The spaces in the spine get tighter, and the nerves get squeezed. Walking becomes painful, and you find yourself leaning forward or needing to sit down after short distances. We have interventional options that can open up space and ease the pressure.", category: "Back & Spine", blogCategory: "back-pain" },
  { name: "Spondylosis", slug: "spondylosis", subtitle: "Wear and tear of the spine that comes with age", description: "Think of it as 'grey hair for the spine' — it happens to almost everyone eventually. The discs dry out, the joints stiffen, and bone spurs form. It doesn't always cause pain, but when it does, we have plenty of ways to manage it effectively.", category: "Back & Spine", blogCategory: "back-pain" },
  { name: "Cervical Spondylosis", slug: "cervical-spondylosis", subtitle: "The neck version of wear-and-tear arthritis", description: "We used to see this mainly in people over 60. Now? We're seeing it in 30-year-olds who spend 10 hours a day at a screen. The discs in your neck degenerate, the joints stiffen, and sometimes the nerves get pinched. The stiffness, the grinding sound when you turn your head — it's all treatable.", category: "Neck Pain", blogCategory: "neck-pain" },
  { name: "Tech Neck", slug: "tech-neck", subtitle: "The modern epidemic nobody's talking about", description: "Your head weighs about 5 kg. Tilt it forward 45 degrees to look at your phone, and your neck feels 22 kg of force. Do that for 4 hours a day, every day, and you've got a recipe for chronic neck pain. We see this constantly in Pune's IT crowd — and thankfully, it's very fixable.", category: "Neck Pain", blogCategory: "neck-pain" },
  { name: "Frozen Shoulder", slug: "frozen-shoulder", subtitle: "Your shoulder slowly freezes up until you can barely move it", description: "It starts so gradually you barely notice. A little pain reaching behind your back. Then one day you can't comb your hair. Frozen shoulder is frustrating because it develops slowly and can take months to resolve on its own. But with the right treatment — injections, physiotherapy, sometimes hydrodilatation — we can cut that timeline dramatically.", category: "Joint Pain", blogCategory: "shoulder-pain" },
  { name: "Knee Osteoarthritis", slug: "knee-osteoarthritis", subtitle: "When going up stairs becomes the hardest part of your day", description: "The cartilage in your knee doesn't regenerate. Once it wears down, every step can hurt — especially stairs. But that doesn't mean your only option is knee replacement. We have PRP injections, nerve blocks, and structured rehab that help many patients delay or avoid surgery entirely.", category: "Joint Pain", blogCategory: "knee-pain" },
  { name: "Neuropathic Pain", slug: "neuropathic-pain", subtitle: "When the nerves themselves become the source of pain", description: "This pain feels different from anything else — burning, tingling, electric shocks, or numbness that's somehow still painful. Regular painkillers barely touch it. That's because it's not tissue damage; it's the nerves misfiring. We use specific medications, nerve blocks, and sometimes neuromodulation to quiet things down.", category: "Nerve Pain", blogCategory: "nerve-pain" },
  { name: "Diabetic Neuropathy", slug: "diabetic-neuropathy", subtitle: "Diabetes slowly damaging the nerves in your feet and hands", description: "High blood sugar, over time, silently damages the tiny nerves in your extremities. It starts with tingling in the toes, then burning in the feet, then numbness. By the time most patients come to us, it's been going on for years. We can't reverse the damage, but we can significantly reduce the pain and prevent further progression.", category: "Nerve Pain", blogCategory: "nerve-pain" },
  { name: "Plantar Fasciitis", slug: "plantar-fasciitis", subtitle: "That stabbing heel pain every morning when you step out of bed", description: "Your alarm goes off, you swing your feet to the floor, and — ouch. That sharp stab in your heel is almost certainly plantar fasciitis. The tissue under your foot is inflamed. It's incredibly common, and frustratingly persistent if you don't treat it right. Stretching, proper shoes, and sometimes a targeted injection can make it go away for good.", category: "Other Conditions", blogCategory: "heel-pain" },
  { name: "Fibromyalgia", slug: "fibromyalgia", subtitle: "Pain everywhere, fatigue, and doctors who can't find anything 'wrong'", description: "Fibromyalgia patients often feel dismissed — 'your tests are normal, it's in your head.' It's not. It's a real condition where your brain's pain processing goes haywire. Everything hurts more than it should. We take it seriously, and we treat it with a combination of medication, exercise, and sometimes counseling.", category: "Other Conditions", blogCategory: "general-pain" },
];

const conditionCategories = [
  "Headache & Migraine",
  "Back & Spine",
  "Neck Pain",
  "Joint Pain",
  "Nerve Pain",
  "Other Conditions",
];

const Conditions = () => {
  const [active, setActive] = useState<string | null>(null);
  const activeCondition = conditions.find((c) => c.slug === active);

  return (
    <Layout>
      <Helmet>
        <title>Pain Conditions We Treat – Pain Specialist in Pune</title>
        <meta name="description" content="Explore all pain conditions treated at our clinic in Pune — migraine, back pain, sciatica, knee pain, nerve pain, and more. Find your condition." />
        <link rel="canonical" href="https://www.painspecialist.blog/conditions" />
        <meta property="og:title" content="Pain Conditions We Treat | Pain Specialist Pune" />
        <meta property="og:description" content="Explore all pain conditions treated at Painex Clinic, Pune." />
        <meta property="og:url" content="https://www.painspecialist.blog/conditions" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Pain Conditions We Treat | Pain Specialist Pune" />
        <meta name="twitter:description" content="Explore all pain conditions treated at Painex Clinic, Pune." />
      </Helmet>
      <section className="bg-gradient-to-br from-primary/10 via-accent/30 to-background py-10 md:py-14 text-center">
        <div className="container px-4 md:px-8">
          <h1 className="text-2xl font-bold text-foreground md:text-4xl">
            What's Causing Your Pain?
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm md:text-base text-muted-foreground">
            Every patient's pain has a story. Tap on a condition below to understand what's happening in your body — and what we can do about it.
          </p>
        </div>
      </section>

      {/* Condition Cards by Category */}
      <section className="py-8 md:py-12">
        <div className="container px-4 md:px-8 max-w-5xl">
          {conditionCategories.map((cat) => {
            const items = conditions.filter((c) => c.category === cat);
            return (
              <div key={cat} className="mb-8 md:mb-10">
                <h2 className="mb-3 text-sm md:text-lg font-semibold uppercase tracking-wide text-primary">
                  {cat}
                </h2>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {items.map((c) => (
                    <button
                      key={c.slug}
                      onClick={() => setActive(active === c.slug ? null : c.slug)}
                      className={`rounded-xl border-2 px-3.5 py-2.5 md:px-5 md:py-3 text-sm md:text-base font-medium transition-all active:scale-[0.97] ${
                        active === c.slug
                          ? "border-primary bg-primary text-primary-foreground shadow-md"
                          : "border-border bg-card text-foreground hover:border-primary/50 hover:shadow-sm"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Expanded Detail */}
          {activeCondition && (
            <div className="mt-4 md:mt-6 rounded-2xl border border-border bg-card p-5 md:p-8 shadow-card animate-in fade-in slide-in-from-top-2">
              <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                {categoryImages[activeCondition.blogCategory] && (
                  <img
                    src={categoryImages[activeCondition.blogCategory]}
                    alt={activeCondition.name}
                    className="w-full md:w-48 h-32 object-cover rounded-xl"
                    loading="lazy"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-xl md:text-2xl font-bold text-foreground">{activeCondition.name}</h2>
                  <p className="mt-1 text-sm font-medium text-primary">{activeCondition.subtitle}</p>
                  <p className="mt-3 text-sm md:text-base leading-relaxed text-muted-foreground">{activeCondition.description}</p>
                  <div className="mt-5 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                    <a
                      href="https://www.painex.org/book-an-appointment/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:bg-primary/80"
                    >
                      Book Appointment
                    </a>
                    <Link
                      to={`/category/${activeCondition.blogCategory}`}
                      className="flex items-center justify-center rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent active:bg-accent/80"
                    >
                      Read Related Articles →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Related Blog Posts */}
              {(() => {
                const relatedPosts = blogPosts.filter(p => p.category === activeCondition.blogCategory).slice(0, 3);
                if (relatedPosts.length === 0) return null;
                return (
                  <div className="mt-6 md:mt-8 border-t border-border pt-5 md:pt-6">
                    <h3 className="text-base md:text-lg font-semibold text-foreground mb-3 md:mb-4">Related Articles</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      {relatedPosts.map(p => (
                        <BlogCard key={p.slug} post={p} />
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </section>

      <CTABanner />
    </Layout>
  );
};

export default Conditions;