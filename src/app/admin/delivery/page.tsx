import { createClient } from "@supabase/supabase-js";
import { DeliveryRate } from "@/types";
import DeliveryRateForm from "./DeliveryRateForm";

const adminDb = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

export default async function AdminDeliveryPage() {
  const { data: rates } = await adminDb()
    .from("delivery_rates")
    .select("*")
    .order("is_johannesburg", { ascending: false });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[#0D1B2A]">Delivery Rates</h1>
        <p className="text-sm text-gray-400 mt-1">
          Click <strong>Edit</strong> on any row to update that province's rate or free delivery threshold.
        </p>
      </div>

      <DeliveryRateForm rates={(rates as DeliveryRate[]) ?? []} />
    </div>
  );
}
