import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import viteCompression from "vite-plugin-compression";

// Data imports for prerendering (only used at build time)
import { blogPosts, categories } from "./src/data/blogData";
import { blogContents } from "./src/data/blogContents";
import { authors, getPostAuthor, getPersonJsonLd } from "./src/data/authorData";
import { locationPages } from "./src/data/locationData";

const DOMAIN = "https://www.painspecialist.blog";
const TODAY = new Date().toISOString().split("T")[0];

/* ── Simple markdown → HTML (headings, paragraphs, lists) ── */
function md2html(md: string): string {
  const lines = md.split("\n");
  const out: string[] = [];
  let inList = false;
  for (const raw of lines) {
    const t = raw.trim();
    if (!t) {
      if (inList) { out.push("</ul>"); inList = false; }
      continue;
    }
    if (t.startsWith("### ")) { if (inList) { out.push("</ul>"); inList = false; } out.push(`<h3>${t.slice(4)}</h3>`); }
    else if (t.startsWith("## ")) { if (inList) { out.push("</ul>"); inList = false; } out.push(`<h2>${t.slice(3)}</h2>`); }
    else if (t.startsWith("# ")) { if (inList) { out.push("</ul>"); inList = false; } out.push(`<h1>${t.slice(2)}</h1>`); }
    else if (t.startsWith("- ")) { if (!inList) { out.push("<ul>"); inList = true; } out.push(`<li>${t.slice(2)}</li>`); }
    else { if (inList) { out.push("</ul>"); inList = false; } out.push(`<p>${t}</p>`); }
  }
  if (inList) out.push("</ul>");
  return out.join("\n");
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Extract FAQ Q&A pairs from markdown */
function extractFAQs(md: string): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = [];
  const lines = md.split("\n");
  let currentQ = "";
  let currentA = "";
  let inFaq = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("### ") && trimmed.includes("?")) {
      if (currentQ && currentA.trim()) faqs.push({ question: currentQ, answer: currentA.trim() });
      currentQ = trimmed.replace("### ", "");
      currentA = "";
      inFaq = true;
    } else if (inFaq && (trimmed.startsWith("### ") || trimmed.startsWith("## "))) {
      if (currentQ && currentA.trim()) faqs.push({ question: currentQ, answer: currentA.trim() });
      currentQ = "";
      currentA = "";
      inFaq = false;
    } else if (inFaq && currentQ) {
      currentA += (currentA ? " " : "") + trimmed;
    }
  }
  if (currentQ && currentA.trim()) faqs.push({ question: currentQ, answer: currentA.trim() });
  return faqs;
}

/* ── Custom prerender plugin ── */
function prerenderPlugin(): Plugin {
  return {
    name: "custom-prerender",
    apply: "build",
    async closeBundle() {
      const fs = await import("fs");
      const p = await import("path");
      const distDir = p.resolve("dist");
      const tplPath = p.join(distDir, "index.html");

      if (!fs.existsSync(tplPath)) {
        console.warn("[prerender] dist/index.html not found — skipping");
        return;
      }

      const template = fs.readFileSync(tplPath, "utf-8");
      let pageCount = 0;
      const sitemapEntries: { loc: string; priority: string; changefreq: string }[] = [];

      interface PageOptions {
        route: string;
        title: string;
        desc: string;
        bodyHtml: string;
        canonical: string;
        jsonLd?: object | object[];
        ogType?: string;
        ogImage?: string;
        priority?: string;
        changefreq?: string;
      }

      function writePage(opts: PageOptions) {
        let html = template;
        const { route, title, desc, canonical, bodyHtml, jsonLd, ogType, ogImage } = opts;

        // Replace <title>
        html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);

        // Replace meta description
        html = html.replace(
          /<meta name="description" content="[^"]*">/,
          `<meta name="description" content="${esc(desc)}">`
        );

        // Replace canonical
        html = html.replace(
          /<link rel="canonical" href="[^"]*"\s*\/?>/,
          `<link rel="canonical" href="${canonical}" />`
        );

        // Replace OG tags
        html = html.replace(/<meta property="og:type" content="[^"]*"\s*\/?>/, `<meta property="og:type" content="${ogType || 'website'}" />`);
        html = html.replace(/<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${canonical}" />`);
        html = html.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(title)}">`);
        html = html.replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${esc(title)}">`);
        html = html.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(desc)}">`);
        html = html.replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${esc(desc)}">`);

        if (ogImage) {
          html = html.replace(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${ogImage}">`);
          html = html.replace(/<meta name="twitter:image" content="[^"]*">/, `<meta name="twitter:image" content="${ogImage}">`);
        }

        // Inject JSON-LD before </head>
        if (jsonLd) {
          const blocks = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
          const scripts = blocks
            .map((ld) => `<script type="application/ld+json">${JSON.stringify(ld)}</script>`)
            .join("\n");
          html = html.replace("</head>", `${scripts}\n</head>`);
        }

        // Inject body content into #root
        html = html.replace(
          '<div id="root"></div>',
          `<div id="root">${bodyHtml}</div>`
        );

        // Write file
        const filePath =
          route === "/"
            ? p.join(distDir, "index.html")
            : p.join(distDir, ...route.slice(1).split("/"), "index.html");

        fs.mkdirSync(p.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, html, "utf-8");
        pageCount++;

        sitemapEntries.push({
          loc: canonical,
          priority: opts.priority || "0.5",
          changefreq: opts.changefreq || "monthly",
        });
      }

      // ────────────────────────────────────────
      // 1. Homepage
      // ────────────────────────────────────────
      const homeCats = categories
        .filter((c) => c.slug !== "all")
        .map((c) => `<a href="/category/${c.slug}">${c.name}</a>`)
        .join(" · ");

      const homeArticles = blogPosts
        .slice(0, 30)
        .map(
          (p) =>
            `<li><a href="/blog/${p.slug}">${p.title}</a> — ${p.excerpt}</li>`
        )
        .join("\n");

      writePage({
        route: "/",
        title: "Pain Management in Pune | Pain Specialist Blog",
        desc: "Evidence-based pain management articles by fellowship-certified pain specialists (FIPM, FIAPM) at Painex Clinic, Pune. Book a consultation today.",
        bodyHtml: `<header><h1>Expert Pain Management Blog by Specialists in Pune</h1>
         <p>Evidence-based articles on migraine, back pain, sciatica, knee pain, neck pain, nerve pain, and more by Dr. Kashinath Bangar, Dr. Nivedita Page &amp; Dr. Gayatri Bangar — fellowship-certified pain management specialists (FIPM, FIAPM) at Painex Pain Management Clinic, Pune.</p></header>
         <nav aria-label="Pain conditions">${homeCats}</nav>
         <section><h2>Latest Articles</h2><ul>${homeArticles}</ul></section>
         <section><h2>Our Pain Specialists</h2>
         ${authors.map((a) => `<div><h3><a href="/authors/${a.slug}">${a.name}</a></h3><p>${a.credentialsDisplay} · ${a.jobTitle}</p><p>${a.bio}</p></div>`).join("\n")}
         </section>`,
        canonical: `${DOMAIN}/`,
        priority: "1.0",
        changefreq: "weekly",
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "MedicalBusiness",
            name: "Painex Pain Management Clinic",
            url: DOMAIN,
            logo: `${DOMAIN}/favicon.png`,
            telephone: "+91-8390442266",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Apte Road, Deccan Gymkhana",
              addressLocality: "Pune",
              addressRegion: "Maharashtra",
              postalCode: "411004",
              addressCountry: "IN",
            },
            medicalSpecialty: "Pain Management",
            areaServed: "Pune",
            sameAs: ["https://www.painex.org"],
            member: authors.map((a) => ({
              "@type": "Person",
              name: a.name,
              jobTitle: a.jobTitle,
              url: `${DOMAIN}/authors/${a.slug}`,
            })),
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Pain Specialist Blog",
            url: DOMAIN,
            potentialAction: {
              "@type": "SearchAction",
              target: `${DOMAIN}/blog?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          },
        ],
      });

      // ────────────────────────────────────────
      // 2. Blog listing (/blogs)
      // ────────────────────────────────────────
      const allArticles = blogPosts
        .map(
          (p) =>
            `<li><a href="/blog/${p.slug}">${p.title}</a> — ${p.metaDescription}</li>`
        )
        .join("\n");

      writePage({
        route: "/blogs",
        title: "Pain Management Blog | Pain Specialist Blog",
        desc: "Browse expert articles on migraine, back pain, sciatica, knee pain, and more. Evidence-based guides from pain specialists in Pune.",
        bodyHtml: `<h1>Pain Management Blog</h1><p>Expert articles by fellowship-certified pain specialists in Pune.</p><ul>${allArticles}</ul>`,
        canonical: `${DOMAIN}/blogs`,
        priority: "0.9",
        changefreq: "daily",
      });

      // ────────────────────────────────────────
      // 3. Every blog post
      // ────────────────────────────────────────
      for (const post of blogPosts) {
        const content = blogContents[post.slug] || "";
        const author = getPostAuthor(post.slug, post.category);
        const contentHtml = md2html(content);
        const faqs = extractFAQs(content);
        const catName = categories.find((c) => c.slug === post.category)?.name || post.category;

        const jsonLdBlocks: object[] = [
          {
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            name: post.title,
            url: `${DOMAIN}/blog/${post.slug}`,
            datePublished: post.date,
            dateModified: post.date,
            lastReviewed: post.date,
            specialty: "Pain Management",
            description: post.metaDescription,
            author: {
              "@type": "Person",
              name: author.name,
              jobTitle: "Pain Management Specialist",
              url: `${DOMAIN}/authors/${author.slug}`,
            },
            publisher: {
              "@type": "Organization",
              name: "Painex Pain Management Clinic",
              url: DOMAIN,
            },
            about: {
              "@type": "MedicalCondition",
              name: catName,
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.metaDescription,
            datePublished: post.date,
            dateModified: post.date,
            author: {
              "@type": "Person",
              name: author.name,
              url: `${DOMAIN}/authors/${author.slug}`,
              jobTitle: author.jobTitle,
            },
            publisher: {
              "@type": "Organization",
              name: "Pain Specialist Blog",
              url: DOMAIN,
            },
            mainEntityOfPage: `${DOMAIN}/blog/${post.slug}`,
          },
        ];

        // FAQPage schema
        if (faqs.length >= 1) {
          jsonLdBlocks.push({
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
          });
        }

        writePage({
          route: `/blog/${post.slug}`,
          title: `${post.title.length > 50 ? post.title.slice(0, 50) + '…' : post.title} | Pain Specialist Blog`,
          desc: post.metaDescription,
          bodyHtml: `<article>
            <h1>${post.title}</h1>
            <p>Written by <a href="/authors/${author.slug}">${author.name}</a>, ${author.credentialsDisplay} | Medically Reviewed: ${post.date}</p>
            <time datetime="${post.date}">${post.date}</time> · ${post.readTime}
            <p><em>${post.excerpt}</em></p>
            ${contentHtml}
            <footer><p>Medically reviewed by <a href="/authors/${author.slug}">${author.name}</a> (${author.credentialsDisplay}), ${author.worksFor}.</p></footer>
          </article>`,
          canonical: `${DOMAIN}/blog/${post.slug}`,
          ogType: "article",
          priority: "0.8",
          changefreq: "monthly",
          jsonLd: jsonLdBlocks,
        });
      }

      // ────────────────────────────────────────
      // 4. Category pages
      // ────────────────────────────────────────
      for (const cat of categories.filter((c) => c.slug !== "all")) {
        const catPosts = blogPosts.filter((p) => p.category === cat.slug);
        const list = catPosts
          .map(
            (p) =>
              `<li><a href="/blog/${p.slug}">${p.title}</a> — ${p.metaDescription}</li>`
          )
          .join("\n");

        writePage({
          route: `/category/${cat.slug}`,
          title: `${cat.name} Treatment in Pune | Pain Specialist Blog`,
          desc: `Expert articles on ${cat.name.toLowerCase()} treatment by pain specialists in Pune. Evidence-based guides. Book a consultation today.`,
          bodyHtml: `<h1>${cat.name} Treatment in Pune — Expert Guide</h1><p>${catPosts.length} expert articles on ${cat.name.toLowerCase()} by fellowship-certified pain specialists in Pune.</p><ul>${list}</ul>`,
          canonical: `${DOMAIN}/category/${cat.slug}`,
          priority: "0.9",
          changefreq: "weekly",
        });
      }

      // ────────────────────────────────────────
      // 5. Author profile pages
      // ────────────────────────────────────────
      for (const author of authors) {
        const authorPosts = blogPosts.filter(
          (p) => getPostAuthor(p.slug, p.category).slug === author.slug
        );
        const list = authorPosts
          .map(
            (p) => `<li><a href="/blog/${p.slug}">${p.title}</a></li>`
          )
          .join("\n");

        writePage({
          route: `/authors/${author.slug}`,
          title: `${author.name} – Pain Specialist in Pune`,
          desc: `${author.name} (${author.credentialsDisplay}) – ${author.jobTitle} at Painex Clinic, Pune. Read expert pain management articles.`,
          bodyHtml: `<h1>${author.name}</h1>
           <p>${author.credentialsDisplay}</p>
           <p>${author.jobTitle} · ${author.worksFor}</p>
           <p>${author.bio}</p>
           <h2>Articles by ${author.name} (${authorPosts.length})</h2>
           <ul>${list}</ul>`,
          canonical: `${DOMAIN}/authors/${author.slug}`,
          ogType: "profile",
          ogImage: `${DOMAIN}${author.photo}`,
          priority: "0.7",
          changefreq: "monthly",
          jsonLd: getPersonJsonLd(author),
        });
      }

      // ────────────────────────────────────────
      // 6. Conditions page
      // ────────────────────────────────────────
      const conditionLinks = categories
        .filter((c) => c.slug !== "all")
        .map(
          (c) => `<li><a href="/category/${c.slug}">${c.name}</a></li>`
        )
        .join("\n");

      writePage({
        route: "/conditions",
        title: "Pain Conditions We Treat | Pain Specialist Pune",
        desc: "Explore all pain conditions treated at Painex Clinic, Pune — migraine, back pain, sciatica, knee pain, nerve pain, and more.",
        bodyHtml: `<h1>Pain Conditions We Treat in Pune</h1><p>Our fellowship-certified pain specialists treat a wide range of conditions using minimally invasive techniques.</p><ul>${conditionLinks}</ul>`,
        canonical: `${DOMAIN}/conditions`,
        priority: "0.9",
        changefreq: "weekly",
      });

      // ────────────────────────────────────────
      // 7. Location / neighbourhood pages
      // ────────────────────────────────────────
      for (const loc of locationPages) {
        const locJsonLd = {
          "@context": "https://schema.org",
          "@type": "MedicalBusiness",
          name: "Painex Pain Management Clinic",
          url: DOMAIN,
          telephone: "+91-8390442266",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Apte Road, Deccan Gymkhana",
            addressLocality: "Pune",
            addressRegion: "Maharashtra",
            postalCode: "411004",
            addressCountry: "IN",
          },
          areaServed: { "@type": "City", name: loc.area },
          medicalSpecialty: "Pain Management",
          sameAs: ["https://www.painex.org"],
        };

        const locHtml = md2html(loc.content);

        writePage({
          route: `/pune/${loc.slug}`,
          title: loc.title,
          desc: loc.metaDescription,
          bodyHtml: `<article><h1>${loc.title}</h1>${locHtml}</article>`,
          canonical: `${DOMAIN}/pune/${loc.slug}`,
          priority: "0.7",
          changefreq: "monthly",
          jsonLd: locJsonLd,
        });
      }

      // ────────────────────────────────────────
      // 7. Generate sitemap.xml
      // ────────────────────────────────────────
      const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.map((e) => `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`).join("\n")}
</urlset>`;
      fs.writeFileSync(p.join(distDir, "sitemap.xml"), sitemapXml, "utf-8");

      console.log(
        `\n✅ [prerender] Generated ${pageCount} static HTML pages + sitemap.xml in dist/\n`
      );
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    viteCompression({ algorithm: "gzip", ext: ".gz" }),
    viteCompression({ algorithm: "brotliCompress", ext: ".br" }),
    prerenderPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
          "router": ["react-router-dom", "react-router"],
          "helmet": ["react-helmet-async"],
        },
      },
    },
    cssCodeSplit: true,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2,
      },
    },
    target: "es2020",
    reportCompressedSize: true,
  },
}));
