const SHARPIFY_CLIENT_ID = process.env.SHARPIFY_CLIENT_ID!;
const SHARPIFY_CLIENT_SECRET = process.env.SHARPIFY_CLIENT_SECRET!;
const BASE_URL = "https://sharpify-pay.com";

export async function createPixPayment(params: {
  name: string;
  description: string;
  amount: number;
}) {
  const res = await fetch(`${BASE_URL}/api/v1/gateway/payment/create-paymnet`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-sharpify-client-id": SHARPIFY_CLIENT_ID,
      "x-sharpify-client-secret": SHARPIFY_CLIENT_SECRET,
    },
    body: JSON.stringify({
      name: params.name,
      description: params.description,
      amount: Number(params.amount.toFixed(2)),
      gatewayMethod: "PIX",
    }),
  });

  const text = await res.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    const msg =
      data?.message ||
      data?.error?.message ||
      data?.error ||
      text ||
      "Erro desconhecido";
    throw new Error(`Sharpify ${res.status}: ${typeof msg === "string" ? msg : JSON.stringify(msg)}`);
  }

  return data;
}

export async function getPayment(paymentLinkId: string) {
  const res = await fetch(
    `${BASE_URL}/api/v1/gateway/payment/get-payment?paymentLinkId=${paymentLinkId}`,
    {
      headers: {
        "x-sharpify-client-id": SHARPIFY_CLIENT_ID,
        "x-sharpify-client-secret": SHARPIFY_CLIENT_SECRET,
      },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sharpify get error: ${res.status} - ${text}`);
  }

  return res.json();
}
