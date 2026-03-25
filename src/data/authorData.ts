export interface Author {
  slug: string;
  name: string;
  shortName: string;
  degrees: string[];
  credentialsDisplay: string;
  jobTitle: string;
  worksFor: string;
  bio: string;
  initials: string;
  photo: string;
  affiliations?: { type: string; name: string }[];
}

export const degreeTooltips: Record<string, string> = {
  MBBS: "Bachelor of Medicine and Bachelor of Surgery",
  MD: "Doctor of Medicine",
  DNB: "Diplomate of National Board",
  FIPM: "Fellow of Indian Pain Medicine (Indian Society for Study of Pain)",
  FIAPM: "Fellow of Indian Academy of Pain Medicine",
};

export const authors: Author[] = [
  {
    slug: "dr-kashinath-bangar",
    name: "Dr. Kashinath Bangar",
    shortName: "Dr. K. Bangar",
    degrees: ["MBBS", "DNB", "FIPM", "FIAPM"],
    credentialsDisplay: "MBBS | DNB | FIPM | FIAPM",
    jobTitle: "Founder & Director",
    worksFor: "Painex Pain Management Clinic, Pune",
    bio: "Dr. Kashinath Bangar is the Founder & Director of Painex Pain Management Clinic, Pune. He is a fellowship-certified pain management specialist (FIPM, FIAPM) and Honorary Consultant at Ruby Hall Clinic, Sahyadri Hospital, Joshi Hospital, Ratna Memorial Hospital, and MJM Hospital, Pune. A National GC Member of the Indian Academy of Pain Medicine (IAPM), he has completed his Fellowship in Pain & Palliative Care from Kolkata and is a published author in national and international pain journals. He specialises in interventional pain procedures including radiofrequency ablation, nerve blocks, and epidural injections.",
    initials: "KB",
    photo: "/images/doctors/dr-kashinath-bangar.jpg",
    affiliations: [
      { type: "Hospital", name: "Ruby Hall Clinic, Pune" },
      { type: "Hospital", name: "Sahyadri Hospital, Pune" },
      { type: "Hospital", name: "Joshi Hospital, Pune" },
      { type: "Hospital", name: "Ratna Memorial Hospital, Pune" },
      { type: "Hospital", name: "MJM Hospital, Pune" },
    ],
  },
  {
    slug: "dr-nivedita-page",
    name: "Dr. Nivedita Page",
    shortName: "Dr. N. Page",
    degrees: ["MBBS", "MD", "FIPM", "FIAPM"],
    credentialsDisplay: "MBBS | MD | FIPM | FIAPM",
    jobTitle: "Director",
    worksFor: "Painex Pain Management Clinic, Pune",
    bio: "Dr. Nivedita Page holds an MD in Anaesthesiology from BJ Medical College, Pune, and a super-specialization in Chronic Pain & Palliative Care from MUHS, Nashik. She has received international training in Perth, Western Australia, and serves as Faculty for the MUHS Fellowship Program in Pain Management. A published author in national and international journals, she is a member of IMA, ISSP, IASP, and ISA. Her dual fellowship certifications (FIPM, FIAPM) ensure she stays at the forefront of evidence-based pain management advances.",
    initials: "NP",
    photo: "/images/doctors/dr-nivedita-page.jpg",
    affiliations: [
      { type: "Hospital", name: "Jupiter Hospital, Baner, Pune" },
      { type: "Hospital", name: "Sahyadri Hospital, Deccan, Pune" },
      { type: "Hospital", name: "Joshi Hospital, Bhandarkar Road, Pune" },
    ],
  },
  {
    slug: "dr-gayatri-bangar",
    name: "Dr. Gayatri Bangar",
    shortName: "Dr. G. Bangar",
    degrees: ["MBBS", "DNB", "FIPM", "FIAPM"],
    credentialsDisplay: "MBBS | DNB | FIPM | FIAPM",
    jobTitle: "Pain Management Specialist",
    worksFor: "Painex Pain Management Clinic, Pune",
    bio: "Dr. Gayatri Bangar is a fellowship-certified pain management specialist with expertise in musculoskeletal pain conditions including knee pain, shoulder pain, and heel pain. She combines her DNB training with dual pain medicine fellowships (FIPM, FIAPM) to deliver comprehensive, patient-centred care. At Painex Clinic in Pune, she focuses on regenerative treatments, joint injections, and guided rehabilitation programmes that help patients avoid surgery and return to active living.",
    initials: "GB",
    photo: "/images/doctors/dr-gayatri-bangar.jpg",
    affiliations: [],
  },
];

// Category → Author mapping
const categoryAuthorMap: Record<string, string> = {
  migraine: "dr-kashinath-bangar",
  "back-pain": "dr-nivedita-page",
  sciatica: "dr-kashinath-bangar",
  "neck-pain": "dr-nivedita-page",
  "knee-pain": "dr-gayatri-bangar",
  "shoulder-pain": "dr-gayatri-bangar",
  "nerve-pain": "dr-kashinath-bangar",
  "facial-pain": "dr-kashinath-bangar",
  "heel-pain": "dr-gayatri-bangar",
  "general-pain": "dr-kashinath-bangar",
};

// Some general-pain posts assigned to different authors for distribution
const generalPainAuthorOverrides: Record<string, string> = {
  "what-does-pain-specialist-do": "dr-nivedita-page",
  "chronic-pain-causes-modern-treatment": "dr-nivedita-page",
  "best-treatment-options-chronic-pain": "dr-gayatri-bangar",
  "non-surgical-pain-treatments-explained": "dr-gayatri-bangar",
  "how-to-manage-chronic-pain-daily": "dr-nivedita-page",
  "pain-management-without-surgery-pune": "dr-gayatri-bangar",
};

export const getPostAuthor = (slug: string, category: string): Author => {
  const authorSlug =
    generalPainAuthorOverrides[slug] ||
    categoryAuthorMap[category] ||
    "dr-kashinath-bangar";
  return authors.find((a) => a.slug === authorSlug) || authors[0];
};

export const getAuthorBySlug = (slug: string): Author | undefined =>
  authors.find((a) => a.slug === slug);

export const getPersonJsonLd = (author: Author) => {
  const base: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    jobTitle: author.jobTitle,
    worksFor: {
      "@type": "MedicalBusiness",
      name: "Painex Pain Management Clinic",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Apte Road, Deccan Gymkhana",
        addressLocality: "Pune",
        addressRegion: "Maharashtra",
        postalCode: "411004",
        addressCountry: "IN",
      },
    },
    url: `https://www.painspecialist.blog/authors/${author.slug}`,
    description: author.bio,
    hasCredential: author.degrees.map((deg) => ({
      "@type": "EducationalOccupationalCredential",
      credentialCategory: deg,
      name: degreeTooltips[deg] || deg,
    })),
  };

  if (author.affiliations && author.affiliations.length > 0) {
    base.affiliation = author.affiliations.map((a) => ({
      "@type": a.type,
      name: a.name,
    }));
  }

  return base;
};
