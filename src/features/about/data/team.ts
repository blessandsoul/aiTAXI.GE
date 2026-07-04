export interface TeamMemberData {
  name: string;
  nameKa: string;
  role: { ka: string; en: string };
  bio: { ka: string; en: string };
  image: string;
  imagePosition?: string;
  accent: string;
  tags?: string[];
}

// Mirrors the team shown on the landing page (LandingTeam): two founders
// (Andro, Tornike) + Giorgi as Head of Sales (not a founder, his role string
// reflects that). Roles/bios are localized (ka/en); the /about page falls back
// to `en` for other locales.
export const team: TeamMemberData[] = [
  {
    name: "Andro Kasparovi",
    nameKa: "ანდრო კასპაროვი",
    role: { ka: "CEO · თანადამფუძნებელი", en: "CEO · Co-founder" },
    bio: {
      ka: "ვიზიონერი და ბიზნეს-სტრატეგი. აერთიანებს ტექნოლოგიებს, ხალხსა და იდეებს ერთ მთლიანობაში.",
      en: "Visionary and business strategist. Connects technology, people, and ideas into a unified whole.",
    },
    image: "/team/andro.jpg",
    accent: "from-pink-500 to-rose-500",
    tags: ["Strategy", "GTM", "AI Vision"],
  },
  {
    name: "Tornike Epitashvili",
    nameKa: "თორნიკე ეპიტაშვილი",
    role: { ka: "CTO · თანადამფუძნებელი", en: "CTO · Co-founder" },
    bio: {
      ka: "არქიტექტურა, შემუშავება და სკალირება. Full-stack ინჟინერი AI-ით გაძლიერებული.",
      en: "Architecture, development, and scaling. Full-stack engineer powered by AI.",
    },
    image: "/team/tornike.jpg",
    accent: "from-blue-500 to-cyan-500",
    tags: ["Full-stack", "AI Eng", "Scale"],
  },
  {
    name: "Giorgi Darbaiseli",
    nameKa: "გიორგი დარბაისელი",
    role: { ka: "გაყიდვების ხელმძღვანელი", en: "Head of Sales" },
    bio: {
      ka: "გაყიდვები, კლიენტთან მუშაობა და გარიგებების დახურვა. გადააქცევს საუბრებს კონტრაქტებად.",
      en: "Sales, client relationships, and closing deals. Turns conversations into contracts.",
    },
    image: "/team/giorgi.jpg",
    accent: "from-emerald-500 to-cyan-500",
    tags: ["Sales", "Closing", "Clients"],
  },
];
