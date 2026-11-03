// Single source of content for the site. Every string here is taken from
// "Mrunali-Resume 2.pdf" (text + embedded hyperlinks). Counts in ACHIEVEMENTS
// are tallies of items listed in that résumé, not external metrics.

export type Profile = {
  name: string;
  firstName: string;
  initials: string;
  role: string;
  email: string;
  emailHandle: string;
  phone: string;
  phoneHref: string;
  location: string;
  resumeSummary: string;
  softSkills: string[];
  github: string | null;
  linkedin: string | null;
  resume: string;
  graduationYear: string;
};

export const PROFILE: Profile = {
  name: "Mrunali Prasade",
  firstName: "Mrunali",
  initials: "MP",
  role: "Computer Engineering Undergraduate",
  email: "mrunali.18269@sakec.ac.in",
  emailHandle: "18269",
  phone: "+91-9920922458",
  phoneHref: "tel:+919920922458",
  location: "Mumbai, Maharashtra, India",
  resumeSummary:
    "Computer Engineering undergraduate with strong academic performance and a solid foundation in problem-solving and analytical reasoning. Proven ability to complete technical assignments accurately within deadlines. Actively developing software engineering skills through projects, research exposure, and internships.",
  softSkills: [
    "Problem Solving",
    "Analytical Thinking",
    "Team Coordination",
    "Communication",
    "Time Management",
    "Leadership Qualities",
  ],
  github: null, // not present in the résumé
  linkedin: "http://www.linkedin.com/in/mrunali-rakesh-prasade",
  resume: "/Mrunali-Prasade-Resume.pdf",
  graduationYear: "2027",
};

export type NavItem = { id: string; label: string };

export const NAV: NavItem[] = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
];

export type Skill = { name: string; symbol: string };
export type SkillGroup = { family: string; skills: Skill[] };

// "Technical Skills" block, plus the technologies named under each project.
export const SKILL_GROUPS: SkillGroup[] = [
  {
    family: "Languages",
    skills: [
      { name: "Python", symbol: "Py" },
      { name: "Java", symbol: "Ja" },
      { name: "C", symbol: "C" },
      { name: "SQL", symbol: "Sq" },
    ],
  },
  {
    family: "Web",
    skills: [
      { name: "HTML", symbol: "Ht" },
      { name: "CSS", symbol: "Cs" },
      { name: "Django", symbol: "Dj" },
    ],
  },
  {
    family: "Databases",
    skills: [
      { name: "MySQL", symbol: "My" },
      { name: "SQLite", symbol: "Sl" },
    ],
  },
  {
    family: "Cloud",
    skills: [{ name: "AWS", symbol: "Aw" }],
  },
  {
    family: "Analytics",
    skills: [
      { name: "Excel", symbol: "Ex" },
      { name: "Power BI", symbol: "Pb" },
    ],
  },
  {
    family: "Tools",
    skills: [
      { name: "Git", symbol: "Gt" },
      { name: "GitHub", symbol: "Gh" },
      { name: "VS Code", symbol: "Vs" },
    ],
  },
  {
    family: "Platforms",
    skills: [
      { name: "Windows", symbol: "Wi" },
      { name: "Linux", symbol: "Li" },
      { name: "MacOS", symbol: "Mc" },
    ],
  },
  {
    family: "Concepts",
    skills: [
      { name: "DSA", symbol: "Ds" },
      { name: "OOP", symbol: "Oo" },
      { name: "DBMS", symbol: "Db" },
    ],
  },
];

export type Experience = {
  id: string;
  when: string;
  title: string;
  place: string;
  points: string[];
};

// The résumé lists no jobs or internships; these are its positions of
// responsibility. It gives no dates for them, so `when` names where they were held.
export const EXPERIENCE: Experience[] = [
  {
    id: "idea-lab",
    when: "At SAKEC",
    title: "General Co-Ordinator",
    place: "SAKEC AICTE IDEA LAB",
    points: [
      "Coordinated student-driven technical and research projects under the Idea lab.",
      "Acted as a liaison between faculty coordinators and student teams.",
      "Designed and executed all graphic content for Idea Lab including posters, banners, certificates, presentations, and social media creatives.",
    ],
  },
  {
    id: "placement-cell",
    when: "At SAKEC",
    title: "Internship Co-Ordinator",
    place: "Placement Cell",
    points: [
      "Acted as a point of contact for HR teams and company representatives.",
      "Maintained internship records, databases, and feedback reports.",
      "Handled complete graphics and creative work for Placement Cell including internship posters, announcements, company creatives, and event promotions.",
    ],
  },
];

export type Education = {
  id: string;
  when: string;
  title: string;
  place: string;
  detail?: string;
};

// Oldest first. Only the degree has dates/scores in the résumé.
export const EDUCATION: Education[] = [
  {
    id: "ssc",
    when: "SSC",
    title: "Secondary School Certificate (SSC)",
    place: "Convent Girls High School, Prabhadevi",
  },
  {
    id: "hsc",
    when: "HSC",
    title: "Higher Secondary Certificate (HSC)",
    place: "Shree Samarth Uccha Madhyamik Vidyalay, Pune",
  },
  {
    id: "btech",
    when: "2023 – 2027",
    title: "Bachelor of Technology in Computer Engineering",
    place: "Shah & Anchor Kutchhi Engineering College, Chembur",
    detail: "CGPA: 8.9 / 10",
  },
];

export type Project = {
  id: string;
  index: string;
  title: string;
  short: string;
  kicker: string;
  description: string;
  features: string[];
  tech: string[];
  github: string | null;
};

export const PROJECTS: Project[] = [
  {
    id: "food-waste",
    index: "01",
    title: "Food Waste Reduction Web Application",
    short: "Food Waste Reduction",
    kicker: "Web application",
    description:
      "Developed a Django-based web application to manage food listings and reduce food wastage.",
    features: [
      "Implemented user authentication, backend logic, and database models using Django.",
      "Designed responsive frontend interfaces for improved user interaction.",
    ],
    tech: ["Python", "Django", "HTML", "CSS", "SQLite"],
    github: null,
  },
  {
    id: "image-processing",
    index: "02",
    title: "Serverless Image Processing System (AWS)",
    short: "Serverless Image Processing",
    kicker: "Cloud",
    description: "Deployed a cloud-based application using EC2 instances and S3 storage.",
    features: [
      "Gained hands-on experience with cloud deployment, security policies, and scalability concepts.",
      "Technologies: AWS (EC2, S3, IAM).",
    ],
    tech: ["AWS"],
    github: null,
  },
  {
    id: "quiz",
    index: "03",
    title: "Quiz Application",
    short: "Quiz Application",
    kicker: "Desktop program",
    description:
      "Developed a Java-based quiz application with multiple-choice questions and result evaluation.",
    features: ["Implemented input handling, scoring logic, and program flow control."],
    tech: ["Java"],
    github: null,
  },
  {
    id: "myntra",
    index: "04",
    title: "Business Analyst Project – Myntra Analysis",
    short: "Myntra Analysis",
    kicker: "Business & data analysis",
    description:
      "Conducted business and data analysis on Myntra to study customer behavior, sales trends, and product performance.",
    features: [
      "Created dashboards and reports using Excel/Power BI to visualize key metrics and support decision-making.",
      "Generated insights and recommendations to improve customer experience, marketing strategies, and overall sales performance.",
    ],
    tech: ["Excel", "Power BI"],
    github: null,
  },
];

export type Certification = { title: string; issuer: string };

export const CERTIFICATIONS: Certification[] = [
  { title: "C Programming", issuer: "Cisco" },
  { title: "Networking Basics", issuer: "Cisco" },
  { title: "Introduction to IoT", issuer: "Cisco" },
  { title: "Enterprise Java Beans (EJB)", issuer: "Infosys Springboard" },
  { title: "User Interface Design", issuer: "Infosys Springboard" },
  { title: "Java", issuer: "IIT Bombay Spoken Tutorial" },
  { title: "C", issuer: "IIT Bombay Spoken Tutorial" },
  { title: "Python", issuer: "IIT Bombay Spoken Tutorial" },
];

export type Achievement = {
  id: string;
  icon: string; // a CONCEPT key in TechLogo
  value: number;
  decimals: number;
  suffix?: string;
  label: string;
  caption: string;
  detail: string;
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "cgpa",
    icon: "Degree",
    value: 8.9,
    decimals: 1,
    suffix: "/10",
    label: "CGPA",
    caption: "B.Tech, Computer Engineering",
    detail: "Shah & Anchor Kutchhi Engineering College",
  },
  {
    id: "projects",
    icon: "Projects",
    value: PROJECTS.length,
    decimals: 0,
    label: "Projects",
    caption: "Web, cloud, Java and analytics",
    detail: PROJECTS.map((p) => p.short).join(" · "),
  },
  {
    id: "certs",
    icon: "Certificate",
    value: CERTIFICATIONS.length,
    decimals: 0,
    label: "Certifications",
    caption: "Cisco · Infosys Springboard · IIT Bombay",
    detail: "C, Networking, IoT, EJB, UI Design, Java, Python",
  },
  {
    id: "roles",
    icon: "Leadership",
    value: EXPERIENCE.length,
    decimals: 0,
    label: "Coordinator roles",
    caption: "SAKEC AICTE IDEA LAB · Placement Cell",
    detail: "General Co-Ordinator and Internship Co-Ordinator",
  },
];

/** Projects that list a given skill in their tech. */
export const projectsUsing = (skill: string) =>
  PROJECTS.filter((p) => p.tech.includes(skill)).map((p) => p.title);
