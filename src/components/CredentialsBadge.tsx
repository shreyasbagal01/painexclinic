import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { degreeTooltips } from "@/data/authorData";

interface CredentialsBadgeProps {
  degrees: string[];
  className?: string;
}

const CredentialsBadge = ({ degrees, className = "" }: CredentialsBadgeProps) => (
  <span className={`inline-flex flex-wrap items-center gap-1 text-xs text-muted-foreground ${className}`}>
    {degrees.map((deg, i) => (
      <span key={deg} className="inline-flex items-center">
        {i > 0 && <span className="mx-0.5 text-border">|</span>}
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-help border-b border-dotted border-muted-foreground/40 hover:text-primary transition-colors">
              {deg}
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <p className="text-xs">{degreeTooltips[deg] || deg}</p>
          </TooltipContent>
        </Tooltip>
      </span>
    ))}
  </span>
);

export default CredentialsBadge;
