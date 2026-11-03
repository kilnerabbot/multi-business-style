import { getSettings } from "@/lib/settings";
import ContactClient from "./ContactClient";

// Always server-render fresh so admin changes to contact details show immediately
export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getSettings();
  return <ContactClient settings={settings} />;
}
