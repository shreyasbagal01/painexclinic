import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { Author } from "@/data/authorData";
import CredentialsBadge from "./CredentialsBadge";

interface AuthorCardProps {
  author: Author;
  reviewDate: string;
}

const AuthorCard = ({ author, reviewDate }: AuthorCardProps) => {
  const formattedDate = new Date(reviewDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="rounded-xl border border-border bg-card p-5 md:p-6">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-4">About the Author</p>
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <Link
          to={`/authors/${author.slug}`}
          className="h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/20 hover:ring-primary transition-all"
        >
          <img src={author.photo} alt={author.name} className="h-full w-full object-cover object-top" width={56} height={56} loading="lazy" />
        </Link>
        <div className="flex-1 min-w-0">
          <Link
            to={`/authors/${author.slug}`}
            className="text-base font-bold text-foreground hover:text-primary transition-colors"
          >
            {author.name}
          </Link>
          <div className="mt-1">
            <CredentialsBadge degrees={author.degrees} />
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {author.jobTitle}, Pune
          </p>
          <p className="mt-2 text-sm text-muted-foreground/80 leading-relaxed line-clamp-2">
            {author.bio}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
            <span className="text-muted-foreground">
              Medically reviewed on {formattedDate}
            </span>
            <Link
              to={`/authors/${author.slug}`}
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
            >
              View all articles by {author.shortName} <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorCard;
