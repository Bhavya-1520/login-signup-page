import { NextRequest, NextResponse } from "next/server";

// Verify a UPI ID.
// Real verification (name lookup) requires Razorpay's VPA validation API which
// is only available on live/activated accounts. Here we do a robust format
// check and structural validation. Once your Razorpay account is live, this
// can be upgraded to call Razorpay's /payments/validate/vpa endpoint.

const VALID_UPI_HANDLES = [
  "okhdfcbank", "okaxis", "oksbi", "okicici", "ybl", "ibl", "axl",
  "paytm", "apl", "upi", "gpay", "phonepe", "hdfcbank", "sbi", "icici",
  "axisbank", "kotak", "yesbank", "federal", "pnb", "barodampay", "cnrb",
  "idfcbank", "indianbank", "airtel", "freecharge", "jupiteraxis",
];

export async function POST(request: NextRequest) {
  try {
    const { upiId } = await request.json();

    if (!upiId || typeof upiId !== "string") {
      return NextResponse.json({ verified: false, error: "UPI ID is required" }, { status: 400 });
    }

    // Format check: prefix@handle
    const formatRegex = /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/;
    if (!formatRegex.test(upiId)) {
      return NextResponse.json({
        verified: false,
        error: "Invalid UPI format. It should look like name@bank (e.g. yourname@okhdfcbank)",
      });
    }

    // Handle validity check
    const handle = upiId.split("@")[1].toLowerCase();
    const isKnownHandle = VALID_UPI_HANDLES.includes(handle);

    if (!isKnownHandle) {
      return NextResponse.json({
        verified: false,
        error: `"@${handle}" is not a recognized UPI provider. Please check your UPI ID.`,
      });
    }

    // Try Razorpay VPA validation if account supports it
    try {
      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (keyId && keySecret && keyId.startsWith("rzp_live_")) {
        const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
        const res = await fetch("https://api.razorpay.com/v1/payments/validate/vpa", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${auth}`,
          },
          body: JSON.stringify({ vpa: upiId }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          return NextResponse.json({ verified: true, name: data.customer_name || null });
        }
        return NextResponse.json({ verified: false, error: "This UPI ID could not be verified." });
      }
    } catch {
      // Fall through to format-based success
    }

    // Format + known handle passed (test mode)
    return NextResponse.json({ verified: true });
  } catch (error: any) {
    console.error("UPI verify error:", error.message);
    return NextResponse.json({ verified: false, error: "Verification failed" }, { status: 500 });
  }
}
