import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import logo from "@/assets/logo.png";

const mainNav = [
  { label: "Home", path: "/" },
  { label: "Conditions", path: "/conditions" },
  { label: "Blog", path: "/blogs" },
];

const categoryLinks = [
  { label: "Migraine & Headache", path: "/category/migraine" },
  { label: "Back Pain", path: "/category/back-pain" },
  { label: "Sciatica", path: "/category/sciatica" },
  { label: "Neck Pain", path: "/category/neck-pain" },
  { label: "Knee Pain", path: "/category/knee-pain" },
  { label: "Shoulder Pain", path: "/category/shoulder-pain" },
  { label: "Nerve Pain", path: "/category/nerve-pain" },
  { label: "Facial Pain", path: "/category/facial-pain" },
  { label: "Heel Pain", path: "/category/heel-pain" },
  { label: "General Pain", path: "/category/general-pain" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isActive = (path: string) => location.pathname === path;
  const isCategoryActive = categoryLinks.some((c) => location.pathname === c.path);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container flex h-14 md:h-16 items-center justify-between px-4 md:px-8">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="The Painex Clinic" className="h-8 md:h-10 w-auto" width={136} height={40} />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {mainNav.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                  isActive(item.path) ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Categories Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                  isCategoryActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                }`}
              >
                Topics <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {dropdownOpen && (
                <div className="absolute left-0 top-full mt-1 w-56 rounded-xl border border-border bg-card p-2 shadow-lg">
                  {categoryLinks.map((cat) => (
                    <Link
                      key={cat.path}
                      to={cat.path}
                      className={`block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent ${
                        isActive(cat.path) ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground"
                      }`}
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <a
            href="https://www.painex.org/book-an-appointment/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 lg:block"
          >
            Book Appointment
          </a>

          <button
            className="flex items-center justify-center rounded-md p-2 text-foreground lg:hidden active:bg-accent"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu — full-screen overlay (outside header to avoid backdrop-filter containing block) */}
      {mobileOpen && (
        <div className="fixed inset-0 top-14 z-40 bg-card lg:hidden overflow-y-auto">
          <div className="px-4 pb-6 pt-3">
            {mainNav.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center rounded-xl px-4 py-3.5 text-base font-medium transition-colors active:bg-accent ${
                  isActive(item.path) ? "bg-accent text-accent-foreground" : "text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="my-3 border-t border-border" />
            <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Topics</p>
            <div className="grid grid-cols-2 gap-1.5">
              {categoryLinks.map((cat) => (
                <Link
                  key={cat.path}
                  to={cat.path}
                  className={`flex items-center rounded-xl px-4 py-3 text-sm transition-colors active:bg-accent ${
                    isActive(cat.path) ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground"
                  }`}
                >
                  {cat.label}
                </Link>
              ))}
            </div>
            <div className="my-3 border-t border-border" />
            <a
              href="https://www.painex.org/book-an-appointment/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-xl bg-primary px-4 py-3.5 text-base font-semibold text-primary-foreground active:bg-primary/90"
            >
              Book Appointment
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;