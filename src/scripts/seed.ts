import dotenv from "dotenv";
import path from "path";

// Load .env.local first, fallback to .env
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectDB from "../lib/mongodb";
import WebsiteSettings from "../models/WebsiteSettings";
import Service from "../models/Service";
import Product from "../models/Product";
import CaseStudy from "../models/CaseStudy";
import Article from "../models/Article";
import Testimonial from "../models/Testimonial";
import User from "../models/User";

async function seedDatabase() {
  console.log("=================================================");
  console.log("   ARIITI TECH - ENHANCED DATABASE SEED SCRIPT   ");
  console.log("=================================================");
  console.log(`[INFO] Current Time: ${new Date().toISOString()}`);

  try {
    console.log("[1/5] Connecting to MongoDB instance...");
    await connectDB();
    console.log("[SUCCESS] Database connected successfully.");

    // --------------------------------------------------------------------------
    // 1. Website Settings (Idempotent: Upsert single global document)
    // --------------------------------------------------------------------------
    console.log("\n[2/5] Seeding Global Website Settings...");
    const existingSettings = await WebsiteSettings.findOne();

    const defaultSettings = {
      companyName: "Ariiti Tech",
      tagline: "Technology Solutions That Help Your Business Grow.",
      primaryPhone: "+251915000000",
      secondaryPhone: "+251920000000",
      whatsappNumber: "251915000000",
      businessEmail: "contact@ariititech.com",
      officeLocations: [
        "Harar Hub: Kebele 14, Commercial District, Harar, Ethiopia",
        "Dire Dawa Center: Kezira Commercial Corridor, Dire Dawa, Ethiopia",
      ],
      socialLinks: {
        telegram: "https://t.me/aritiiteck",
        linkedin: "https://linkedin.com/company/ariiti-tech",
        facebook: "https://www.facebook.com/profile.php?id=61596506150647",
        github: "https://github.com/AriitiTech",
      },
      announcementBanner: {
        isActive: true,
        text: "⚡ Enterprise SLA Support Active: 2-Hour Guaranteed Emergency On-Site Dispatch across Harar & Dire Dawa.",
        linkUrl: "/contact",
      },
    };

    if (!existingSettings) {
      await WebsiteSettings.create(defaultSettings);
      console.log("  [+] Created default WebsiteSettings document.");
    } else {
      await WebsiteSettings.updateOne({}, defaultSettings);
      console.log("  [=] Updated existing WebsiteSettings with latest configuration.");
    }

    // --------------------------------------------------------------------------
    // 2. Services (4 Official Corporate B2B Categories with Rich Scopes)
    // --------------------------------------------------------------------------
    console.log("\n[3/5] Seeding Corporate Services...");
    const servicesToSeed = [
      {
        title: "Custom Web & Mobile Software Development",
        slug: "custom-software-development",
        category: "SOFTWARE_DEVELOPMENT" as const,
        summary:
          "Bespoke enterprise web portals, mobile business applications, and automated workflow systems engineered for regional businesses with offline-first synchronization.",
        description:
          "Ariiti Tech engineers reliable, high-performance software systems tailored to the operational realities of Eastern Ethiopia. From multi-branch inventory tracking and offline-capable retail platforms to secure client portals, our software solutions streamline operations, reduce manual errors, and provide actionable real-time business intelligence.",
        problemsSolved: [
          "Manual pen-and-paper tracking causing stock discrepancies and revenue leaks",
          "Lack of multi-branch synchronization between Harar and Dire Dawa offices",
          "Inefficient paper-based invoicing and unorganized customer order workflows",
          "Fragile generic software that crashes during intermittent internet connectivity",
        ],
        targetCustomers:
          "Retail distributors, wholesale enterprises, hospitality chains, import/export traders, and regional SMEs.",
        whatsIncluded: [
          "Comprehensive systems architecture and requirements blueprinting",
          "Custom responsive web dashboard and role-based staff interfaces",
          "Offline-first sync engine designed for inconsistent internet environments",
          "Automated financial and inventory reporting with PDF/Excel export capabilities",
          "On-site staff training and 6 months of guaranteed technical warranty",
        ],
        iconName: "Code2",
        isActive: true,
        displayOrder: 1,
      },
      {
        title: "Commercial Networking & Structured Infrastructure",
        slug: "networking-it-infrastructure",
        category: "NETWORKING_INFRASTRUCTURE" as const,
        summary:
          "High-capacity structured Cat6/Cat6A cabling, enterprise MikroTik/UniFi routing, commercial Wi-Fi coverage, and secure rack setups.",
        description:
          "A business runs only as fast as its network backbone. We engineer certified structured cabling (Cat6/Cat6A), install organized server racks with patch panels, and configure enterprise-grade MikroTik and UniFi routers. Our installations guarantee high-density commercial Wi-Fi roaming, isolated staff/guest VLANs, and automated ISP failover configurations.",
        problemsSolved: [
          "Frequent Wi-Fi drops and dead zones in multi-story hotels, offices, and warehouses",
          "Tangled and unorganized cabling causing accidental disconnections and difficult troubleshooting",
          "Unauthorized bandwidth hogging and lack of traffic prioritization for mission-critical POS systems",
          "Network security risks due to lack of isolated guest and staff subnets",
        ],
        targetCustomers:
          "Hotels, corporate offices, educational institutions, healthcare clinics, and multi-tenant commercial facilities.",
        whatsIncluded: [
          "Physical site survey and RF signal propagation mapping",
          "Cat6 structured cabling with RJ45 crimping, labeling, and rack dressing",
          "Enterprise router configuration (VLANs, QoS bandwidth limits, dual-WAN failover)",
          "Commercial ceiling-mount Access Points (APs) with seamless roaming",
          "Wall-mount or floor server rack installation with UPS battery backup integration",
        ],
        iconName: "Network",
        isActive: true,
        displayOrder: 2,
      },
      {
        title: "POS Hardware & Commercial Equipment Integration",
        slug: "pos-hardware-equipment",
        category: "HARDWARE_EQUIPMENT" as const,
        summary:
          "Complete point-of-sale hardware integration including thermal receipt printers, laser barcode scanners, cash drawers, and touch terminals.",
        description:
          "Hardware and software must work in absolute harmony to prevent checkout bottlenecks. Ariiti Tech sources, installs, and configures rugged commercial-grade POS touch terminals, 80mm high-speed thermal printers, omnidirectional barcode scanners, and automated cash drawers with full driver integration and surge protection.",
        problemsSolved: [
          "Slow checkout lines caused by malfunctioning receipt printers or incompatible drivers",
          "Barcode scanners failing to read wrinkled or glossy product packaging labels",
          "Hardware burnout from erratic power fluctuations and lack of surge isolation",
          "Disjointed setups where software and peripheral hardware fail to communicate",
        ],
        targetCustomers:
          "Supermarkets, pharmacies, clothing boutiques, restaurants, cafes, and wholesale warehouses.",
        whatsIncluded: [
          "Commercial touch POS terminal with pre-installed operating environment",
          "High-speed 80mm thermal receipt printer (USB/LAN/Bluetooth)",
          "Omnidirectional 1D/2D QR & Barcode scanner calibration",
          "Heavy-duty steel automated RJ11 cash drawer integration",
          "Surge protection hardware and initial thermal paper roll starter bundle",
        ],
        iconName: "Cpu",
        isActive: true,
        displayOrder: 3,
      },
      {
        title: "Preventive IT Maintenance & Technical SLA Support",
        slug: "it-maintenance-support",
        category: "IT_MAINTENANCE_SUPPORT" as const,
        summary:
          "Scheduled proactive hardware maintenance, thermal dusting, OS optimization, automated off-site backups, and guaranteed 2-hour emergency on-site SLAs.",
        description:
          "Prevent downtime before it halts your business operations. Our corporate maintenance agreements include monthly hardware cleaning and thermal paste reapplication, security patch management, network speed auditing, automated local/cloud database backups, and prioritized 2-hour on-site emergency dispatch in Harar and Dire Dawa.",
        problemsSolved: [
          "Dust accumulation leading to thermal throttling, hardware shutdown, and component death",
          "Catastrophic data loss when an unmonitored hard drive fails without backups",
          "Workplace paralysis when a network crash leaves staff without technical assistance",
          "Accumulated malware, spyware, and background bloat slowing corporate workstations",
        ],
        targetCustomers:
          "Accountants, law firms, NGOs, private hospitals, retail stores, and commercial logistics firms.",
        whatsIncluded: [
          "Monthly on-site physical hardware inspection and compressor de-dusting",
          "Automated encrypted daily database backup validation (local NAS + cloud)",
          "Operating system optimization and commercial antivirus policy enforcement",
          "Guaranteed 2-to-4 hour emergency response SLA for critical system crashes",
          "Monthly IT health audit report with proactive equipment replacement recommendations",
        ],
        iconName: "ShieldCheck",
        isActive: true,
        displayOrder: 4,
      },
    ];

    for (const serviceData of servicesToSeed) {
      const exists = await Service.findOne({ slug: serviceData.slug });
      if (!exists) {
        await Service.create(serviceData);
        console.log(`  [+] Created Service: ${serviceData.title}`);
      } else {
        await Service.updateOne({ slug: serviceData.slug }, serviceData);
        console.log(`  [=] Synchronized Service: ${serviceData.title}`);
      }
    }

    // --------------------------------------------------------------------------
    // 3. Ariiti Software Products (Proprietary Tech Ecosystem)
    // --------------------------------------------------------------------------
    console.log("\n[4/5] Seeding Ariiti Product Ecosystem...");
    const productsToSeed = [
      {
        name: "Ariiti POS",
        slug: "ariiti-pos",
        tagline: "Ultra-fast, offline-resilient Point of Sale for retail and hospitality.",
        description:
          "Ariiti POS is engineered to solve the most pressing challenge of commerce in Eastern Ethiopia: unreliable internet connectivity. Built on a hybrid architecture, transactions continue seamlessly locally without delay, then synchronize automatically when connectivity restores. Complete with inventory stock tracking, multi-cashier shifts, and thermal receipt printing.",
        targetCustomers:
          "Supermarkets, retail shops, pharmacies, cafes, and multi-branch wholesale outlets.",
        mainFeatures: [
          "Offline-first billing: ring sales and print receipts even with zero internet",
          "Automated multi-device cloud synchronization upon connection restoration",
          "Granular cashier access controls, shift opening/closing reconciliation, and cash drawer auditing",
          "Direct integration with 80mm ESC/POS thermal printers and barcode scanners",
          "Real-time stock alerts for expiring goods and low-inventory threshold triggers",
        ],
        status: "TESTING" as const,
        accessOrDemoUrl: "https://pos.ariititech.com",
        logoUrl: "https://raw.githubusercontent.com/AriitiTech/.github/main/ariiti-logo.svg",
        screenshots: [],
        isFeatured: true,
        isPublished: true,
        displayOrder: 1,
      },
      {
        name: "Ariiti Service Desk",
        slug: "ariiti-service-desk",
        tagline: "Internal ticket dispatch and asset tracking for regional maintenance teams.",
        description:
          "Designed for businesses managing field technicians, IT service operations, and client equipment warranties. Ariiti Service Desk organizes incoming service requests, tracks hardware serial numbers and repair histories, and notifies customers via automated SMS/Telegram updates.",
        targetCustomers:
          "Equipment vendors, IT service providers, property managers, and field maintenance teams.",
        mainFeatures: [
          "Centralized ticket dispatching with custom priority levels and technician assignment",
          "Hardware serial number and warranty repair history repository",
          "Automated SMS/Telegram notifications for repair status milestones",
          "Spare parts inventory deduction on completed maintenance work orders",
        ],
        status: "IN_DEVELOPMENT" as const,
        accessOrDemoUrl: "",
        logoUrl: "https://raw.githubusercontent.com/AriitiTech/.github/main/ariiti-logo.svg",
        screenshots: [],
        isFeatured: false,
        isPublished: true,
        displayOrder: 2,
      },
      {
        name: "Ariiti Network Manager",
        slug: "ariiti-network-manager",
        tagline: "Centralized cloud monitoring and voucher management for MikroTik networks.",
        description:
          "A management gateway designed for hotel managers and office administrators. Enables generation of time-limited guest Wi-Fi vouchers, monitors router CPU/bandwidth loads, and triggers alerts if an ISP line drops.",
        targetCustomers:
          "Hotels, guest houses, co-working centers, internet cafes, and multi-tenant complexes.",
        mainFeatures: [
          "Automated MikroTik Hotspot voucher generation with custom time and bandwidth quotas",
          "Real-time router CPU, temperature, and link ping telemetry dashboard",
          "Dual-WAN ISP uptime monitoring with Telegram outage alerts",
          "Guest Wi-Fi branded landing page portal integration",
        ],
        status: "IN_DEVELOPMENT" as const,
        accessOrDemoUrl: "",
        logoUrl: "https://raw.githubusercontent.com/AriitiTech/.github/main/ariiti-logo.svg",
        screenshots: [],
        isFeatured: false,
        isPublished: true,
        displayOrder: 3,
      },
      {
        name: "Ariiti Inventory Sync",
        slug: "ariiti-inventory-sync",
        tagline: "Multi-branch stock transfer & audit engine for wholesale distributors.",
        description:
          "Bridging warehouse hubs across Harar, Dire Dawa, and Aweday. Tracks barcode-scanned freight shipments, manages batch expiration dates, and alerts head office managers to stock anomalies in real time.",
        targetCustomers:
          "FMCG wholesalers, pharmaceutical distributors, building material yards, and retail chains.",
        mainFeatures: [
          "Inter-warehouse transfer manifest generation with barcode dispatch confirmation",
          "Low-bandwidth sync engine supporting unstable 3G/4G connections",
          "Batch, expiry, and damaged-goods write-off audit trails",
          "Daily consolidated stock value and profit margin analytics",
        ],
        status: "IN_DEVELOPMENT" as const,
        accessOrDemoUrl: "",
        logoUrl: "https://raw.githubusercontent.com/AriitiTech/.github/main/ariiti-logo.svg",
        screenshots: [],
        isFeatured: false,
        isPublished: true,
        displayOrder: 4,
      },
    ];

    for (const productData of productsToSeed) {
      const exists = await Product.findOne({ slug: productData.slug });
      if (!exists) {
        await Product.create(productData);
        console.log(`  [+] Created Product: ${productData.name}`);
      } else {
        await Product.updateOne({ slug: productData.slug }, productData);
        console.log(`  [=] Synchronized Product: ${productData.name}`);
      }
    }

    // --------------------------------------------------------------------------
    // 4. Corporate B2B Case Studies (Authentic Project Directory Showcase)
    // --------------------------------------------------------------------------
    console.log("\n[5/5] Seeding B2B Case Studies & Technical Proof...");
    const caseStudiesToSeed = [
      {
        title: "Ariiti POS: High-Resilience Offline-First Hybrid Commerce Deployment",
        slug: "ariiti-pos-offline-first-commerce",
        category: "SOFTWARE_DEVELOPMENT" as const,
        projectType: "INTERNAL_ECOSYSTEM_PRODUCT" as const,
        clientSector: "Retail & Wholesale",
        clientName: "Ariiti Internal Product Ecosystem",
        isClientConfidential: false,
        location: "Harar & Dire Dawa",
        summary:
          "Engineering an offline-first POS platform enabling regional retail operations to maintain continuous transaction checkout regardless of telecom fiber cuts or mobile network drops.",
        problemAddressed:
          "Retailers in Harar and Dire Dawa frequently suffered customer walkouts and unrecorded sales during intermittent ISP fiber cuts and mobile network throttling. Standard cloud POS systems froze, while manual handwritten receipts led to severe evening inventory discrepancies.",
        solutionImplemented:
          "Engineered a local-first browser client powered by indexed client storage, paired with an intelligent background synchronization service. Sales transactions print instantly to local thermal hardware. When connectivity returns, records cryptographically synchronize to the central cloud database with zero duplicate transactions.",
        technologiesAndEquipment: [
          "Next.js App Router",
          "TypeScript Strict Mode",
          "MongoDB Atlas",
          "Mongoose ODM",
          "IndexedDB Local Store",
          "ESC/POS Thermal Protocol",
          "Web Serial Hardware API",
        ],
        measurableOutcomes: [
          "0 seconds latency during checkout, completely immune to internet outages",
          "100% automated synchronization of cached transactions upon link recovery",
          "Under 1.2-second receipt print speed directly from the local POS terminal",
          "Zero inventory accounting discrepancies reported during pilot testing shifts",
        ],
        coverImageUrl:
          "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1200&q=80",
        galleryImageUrls: [
          "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1200&q=80",
        ],
        liveOrDemoUrl: "https://pos.ariititech.com",
        projectStatus: "PILOT_STAGE" as const,
        publicationStatus: "PUBLISHED" as const,
        isFeatured: true,
        completedAt: new Date("2026-02-15"),
        displayOrder: 1,
      },
      {
        title: "Enterprise Multi-Floor Structured LAN & High-Density Wi-Fi Deployment",
        slug: "enterprise-multifloor-structured-lan-wifi",
        category: "NETWORKING_INFRASTRUCTURE" as const,
        projectType: "TECHNICAL_DEMONSTRATION" as const,
        clientSector: "Commercial Office & Hospitality",
        clientName: "Corporate Reference Architecture",
        isClientConfidential: false,
        location: "Dire Dawa",
        summary:
          "Complete turnkey deployment of certified Cat6 structured cabling, dual-WAN failover router setup, and managed ceiling access points for 150+ concurrent users.",
        problemAddressed:
          "Multi-tenant commercial building facilities faced chronic network congestion, uncontrolled YouTube/video streaming starving management workstations, and dead spots across conference rooms and executive offices.",
        solutionImplemented:
          "Installed a centralized 19-inch 12U server rack with patch panels, deployed certified Cat6 solid copper drops throughout 3 floors, and configured a MikroTik core router with hardware-accelerated VLAN tagging. Deployed ceiling-mounted high-density Access Points with seamless fast-roaming (802.11k/v/r) and separate isolated staff and guest portals.",
        technologiesAndEquipment: [
          "Cat6 Pure Copper Structured Cabling",
          "MikroTik RouterBOARD CCR Series",
          "UniFi Enterprise 6 Access Points",
          "24-Port Gigabit Managed PoE+ Switch",
          "12U Heavy-Duty Wall Mount Server Cabinet",
          "Online Pure Sine Wave 2kVA UPS",
        ],
        measurableOutcomes: [
          "150+ concurrent devices connected without packet loss or jitter spikes",
          "Seamless roaming between 3 floors with zero dropped VoIP or WhatsApp calls",
          "Automatic 1.5-second failover between Ethio Telecom Fiber and 4G backup line",
          "Dedicated QoS prioritization guaranteeing POS and accounting bandwidth",
        ],
        coverImageUrl:
          "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80",
        galleryImageUrls: [
          "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
        ],
        liveOrDemoUrl: "",
        projectStatus: "COMPLETED" as const,
        publicationStatus: "PUBLISHED" as const,
        isFeatured: true,
        completedAt: new Date("2026-01-20"),
        displayOrder: 2,
      },
      {
        title: "Regional Private Medical Center: Isolated Clinical LAN & EMR Database",
        slug: "medical-center-isolated-lan-emr",
        category: "NETWORKING_INFRASTRUCTURE" as const,
        projectType: "CLIENT_DEPLOYMENT" as const,
        clientSector: "Healthcare & Clinical Services",
        clientName: "Private Specialty Clinic",
        isClientConfidential: true,
        location: "Harar",
        summary:
          "Secured multi-department medical network isolation, automated encrypted local backups, and high-availability LAN routing for digital patient consultation desks.",
        problemAddressed:
          "The clinic relied on unmanaged consumer switches where medical diagnostic devices, accounting computers, and patient waiting room Wi-Fi shared a single flat network. Frequent IP collisions froze doctor consultation terminals during peak patient admissions.",
        solutionImplemented:
          "Engineered a medical-grade isolated VLAN architecture separating Clinical Diagnostic Equipment, Administrative Billing, Staff Workstations, and Public Guest Wi-Fi. Installed automated mirrored local NAS storage with daily off-site encrypted synchronization, ensuring patient records are preserved against ransomware or drive failure.",
        technologiesAndEquipment: [
          "MikroTik Cloud Router Switch CRS328",
          "Cat6 LSZH Shielded Twisted Pair Cabling",
          "VLAN Network Segmentation",
          "Synology 2-Bay Mirrored RAID NAS",
          "AES-256 Encrypted Daily Local Backup",
          "Enterprise Surge Protection Array",
        ],
        measurableOutcomes: [
          "100% elimination of IP address conflicts across 42 clinical workstations",
          "Zero lost patient history records with verified 24-hour backup redundancy",
          "Complete security isolation: guest Wi-Fi unable to probe medical EMR records",
          "Guaranteed 2-hour emergency on-site technician response SLA",
        ],
        coverImageUrl:
          "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
        galleryImageUrls: [
          "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
        ],
        liveOrDemoUrl: "",
        projectStatus: "COMPLETED" as const,
        publicationStatus: "PUBLISHED" as const,
        isFeatured: true,
        completedAt: new Date("2025-11-10"),
        displayOrder: 3,
      },
      {
        title: "Wholesale Commodity Distributor: Multi-Warehouse Barcode Stock Engine",
        slug: "wholesale-commodity-barcode-stock-sync",
        category: "HARDWARE_EQUIPMENT" as const,
        projectType: "CLIENT_DEPLOYMENT" as const,
        clientSector: "Wholesale & Logistics",
        clientName: "Commercial Trading Firm",
        isClientConfidential: true,
        location: "Dire Dawa & Aweday",
        summary:
          "Turnkey integration of ruggedized laser barcode scanners, heavy-duty shipping label printers, and a unified inventory transfer verification pipeline.",
        problemAddressed:
          "Discrepancies between warehouse dispatch manifests in Dire Dawa and delivery receipts in Aweday caused significant revenue shrinkage. Staff spent up to 3 hours every evening manually reconciling paper dispatch notes against inventory ledgers.",
        solutionImplemented:
          "Integrated ruggedized wireless 2D barcode scanners and high-throughput thermal shipping label printers into a streamlined digital dispatch workflow. Every outgoing carton is scanned at the loading dock, automatically generating a cryptographically verified digital manifest that requires receiving scan confirmation.",
        technologiesAndEquipment: [
          "Long-Range Ruggedized 2D Barcode Scanners",
          "High-Throughput 4-inch Thermal Label Printers",
          "Automated RJ11 Cash Drawers",
          "Low-Latency Wireless Dock Stations",
          "Offline-Resilient Dispatch Logging",
        ],
        measurableOutcomes: [
          "Reconciliation time dropped from 3 hours to under 8 minutes daily",
          "98.4% reduction in freight carton count discrepancies across warehouses",
          "Instant digital proof of dispatch with physical barcode confirmation",
          "Sub-second scan processing under heavy continuous warehouse loading",
        ],
        coverImageUrl:
          "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
        galleryImageUrls: [
          "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
        ],
        liveOrDemoUrl: "",
        projectStatus: "COMPLETED" as const,
        publicationStatus: "PUBLISHED" as const,
        isFeatured: false,
        completedAt: new Date("2025-12-05"),
        displayOrder: 4,
      },
    ];

    for (const caseStudyData of caseStudiesToSeed) {
      const exists = await CaseStudy.findOne({ slug: caseStudyData.slug });
      if (!exists) {
        await CaseStudy.create(caseStudyData);
        console.log(`  [+] Created Case Study: ${caseStudyData.title}`);
      } else {
        await CaseStudy.updateOne({ slug: caseStudyData.slug }, caseStudyData);
        console.log(`  [=] Synchronized Case Study: ${caseStudyData.title}`);
      }
    }

    // --------------------------------------------------------------------------
    // 5. Technical Articles & News
    // --------------------------------------------------------------------------
    console.log("\n[5/7] Seeding Technical Articles & News...");
    const articlesData = [
      {
        title: "Resilient Offline POS Architectures: Surviving Telecom Interruptions in Eastern Ethiopia",
        slug: "resilient-offline-pos-architectures",
        excerpt: "How Ariiti POS leverages SQLite indexed storage, dual-receipt caching, and cryptographic sync tokens to sustain uninterrupted cashier billing during network outages.",
        content: `## The Offline-First Reality of Retail in Eastern Ethiopia

Commercial retail environments in Harar and Dire Dawa face unique infrastructure challenges. Upstream internet interruptions can halt commerce if point-of-sale systems depend continuously on external cloud connections.

### 3 Pillars of Zero-Downtime POS Design

1. **Local-First Transaction Logs**: All receipt lines and cash drawer kicks execute against local storage in under 5 milliseconds.
2. **Asynchronous Background Synchronization**: When internet connectivity resumes, pending payloads sync via an idempotent protocol.
3. **Cryptographic Consistency**: Timestamps and hash chains ensure zero duplicate receipts and accurate audit trails.
`,
        category: "TECHNICAL_INSIGHT",
        author: {
          name: "Ariiti Engineering Team",
          role: "Systems Architecture Division",
        },
        readTime: "4 min read",
        isPublished: true,
        publishedAt: new Date("2026-03-01"),
        coverImageUrl: "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1200&q=80",
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

- **Resident Field Teams**: Full-time hardware technicians stationed permanently in Harar and Dire Dawa.
- **On-Premise Spares**: Thermal receipt printers, MikroTik routers, Cat6 spools, and surge suppressors kept in local stock.
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

    for (const art of articlesData) {
      const exists = await Article.findOne({ slug: art.slug });
      if (!exists) {
        await Article.create(art);
        console.log(`  [+] Created Article: ${art.title}`);
      } else {
        await Article.updateOne({ slug: art.slug }, art);
        console.log(`  [=] Synchronized Article: ${art.title}`);
      }
    }

    // --------------------------------------------------------------------------
    // 6. Client Feedback & Verified Testimonials
    // --------------------------------------------------------------------------
    console.log("\n[6/7] Seeding Verified Client Testimonials...");
    const testimonialsData = [
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

    for (const testItem of testimonialsData) {
      const exists = await Testimonial.findOne({ deploymentSummary: testItem.deploymentSummary });
      if (!exists) {
        await Testimonial.create(testItem);
        console.log(`  [+] Created Testimonial: ${testItem.clientType}`);
      } else {
        await Testimonial.updateOne({ deploymentSummary: testItem.deploymentSummary }, testItem);
        console.log(`  [=] Synchronized Testimonial: ${testItem.clientType}`);
      }
    }

    // --------------------------------------------------------------------------
    // 7. Super Admin Staff Account (Credentials: admin@ariititech.com)
    // --------------------------------------------------------------------------
    console.log("\n[7/7] Seeding Initial Super Admin Account...");
    const adminEmail = "admin@ariititech.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    const defaultPassword = "AriitiAdmin2026!";
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(defaultPassword, salt);

    if (!existingAdmin) {
      await User.create({
        name: "Lead Systems Administrator",
        email: adminEmail,
        passwordHash,
        role: "SUPER_ADMIN",
        isActive: true,
      });
      console.log(`  [+] Created Super Admin: ${adminEmail} (Password: ${defaultPassword})`);
    } else {
      await User.updateOne(
        { email: adminEmail },
        {
          name: "Lead Systems Administrator",
          passwordHash,
          role: "SUPER_ADMIN",
          isActive: true,
        }
      );
      console.log(`  [=] Updated Super Admin: ${adminEmail} with valid password credentials.`);
    }

    console.log("\n=================================================");
    console.log("   [SUCCESS] ENHANCED SEEDS COMPLETED PROMPTLY!  ");
    console.log("=================================================");
  } catch (error) {
    console.error("\n[ERROR] Seed script execution failed:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("[INFO] MongoDB connection closed cleanly.\n");
    process.exit(0);
  }
}

seedDatabase();
