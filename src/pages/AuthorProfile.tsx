import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ChevronRight } from "lucide-react";
import Layout from "@/components/Layout";
import BlogCard from "@/components/BlogCard";
import CredentialsBadge from "@/components/CredentialsBadge";
import CTABanner from "@/components/CTABanner";
import { getAuthorBySlug, getPostAuthor, getPersonJsonLd } from "@/data/authorData";
import { blogPosts } from "@/data/blogData";

const AuthorProfile = () => {
  const { slug } = useParams();
  const author = slug ? getAuthorBySlug(slug) : undefined;

  if (!author) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">Author Not Found</h1>
          <Link to="/blogs" className="mt-4 inline-block text-primary hover:underline">← Back to Blog</Link>
        </div>
      </Layout>
    );
  }

  const authorPosts = blogPosts.filter(
    (p) => getPostAuthor(p.slug, p.category).slug === author.slug
  );

  return (
    <Layout>
      <Helmet>
        <title>{author.name} – Pain Specialist Blog</title>
        <meta
          name="description"
          content={`${author.name} (${author.credentialsDisplay}) – ${author.jobTitle} at Painex Clinic, Pune. Read expert articles on pain management.`}
        />
        <link rel="canonical" href={`https://www.painspecialist.blog/authors/${author.slug}`} />
        <meta property="og:title" content={`${author.name} – Pain Specialist in Pune`} />
        <meta property="og:description" content={author.bio} />
        <meta property="og:url" content={`https://www.painspecialist.blog/authors/${author.slug}`} />
        <meta property="og:image" content={`https://www.painspecialist.blog${author.photo}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${author.name} – Pain Specialist in Pune`} />
        <meta name="twitter:description" content={author.bio} />
        <meta property="og:type" content="profile" />
        <script type="application/ld+json">
          {JSON.stringify(getPersonJsonLd(author))}
        </script>
      </Helmet>

      {/* Breadcrumb */}
      <div className="border-b border-border bg-card">
        <div className="container px-4 md:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-xs md:text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors shrink-0">Home</Link>
            <ChevronRight size={10} className="shrink-0 text-muted-foreground/40" />
            <span className="text-foreground truncate">{author.name}</span>
          </nav>
        </div>
      </div>

      {/* Profile Section */}
      <section className="py-10 md:py-14">
        <div className="container px-4 md:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 md:gap-6">
              {/* Avatar */}
              <img src={author.photo} alt={author.name} className="h-24 w-24 shrink-0 rounded-full object-cover object-top ring-4 ring-primary/20" width={96} height={96} />
              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                  {author.name}
                </h1>
                <div className="mt-2">
                  <CredentialsBadge degrees={author.degrees} className="text-sm" />
                </div>
                <p className="mt-1 text-sm text-primary font-medium">
                  {author.jobTitle}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {author.worksFor}
                </p>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-6 rounded-xl border border-border bg-card p-5 md:p-6">
              <p className="text-sm text-foreground/80 leading-[1.8]">
                {author.bio}
              </p>
            </div>

            {/* Fellowship badges */}
            <div className="mt-4 flex flex-wrap gap-2">
              {author.degrees
                .filter((d) => d === "FIPM" || d === "FIAPM")
                .map((d) => (
                  <span
                    key={d}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"
                  >
                    ✓ {d} Certified
                  </span>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Articles by this doctor */}
      <section className="border-t border-border bg-secondary/20 py-10 md:py-14">
        <div className="container px-4 md:px-8">
          <h2 className="text-xl font-bold text-foreground md:text-2xl mb-6">
            Articles by {author.name} ({authorPosts.length})
          </h2>
          {authorPosts.length > 0 ? (
            <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {authorPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Articles coming soon.</p>
          )}
        </div>
      </section>

      <CTABanner />
    </Layout>
  );
};

export default AuthorProfile;
