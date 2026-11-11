import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Standard Tailwind CSS class merger combining clsx and tailwind-merge.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Converts titles and headers into URL-safe lowercase slugs.
 * Example: "Custom Web & Mobile Apps" -> "custom-web-mobile-apps"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s-]/g, "") // Remove invalid chars
    .replace(/[\s_]+/g, "-") // Replace spaces and underscores with a single dash
    .replace(/-+/g, "-") // Replace multiple dashes with a single dash
    .replace(/^-+|-+$/g, ""); // Trim dashes from start and end
}

/**
 * Parameters for crafting a pre-filled Ariiti Tech WhatsApp inquiry message.
 */
export interface WhatsAppMessageParams {
  name?: string;
  service?: string;
  location?: string;
  details?: string;
}

/**
 * Constructs a properly URL-encoded WhatsApp direct link pre-populated
 * with customer and service context for Ariiti Tech sales & support.
 */
export function buildWhatsAppUrl(
  phone: string,
  params: WhatsAppMessageParams = {}
): string {
  // Strip non-digit characters except leading plus
  const cleanPhone = phone.replace(/[^0-9]/g, "");

  const greeting = "Hello Ariiti Tech Team,";
  const lines: string[] = [greeting];

  if (params.name) {
    lines.push(`My name is ${params.name.trim()}.`);
  }

  if (params.service) {
    lines.push(`I am inquiring about: ${params.service.trim()}.`);
  }

  if (params.location) {
    lines.push(`Location: ${params.location.trim()}.`);
  }

  if (params.details) {
    lines.push(`Project Details: ${params.details.trim()}`);
  }

  lines.push("I would like to schedule a consultation with your technical team.");

  const messageText = lines.join("\n\n");
  const encodedText = encodeURIComponent(messageText);

  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}
