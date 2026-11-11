import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { cn, slugify, buildWhatsAppUrl } from "../lib/utils";

describe("Utility Functions (src/lib/utils.ts)", () => {
  describe("cn() - Class merging", () => {
    test("merges multiple string classes", () => {
      const result = cn("px-4", "py-2", "text-white");
      assert.equal(result, "px-4 py-2 text-white");
    });

    test("resolves Tailwind conflicts correctly using tailwind-merge", () => {
      const result = cn("px-4 py-2 text-red-500", "px-6 text-blue-500");
      assert.equal(result, "py-2 px-6 text-blue-500");
    });

    test("handles falsy and conditional values gracefully", () => {
      const isActive = false;
      const isPrimary = true;
      const result = cn(
        "btn",
        isActive && "btn-active",
        isPrimary && "btn-primary",
        undefined,
        null,
        ""
      );
      assert.equal(result, "btn btn-primary");
    });
  });

  describe("slugify() - URL Slug Generation", () => {
    test("converts simple string to lowercase slug with hyphens", () => {
      assert.equal(slugify("Ariiti POS System"), "ariiti-pos-system");
    });

    test("removes special characters and handles non-ASCII", () => {
      assert.equal(
        slugify("Commercial Wi-Fi & LAN (High-Density) #1!"),
        "commercial-wi-fi-lan-high-density-1"
      );
    });

    test("collapses multiple consecutive spaces and dashes", () => {
      assert.equal(
        slugify("  IT   Maintenance   ---   Support  "),
        "it-maintenance-support"
      );
    });

    test("handles empty or single word strings", () => {
      assert.equal(slugify("Hardware"), "hardware");
      assert.equal(slugify(""), "");
    });
  });

  describe("buildWhatsAppUrl() - Direct Customer Lead URL", () => {
    test("cleans phone formatting and outputs valid wa.me URL", () => {
      const url = buildWhatsAppUrl("+251 (915) 00-00-00", {
        name: "Abebe Kebede",
        service: "Ariiti POS",
        location: "Dire Dawa",
        details: "We have 3 retail branches needing sync.",
      });

      assert.ok(url.startsWith("https://wa.me/251915000000?text="));
      const textParam = new URL(url).searchParams.get("text") || "";
      assert.ok(textParam.includes("Abebe Kebede"));
      assert.ok(textParam.includes("Ariiti POS"));
      assert.ok(textParam.includes("Dire Dawa"));
      assert.ok(textParam.includes("3 retail branches"));
    });

    test("works without optional parameters", () => {
      const url = buildWhatsAppUrl("0912345678");
      assert.ok(url.startsWith("https://wa.me/0912345678?text="));
      const textParam = new URL(url).searchParams.get("text") || "";
      assert.ok(textParam.includes("Hello Ariiti Tech Team"));
    });
  });
});
