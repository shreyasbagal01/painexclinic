import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import type { BlogPost } from "@/data/blogData";
import { blogPostImages } from "@/data/blogPostImages";
import { categoryImages } from "@/data/categoryImages";
import { getPostAuthor } from "@/data/authorData";

const BlogCard = ({ post }: { post: BlogPost }) => {
  const heroImage = blogPostImages[post.slug] || categoryImages[post.category];
  const author = getPostAuthor(post.slug, post.category);

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.99]"
    >
      <div className="aspect-[16/9] overflow-hidden bg-accent">
        {heroImage ? (
          <img
            src={heroImage}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
            width={606}
            height={341}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-accent">
            <span className="text-3xl text-muted-foreground/30">📝</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4 md:p-5">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
            {post.category.replace("-", " ")}
          </span>
        </div>
        <h3 className="mt-2 line-clamp-2 text-[15px] md:text-base font-bold leading-snug text-foreground group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground leading-relaxed flex-1">
          {post.excerpt}
        </p>
        {/* Author line */}
        <div className="mt-2 flex items-center gap-2">
          <img src={author.photo} alt={author.name} className="h-5 w-5 rounded-full object-cover object-top" width={20} height={20} loading="lazy" />
          <span className="text-xs text-muted-foreground truncate">{author.shortName}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3">
          <span>
            {new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} /> {post.readTime}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
