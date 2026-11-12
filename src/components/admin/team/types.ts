export interface SquadItem {
  _id: string;
  unitName: string;
  designation: string;
  specialization: string;
  overview?: string;
  dispatchHubs: string;
  keyCompetencies: string[];
  imageUrl?: string;
  ctaText?: string;
  ctaHref?: string;
  order: number;
  isActive: boolean;
}

export interface MemberItem {
  _id: string;
  name: string;
  role: string;
  department: string;
  bio: string;
  location: string;
  skills: string[];
  imageUrl?: string;
  inquiryTopic?: string;
  inquiryHref?: string;
  order: number;
  isActive: boolean;
}
