/** Brand settings in one place so names can change without a code hunt. */
export const site = {
  name: "StudentLife237",
  slogan: "Equal opportunities to all",
  tagline: "GCE revision, scholarships, jobs and guidance for Cameroonian students.",
  domain: "studentlife237.com",
  /**
   * Who runs the site, as shown in the terms and on the contact page. Once the business is
   * registered, set the registered name and its RCCM number.
   */
  operator: { name: "StudentLife237", rccm: null as string | null, city: "Cameroon" },
  /** WhatsApp number students contact for help and password resets (SUPPORT_WHATSAPP overrides it). */
  supportWhatsApp: "237676999221",
  /** The GCE revision section inside the platform. */
  gcePrep: {
    name: "GCEPrep237",
    slogan: "Prepare for the GCE smarter.",
    tagline: "Notes, past questions, weekly timed tests and cash prizes for GCE O and A Level.",
  },
  opportunities: {
    name: "Opportunities",
    tagline: "Scholarships, jobs, studying abroad, money and careers.",
  },
} as const;
