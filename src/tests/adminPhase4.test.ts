import { test, describe } from "node:test";
import assert from "node:assert";
import bcrypt from "bcryptjs";
import {
  createCaseStudySchema,
  updateCaseStudySchema,
} from "../lib/validations/caseStudy";
import { updateInquiryStatus, addInquiryNote } from "../actions/admin/inquiries";
import { upsertCaseStudy, updateProductLifecycle } from "../actions/admin/cms";

describe("Phase 4 - Admin Authentication, RBAC & CMS Actions", () => {
  describe("Password Hashing & Verification (bcryptjs)", () => {
    test("hashes password and verifies matching password successfully", async () => {
      const password = "AriitiAdmin2026!";
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      assert.notStrictEqual(password, hash);
      const isMatch = await bcrypt.compare(password, hash);
      assert.strictEqual(isMatch, true);

      const isWrongMatch = await bcrypt.compare("WrongPassword123", hash);
      assert.strictEqual(isWrongMatch, false);
    });
  });

  describe("Security Guards - Unauthenticated Action Rejection", () => {
    test("updateInquiryStatus blocks unauthenticated requests", async () => {
      const res = await updateInquiryStatus("65c000000000000000000001", "CONTACTED");
      assert.strictEqual(res.success, false);
      assert.match(res.error || "", /Unauthorized/i);
    });

    test("addInquiryNote blocks unauthenticated requests", async () => {
      const res = await addInquiryNote("65c000000000000000000001", "Client called regarding pricing");
      assert.strictEqual(res.success, false);
      assert.match(res.error || "", /Unauthorized/i);
    });

    test("upsertCaseStudy blocks unauthenticated requests", async () => {
      const res = await upsertCaseStudy({ title: "Test Case" });
      assert.strictEqual(res.success, false);
      assert.match(res.error || "", /Unauthorized/i);
    });

    test("updateProductLifecycle blocks unauthenticated requests", async () => {
      const res = await updateProductLifecycle("65c000000000000000000001", "AVAILABLE");
      assert.strictEqual(res.success, false);
      assert.match(res.error || "", /Unauthorized/i);
    });
  });

  describe("Case Study CMS Validation (Zod)", () => {
    test("accepts valid case study payload", () => {
      const validPayload = {
        title: "Enterprise Multi-Floor Structured LAN Setup",
        slug: "enterprise-multifloor-lan-setup",
        category: "NETWORKING_INFRASTRUCTURE",
        projectType: "CLIENT_DEPLOYMENT",
        clientSector: "Hospitality & Commercial",
        clientName: "Grand Plaza Hotel",
        isClientConfidential: false,
        location: "Dire Dawa",
        summary: "Turnkey Cat6 structured cabling installation for 150+ users across 3 floors.",
        problemAddressed: "Dead zones and frequent network drops caused severe checkout delays and staff complaints.",
        solutionImplemented: "Deployed certified Cat6 cabling, MikroTik core router, and ceiling-mount UniFi APs with seamless roaming.",
        technologiesAndEquipment: ["Cat6 Cable", "MikroTik CCR", "UniFi Enterprise APs"],
        measurableOutcomes: ["0 dropped calls during floor roaming", "1.5s failover speed"],
        coverImageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800",
        projectStatus: "COMPLETED",
        publicationStatus: "PUBLISHED",
      };

      const parsed = createCaseStudySchema.safeParse(validPayload);
      assert.strictEqual(parsed.success, true);
    });

    test("rejects case study with empty technologiesAndEquipment", () => {
      const invalidPayload = {
        title: "Enterprise Multi-Floor Structured LAN Setup",
        slug: "enterprise-multifloor-lan-setup",
        category: "NETWORKING_INFRASTRUCTURE",
        projectType: "CLIENT_DEPLOYMENT",
        clientSector: "Hospitality & Commercial",
        location: "Dire Dawa",
        summary: "Turnkey Cat6 structured cabling installation for 150+ users across 3 floors.",
        problemAddressed: "Dead zones and frequent network drops caused severe checkout delays and staff complaints.",
        solutionImplemented: "Deployed certified Cat6 cabling, MikroTik core router, and ceiling-mount UniFi APs with seamless roaming.",
        technologiesAndEquipment: [], // Empty
        coverImageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800",
      };

      const parsed = createCaseStudySchema.safeParse(invalidPayload);
      assert.strictEqual(parsed.success, false);
    });
  });
});
