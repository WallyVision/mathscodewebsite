/** Brand settings in one place so names can change without a code hunt. */
export const site = {
  name: "StudentLife237",
  slogan: "Equal opportunities to all",
  tagline: "GCE revision, scholarships, jobs and guidance for Cameroonian students.",
  domain: "studentlife237.com",
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
