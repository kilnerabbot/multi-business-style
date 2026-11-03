"use client";

import Link from "next/link";
import { CheckCircle, ArrowRight, MessageCircle, RotateCcw } from "lucide-react";

interface Props {
  orderId?: string;
  phone?: string;
  orderRef?: string;
}

export default function SuccessClient({ orderId, phone, orderRef }: Props) {
  const displayRef = orderRef ?? (orderId ? orderId.slice(0, 8).toUpperCase() : null);

  const handleReopenWhatsApp = () => {
    if (phone) {
      window.open(`https://wa.me/${phone}`, "_blank");
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-[#25D366]/15 rounded-full flex items-center justify-center">
          <MessageCircle size={40} className="text-[#25D366]" />
        </div>
      </div>

      <h1 className="text-3xl font-extrabold text-[#0D1B2A] mb-3">Order Sent!</h1>
      <p className="text-gray-500 mb-2">
        Your order details have been sent to us on WhatsApp.
      </p>
      {displayRef && (
        <p className="text-sm text-gray-400 mb-8">
          Order reference:{" "}
          <span className="font-semibold text-[#0D1B2A]">{displayRef}</span>
        </p>
      )}

      {/* Next steps card */}
      <div className="bg-[#F4F6F8] rounded-2xl p-6 mb-6 text-left space-y-4">
        <p className="text-sm font-bold text-[#0D1B2A]">What happens next?</p>
        <ol className="space-y-3">
          {[
            "WhatsApp opened with your order pre-filled — just hit Send if you haven't yet.",
            "We'll confirm your order and send you our payment details.",
            "Once payment is received, we'll dispatch your order and send a tracking update.",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
              <span className="w-5 h-5 bg-[#25D366]/15 text-[#25D366] rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Re-open WhatsApp */}
      {phone && (
        <button
          onClick={handleReopenWhatsApp}
          className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20b858] text-white font-bold py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-[#25D366]/25 mb-4"
        >
          <RotateCcw size={16} />
          Re-open WhatsApp
        </button>
      )}

      {/* Nav links */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/account/orders"
          className="inline-flex items-center justify-center gap-2 bg-[#0D1B2A] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#1a2f45] transition-colors"
        >
          Track your order
        </Link>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center gap-2 border border-gray-200 text-[#0D1B2A] font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Continue shopping <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
