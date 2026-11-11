import connectDB from "@/lib/mongodb";
import WebsiteSettings, { IWebsiteSettings } from "@/models/WebsiteSettings";
import Service, { IService, ServiceCategory } from "@/models/Service";
import Product, { IProduct } from "@/models/Product";
import CaseStudy, { ICaseStudy } from "@/models/CaseStudy";
import Article, { IArticle } from "@/models/Article";
import Testimonial, { ITestimonial } from "@/models/Testimonial";

/**
 * Helper to deeply serialize Mongoose documents into plain JSON objects
 * with _id and Date objects converted to strings.
 */
function serialize<T>(data: any): T {
  return JSON.parse(JSON.stringify(data));
}

/**
 * Fallback corporate settings if database has not been seeded yet.
 */
export const fallbackSettings: Partial<IWebsiteSettings> = {
  companyName: "Ariiti Tech",
  tagline: "Technology Solutions That Help Your Business Grow.",
  primaryPhone: "+251915000000",
  secondaryPhone: "+251920000000",
  whatsappNumber: "251915000000",
  businessEmail: "contact@ariititech.com",
  officeLocations: [
    "Harar, Eastern Ethiopia",
    "Dire Dawa, Eastern Ethiopia",
  ],
  socialLinks: {
    telegram: "https://t.me/aritiiteck",
    linkedin: "https://linkedin.com/company/ariiti-tech",
    facebook: "https://www.facebook.com/profile.php?id=61596506150647",
    github: "https://github.com/AriitiTech",
  },
  announcementBanner: {
    isActive: true,
    text: "Delivering enterprise software development, business networks, and IT infrastructure across Harar & Dire Dawa.",
    linkUrl: "/services",
  },
};

/**
 * Fetches the global corporate website settings or returns regional defaults.
 */
export async function getWebsiteSettings(): Promise<IWebsiteSettings> {
  try {
    await connectDB();
    const doc = await WebsiteSettings.findOne().lean();
    if (!doc) {
      return fallbackSettings as IWebsiteSettings;
    }
    return serialize<IWebsiteSettings>(doc);
  } catch (error) {
    console.warn("[QUERY ERROR] getWebsiteSettings failed, using fallback:", error);
    return fallbackSettings as IWebsiteSettings;
  }
}

/**
 * Fetches all active corporate services, optionally filtered by category.
 */
export async function getActiveServices(
  category?: string
): Promise<IService[]> {
  try {
    await connectDB();
    const filter: Record<string, any> = { isActive: true };

    if (category && category !== "ALL") {
      filter.category = category;
    }

    const docs = await Service.find(filter)
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    return serialize<IService[]>(docs);
  } catch (error) {
    console.error("[QUERY ERROR] getActiveServices failed:", error);
    return [];
  }
}

/**
 * Fetches a single active service by its URL slug.
 */
export async function getServiceBySlug(
  slug: string
): Promise<IService | null> {
  try {
    await connectDB();
    const doc = await Service.findOne({
      slug: slug.toLowerCase().trim(),
      isActive: true,
    }).lean();

    if (!doc) return null;
    return serialize<IService>(doc);
  } catch (error) {
    console.error("[QUERY ERROR] getServiceBySlug failed:", error);
    return null;
  }
}

/**
 * Fetches published software products from the Ariiti digital ecosystem.
 */
export async function getPublishedProducts(
  featuredOnly = false
): Promise<IProduct[]> {
  try {
    await connectDB();
    const filter: Record<string, any> = { isPublished: true };

    if (featuredOnly) {
      filter.isFeatured = true;
    }

    const docs = await Product.find(filter)
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    return serialize<IProduct[]>(docs);
  } catch (error) {
    console.error("[QUERY ERROR] getPublishedProducts failed:", error);
    return [];
  }
}

/**
 * Fetches published B2B case studies and deployments, strictly enforcing
 * NDA confidentiality masking for public visitors.
 */
export async function getPublishedCaseStudies(options?: {
  category?: string;
  featuredOnly?: boolean;
}): Promise<ICaseStudy[]> {
  try {
    await connectDB();
    const filter: Record<string, any> = { publicationStatus: "PUBLISHED" };

    if (options?.category && options.category !== "ALL") {
      filter.category = options.category;
    }

    if (options?.featuredOnly) {
      filter.isFeatured = true;
    }

    const docs = await CaseStudy.find(filter)
      .sort({ displayOrder: 1, completedAt: -1, createdAt: -1 })
      .lean();

    const sanitized = docs.map((doc: any) => {
      if (doc.isClientConfidential) {
        doc.clientName = `Confidential ${doc.clientSector} Client`;
      }
      return doc;
    });

    return serialize<ICaseStudy[]>(sanitized);
  } catch (error) {
    console.error("[QUERY ERROR] getPublishedCaseStudies failed:", error);
    return [];
  }
}

/**
 * Fetches a single published case study by slug with NDA protection.
 */
export async function getCaseStudyBySlug(
  slug: string
): Promise<ICaseStudy | null> {
  try {
    await connectDB();
    const doc = await CaseStudy.findOne({
      slug: slug.toLowerCase().trim(),
      publicationStatus: "PUBLISHED",
    }).lean();

    if (!doc) return null;

    const copy: any = { ...doc };
    if (copy.isClientConfidential) {
      copy.clientName = `Confidential ${copy.clientSector} Client`;
    }

    return serialize<ICaseStudy>(copy);
  } catch (error) {
    console.error("[QUERY ERROR] getCaseStudyBySlug failed:", error);
    return null;
  }
}

const DEFAULT_ARTICLES: Partial<IArticle>[] = [
  {
    title: "Engineering Offline-Resilient POS Architecture for Eastern Ethiopia",
    slug: "engineering-offline-resilient-pos-architecture",
    excerpt: "How local-first IndexedDB caching and cryptographic batch synchronization eliminate checkout delays during telecom fiber disruptions in Harar and Dire Dawa.",
    content: `## The Reality of Regional Telecom Disruptions

Operating commercial retail or hospitality establishments in Eastern Ethiopia presents a unique engineering challenge: unpredictable internet connectivity and power fluctuations. Conventional cloud-based POS platforms freeze or report network timeout errors when Ethio Telecom backbones experience fiber cuts.

### The Hybrid Offline-First Architecture

To overcome this, Ariiti Tech engineered a local-first browser client architecture. Rather than requiring continuous websocket connections to a remote server, every sales transaction is immediately verified and committed locally to indexed client storage.

\`\`\`
[ Barcode Scanner / Touch Screen ]
                │
                ▼
      [ Local Transaction Engine ] ──► [ ESC/POS Thermal Receipt Printer ] (<1.2s)
                │
                ▼
      [ IndexedDB Local Cache ]
                │ (Background Worker)
                ▼
[ Central Cloud Database Sync on Link Recovery ]
\`\`\`

### Key Outcomes

1. **Zero-Latency Ringing**: Cashiers complete customer checkout with 0ms delay.
2. **Immediate Receipt Issuance**: Receipts print instantly via ESC/POS protocol.
3. **No Duplicate Transactions**: Cryptographic timestamps ensure seamless conflict resolution.
`,
    category: "TECHNICAL_INSIGHT",
    author: {
      name: "Ariiti Engineering Team",
      role: "Systems Architecture Division",
    },
    readTime: "4 min read",
    isPublished: true,
    publishedAt: new Date("2026-03-01"),
    coverImageUrl: "https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Why Cat6 Structured Cabling Outperforms Mesh Wi-Fi in Commercial Buildings",
    slug: "cat6-structured-cabling-vs-mesh-wifi",
    excerpt: "Why thick reinforced concrete walls in multi-floor hotels and commercial complexes require certified copper drops and PoE ceiling access points over wireless repeaters.",
    content: `## The Physical Physics of Commercial Wireless

In regional commercial construction across Harar and Dire Dawa, heavy reinforced concrete and solid masonry walls are standard. When businesses attempt to deploy consumer mesh Wi-Fi pods, radio frequency signals attenuate rapidly.

### Why Certified Cat6 Solid Copper Is Critical

1. **Dedicated Bandwidth**: Every access point receives a dedicated 1Gbps/10Gbps copper link back to the central server rack switch.
2. **Power over Ethernet (PoE+)**: Access points receive power and data over a single cable, eliminating messy wall power bricks.
3. **Fluke-Tested Cable Runs**: Every drop is certified for near-end crosstalk (NEXT) and return loss standards.

\`\`\`
[ Central 12U/24U Server Rack ]
                │ (Cat6 Solid Copper Trunk)
    ┌───────────┼───────────┐
    ▼           ▼           ▼
[ Floor 1 AP ] [ Floor 2 AP ] [ Floor 3 AP ]
\`\`\`
`,
    category: "GUIDE",
    author: {
      name: "Ariiti Network Engineering",
      role: "Infrastructure Division",
    },
    readTime: "5 min read",
    isPublished: true,
    publishedAt: new Date("2026-02-18"),
    coverImageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Announcing Guaranteed 2-Hour Emergency On-Site SLA in Harar & Dire Dawa",
    slug: "announcing-2-hour-emergency-sla",
    excerpt: "Ariiti Tech activates rapid-response IT maintenance contracts with dedicated resident field engineers stationed directly in Harar and Dire Dawa commercial corridors.",
    content: `## Bridging the Regional SLA Gap

Remote software agencies located in Addis Ababa or overseas often take days to respond to physical equipment crashes or severed network lines in regional commercial hubs.

Ariiti Tech has officially launched contractual **2-Hour Emergency On-Site SLAs** for contracted commercial enterprises:

- **Resident Field Teams**: Full-time hardware technicians stationed permanently in Kebele 14 (Harar) and Kezira (Dire Dawa).
- **On-Premise Spares**: Thermal receipt printers, MikroTik routers, Cat6 spools, and surge suppressors kept in local stock for rapid swap-outs.
- **Automated Backup Verifications**: Daily encrypted local NAS and cloud backup audits.
`,
    category: "ANNOUNCEMENT",
    author: {
      name: "Ariiti Operations Desk",
      role: "Regional SLA Coordinator",
    },
    readTime: "3 min read",
    isPublished: true,
    publishedAt: new Date("2026-02-10"),
    coverImageUrl: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1200&q=80",
  },
];

/**
 * Fetches published blog articles and technical news.
 */
export async function getPublishedArticles(): Promise<IArticle[]> {
  try {
    await connectDB();
    const docs = await Article.find({ isPublished: true })
      .sort({ publishedAt: -1, createdAt: -1 })
      .lean();

    if (!docs || docs.length === 0) {
      return serialize<IArticle[]>(DEFAULT_ARTICLES);
    }

    return serialize<IArticle[]>(docs);
  } catch (error) {
    console.warn("[QUERY ERROR] getPublishedArticles failed, returning defaults:", error);
    return serialize<IArticle[]>(DEFAULT_ARTICLES);
  }
}

/**
 * Fetches a single published article by slug.
 */
export async function getArticleBySlug(slug: string): Promise<IArticle | null> {
  try {
    await connectDB();
    const doc = await Article.findOne({
      slug: slug.toLowerCase().trim(),
      isPublished: true,
    }).lean();

    if (doc) {
      return serialize<IArticle>(doc);
    }

    const fallback = DEFAULT_ARTICLES.find(
      (a) => a.slug === slug.toLowerCase().trim()
    );
    return fallback ? serialize<IArticle>(fallback) : null;
  } catch (error) {
    console.warn("[QUERY ERROR] getArticleBySlug failed:", error);
    const fallback = DEFAULT_ARTICLES.find(
      (a) => a.slug === slug.toLowerCase().trim()
    );
    return fallback ? serialize<IArticle>(fallback) : null;
  }
}

export const DEFAULT_TESTIMONIALS: Partial<ITestimonial>[] = [
  {
    quote:
      "When Ethio Telecom's fiber cut happened during peak evening checkout hours, our old system froze completely. Ariiti's offline POS never missed a single receipt. All 3 cashier terminals kept billing without a glitch, and everything synchronized automatically when the connection was restored.",
    clientType: "Commercial Supermarket & Retailer",
    clientName: "General Operations Director",
    location: "Harar Commercial Corridor",
    deploymentSummary: "Offline-First Ariiti POS + 3 Cashier Touch Terminals",
    verifiedTag: "Verified Commercial Deployment",
    rating: 5,
    isPublished: true,
    displayOrder: 1,
  },
  {
    quote:
      "We had persistent Wi-Fi dead spots across 3 floors and guest complaints every weekend. Ariiti Tech replaced the tangled wiring with certified Cat6 copper drops, a clean 12U server rack, and MikroTik VLAN routing. Our guest Wi-Fi and front-desk billing are now completely isolated and rock-solid.",
    clientType: "Hospitality & Commercial Complex",
    clientName: "Hotel General Manager",
    location: "Dire Dawa Commercial District",
    deploymentSummary: "Turnkey Cat6 Structured LAN & Dual-WAN Failover",
    verifiedTag: "Verified Infrastructure Deployment",
    rating: 5,
    isPublished: true,
    displayOrder: 2,
  },
  {
    quote:
      "Having full-time technical engineers stationed locally in Harar makes all the difference. When our main reception printer failed on a Saturday morning, their field technician was on-premise within 45 minutes with a spare replacement unit. The 2-hour SLA is real.",
    clientType: "Private Medical Diagnostic Clinic",
    clientName: "Clinical Director",
    location: "Harar, Eastern Ethiopia",
    deploymentSummary: "Preventive IT Maintenance Agreement & Emergency SLA",
    verifiedTag: "Verified SLA Maintenance Contract",
    rating: 5,
    isPublished: true,
    displayOrder: 3,
  },
];

/**
 * Fetches published client testimonials from the database or fallbacks.
 */
export async function getPublishedTestimonials(): Promise<ITestimonial[]> {
  try {
    await connectDB();
    const docs = await Testimonial.find({ isPublished: true })
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    if (!docs || docs.length === 0) {
      return serialize<ITestimonial[]>(DEFAULT_TESTIMONIALS);
    }

    return serialize<ITestimonial[]>(docs);
  } catch (error) {
    console.warn("[QUERY ERROR] getPublishedTestimonials failed, using defaults:", error);
    return serialize<ITestimonial[]>(DEFAULT_TESTIMONIALS);
  }
}

