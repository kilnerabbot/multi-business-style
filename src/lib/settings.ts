import { createClient } from "@supabase/supabase-js";

export interface SiteSettings {
  id: number;
  email: string;
  phone: string;
  address: string;
  business_hours: string;
  business_hours_sub: string;
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  tiktok_url: string;
  whatsapp_url: string;
  youtube_url: string;
  updated_at: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  email: "hello@multibusinessstyle.co.za",
  phone: "+27 11 000 0000",
  address: "Johannesburg, Gauteng",
  business_hours: "Mon–Fri: 8am–5pm",
  business_hours_sub: "Sat: 9am–1pm · Sun: Closed",
  facebook_url: "",
  instagram_url: "",
  twitter_url: "",
  tiktok_url: "",
  whatsapp_url: "",
  youtube_url: "",
  updated_at: "",
};

/** Server-side fetch — call from Server Components only */
export async function getSettings(): Promise<SiteSettings> {
  try {
    const db = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data } = await db
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .single();
    return (data as SiteSettings) ?? DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}
