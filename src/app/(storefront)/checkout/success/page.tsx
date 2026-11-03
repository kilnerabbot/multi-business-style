import SuccessClient from "./SuccessClient";

interface Props {
  searchParams: Promise<{ order?: string; phone?: string; ref?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { order, phone, ref: orderRef } = await searchParams;
  return <SuccessClient orderId={order} phone={phone} orderRef={orderRef} />;
}
