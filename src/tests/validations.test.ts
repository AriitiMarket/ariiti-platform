import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  createInquirySchema,
  phoneRegex,
} from "../lib/validations/inquiry";
import {
  createServiceSchema,
} from "../lib/validations/service";
import {
  createProductSchema,
} from "../lib/validations/product";
import {
  createCaseStudySchema,
} from "../lib/validations/caseStudy";

describe("Validation Schemas (src/lib/validations/)", () => {
  describe("Inquiry Validation (inquiry.ts)", () => {
    test("validates valid Ethiopian phone formats", () => {
      assert.ok(phoneRegex.test("+251911223344"));
      assert.ok(phoneRegex.test("+251711223344"));
      assert.ok(phoneRegex.test("0911223344"));
      assert.ok(phoneRegex.test("0711223344"));
      assert.ok(phoneRegex.test("+14155552671")); // International
    });

    test("rejects invalid phone numbers", () => {
      assert.equal(phoneRegex.test("12345"), false);
      assert.equal(phoneRegex.test("0811223344"), false); // Invalid prefix in Ethiopia
      assert.equal(phoneRegex.test("abc-def-ghij"), false);
    });

    test("validates complete valid customer inquiry", () => {
      const validInput = {
        customerName: "Mohammed Al-Harari",
        businessName: "Harar Wholesale Center",
        phone: "+251915001122",
        email: "mohammed@example.com",
        serviceCategory: "SOFTWARE_DEVELOPMENT" as const,
        requestedServiceTitle: "Ariiti POS & Inventory System",
        location: "Harar",
        projectDescription: "We need an inventory solution for our 2 wholesale branches in Harar.",
      };

      const result = createInquirySchema.safeParse(validInput);
      assert.ok(result.success);
    });

    test("fails if honeypot is populated (bot detection)", () => {
      const botInput = {
        customerName: "Spam Bot",
        phone: "+251911000000",
        serviceCategory: "GENERAL" as const,
        requestedServiceTitle: "Spam service",
        location: "Dire Dawa",
        projectDescription: "Check this link for quick crypto profits today!",
        honeypot: "http://spamlink.ru", // Bot filled hidden field
      };

      const result = createInquirySchema.safeParse(botInput);
      assert.equal(result.success, false);
      if (!result.success) {
        assert.ok(result.error.errors.some((e) => e.path.includes("honeypot")));
      }
    });

    test("fails if project description is too short (min 10 chars)", () => {
      const invalidInput = {
        customerName: "Sara",
        phone: "0911223344",
        serviceCategory: "NETWORKING_INFRASTRUCTURE" as const,
        requestedServiceTitle: "LAN Cabling",
        location: "Dire Dawa",
        projectDescription: "Call me", // only 7 chars
      };

      const result = createInquirySchema.safeParse(invalidInput);
      assert.equal(result.success, false);
    });
  });

  describe("Service Validation (service.ts)", () => {
    test("validates valid service payload", () => {
      const validService = {
        title: "Commercial Structured Cabling",
        slug: "commercial-structured-cabling",
        category: "NETWORKING_INFRASTRUCTURE" as const,
        summary: "Certified Cat6 cabling with high-speed patch panel termination.",
        description:
          "High capacity structured cabling architecture installed according to TIA/EIA commercial standards.",
        problemsSolved: ["Messy cables causing downtime"],
        targetCustomers: "Corporate offices and hotels",
        whatsIncluded: ["Cat6 pure copper drops", "Testing & Fluke certification report"],
        isActive: true,
        displayOrder: 1,
      };

      const result = createServiceSchema.safeParse(validService);
      assert.ok(result.success);
    });

    test("rejects invalid slugs with uppercase or special characters", () => {
      const invalidService = {
        title: "Test Service",
        slug: "Test_Service#1", // Invalid slug
        category: "HARDWARE_EQUIPMENT" as const,
        summary: "Valid summary with sufficient character count.",
        description: "Valid detailed description that is sufficiently long for testing purposes.",
        problemsSolved: ["Hardware failures"],
        targetCustomers: "Supermarkets",
        whatsIncluded: ["Thermal printer setup"],
      };

      const result = createServiceSchema.safeParse(invalidService);
      assert.equal(result.success, false);
    });

    test("enforces at least 1 item in whatsIncluded and problemsSolved", () => {
      const emptyArraysService = {
        title: "IT Support SLA",
        slug: "it-support-sla",
        category: "IT_MAINTENANCE_SUPPORT" as const,
        summary: "Monthly maintenance and proactive monitoring contract.",
        description: "Comprehensive maintenance service that protects your IT infrastructure.",
        problemsSolved: [], // Empty!
        targetCustomers: "SMEs",
        whatsIncluded: [], // Empty!
      };

      const result = createServiceSchema.safeParse(emptyArraysService);
      assert.equal(result.success, false);
    });
  });

  describe("Product Validation (product.ts)", () => {
    test("validates valid product with all requirements", () => {
      const validProduct = {
        name: "Ariiti POS",
        slug: "ariiti-pos",
        tagline: "Offline-first Point of Sale for retail and hospitality.",
        description:
          "Enterprise POS software capable of ringing sales and syncing automatically across branches.",
        targetCustomers: "Retail supermarkets, pharmacies, and restaurants.",
        mainFeatures: ["Offline-first mode", "Thermal receipt printing", "Inventory tracking"],
        status: "TESTING" as const,
        isFeatured: true,
        isPublished: true,
      };

      const result = createProductSchema.safeParse(validProduct);
      assert.ok(result.success);
    });

    test("rejects product with empty features array", () => {
      const invalidProduct = {
        name: "Ariiti Test",
        slug: "ariiti-test",
        tagline: "Short hook tagline here.",
        description: "A comprehensive description that exceeds minimum 50 characters threshold.",
        targetCustomers: "All businesses",
        mainFeatures: [], // Missing features!
        status: "IN_DEVELOPMENT" as const,
      };

      const result = createProductSchema.safeParse(invalidProduct);
      assert.equal(result.success, false);
    });
  });

  describe("Case Study Validation (caseStudy.ts)", () => {
    test("validates valid corporate B2B case study", () => {
      const validCaseStudy = {
        title: "Multi-Floor Commercial LAN and Wi-Fi Installation",
        slug: "commercial-lan-wifi-installation",
        category: "NETWORKING_INFRASTRUCTURE" as const,
        projectType: "TECHNICAL_DEMONSTRATION" as const,
        clientSector: "Hospitality & Tourism",
        clientName: "Dire Dawa Grand Hotel",
        isClientConfidential: false,
        location: "Dire Dawa",
        summary: "Turnkey enterprise network deployment supporting 200+ concurrent guest devices.",
        problemAddressed:
          "Guests reported recurring Wi-Fi drops and poor coverage across conference halls and guest floors.",
        solutionImplemented:
          "Deployed MikroTik core routing with UniFi ceiling access points and certified Cat6 drops.",
        technologiesAndEquipment: ["MikroTik RouterOS", "UniFi U6 Pro", "Cat6 Solid Copper Cable"],
        measurableOutcomes: ["100% wireless coverage achieved across all guest rooms"],
        coverImageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8",
        projectStatus: "COMPLETED" as const,
        publicationStatus: "PUBLISHED" as const,
      };

      const result = createCaseStudySchema.safeParse(validCaseStudy);
      assert.ok(result.success);
    });

    test("enforces technologiesAndEquipment requirement", () => {
      const invalidCaseStudy = {
        title: "Custom Software Deployment Case Study",
        slug: "custom-software-deployment",
        category: "SOFTWARE_DEVELOPMENT" as const,
        projectType: "CLIENT_DEPLOYMENT" as const,
        clientSector: "Retail",
        location: "Harar",
        summary: "Automated retail inventory sync system deployed across two store locations.",
        problemAddressed: "Stock mismatch causing sales delays and manual calculation errors.",
        solutionImplemented: "Custom Next.js inventory system with offline receipt generation.",
        technologiesAndEquipment: [], // Empty!
        coverImageUrl: "https://images.unsplash.com/photo-1556742049-0a67c5574f73",
      };

      const result = createCaseStudySchema.safeParse(invalidCaseStudy);
      assert.equal(result.success, false);
    });
  });
});
