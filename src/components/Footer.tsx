import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { authors } from "@/data/authorData";

const Footer = () => (
  <footer className="border-t border-border bg-card">
    <div className="container px-4 md:px-8 py-10 md:py-12">
      <div className="grid gap-8 md:gap-10 grid-cols-2 md:grid-cols-5">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="inline-block">
            <img src={logo} alt="The Painex Clinic" className="h-9 md:h-10 w-auto" width={136} height={40} />
          </Link>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Trusted pain management insights for patients in Pune. Written by fellowship-certified specialists.
          </p>
        </div>

        {/* Topics */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-3 md:mb-4">Topics</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/category/migraine" className="hover:text-primary transition-colors">Migraine & Headache</Link></li>
            <li><Link to="/category/back-pain" className="hover:text-primary transition-colors">Back Pain</Link></li>
            <li><Link to="/category/sciatica" className="hover:text-primary transition-colors">Sciatica</Link></li>
            <li><Link to="/category/neck-pain" className="hover:text-primary transition-colors">Neck Pain</Link></li>
            <li><Link to="/category/knee-pain" className="hover:text-primary transition-colors">Knee Pain</Link></li>
          </ul>
        </div>

        {/* More Topics */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-3 md:mb-4">More Topics</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/category/shoulder-pain" className="hover:text-primary transition-colors">Shoulder Pain</Link></li>
            <li><Link to="/category/nerve-pain" className="hover:text-primary transition-colors">Nerve Pain</Link></li>
            <li><Link to="/category/heel-pain" className="hover:text-primary transition-colors">Heel Pain</Link></li>
            <li><Link to="/blogs" className="hover:text-primary transition-colors">All Articles</Link></li>
            <li><Link to="/conditions" className="hover:text-primary transition-colors">Conditions We Treat</Link></li>
          </ul>
        </div>

        {/* Our Doctors */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-3 md:mb-4">Our Doctors</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {authors.map((a) => (
              <li key={a.slug}>
                <Link to={`/authors/${a.slug}`} className="hover:text-primary transition-colors">
                  {a.shortName}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Clinic */}
        <div className="col-span-2 md:col-span-1">
          <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-3 md:mb-4">Clinic</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a href="https://www.painex.org" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                Painex Clinic
              </a>
            </li>
            <li>
              <a href="https://www.headacheandmigraineclinic.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                Headache & Migraine Clinic
              </a>
            </li>
            <li>
              <a
                href="https://www.painex.org/book-an-appointment/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center mt-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 active:bg-primary/80 transition-colors"
              >
                Book Appointment
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-8 md:mt-10 border-t border-border pt-5 md:pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground text-center md:text-left">
        <p>© {new Date().getFullYear()} painspecialist.blog — Pain Specialist in Pune</p>
        <p>This blog provides general health information. Always consult a qualified specialist.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
