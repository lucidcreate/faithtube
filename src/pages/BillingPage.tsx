import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function BillingPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function startCheckout(priceId: string, mode: "payment" | "subscription") {
    if (!user) {
      setMessage("Please log in first.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          priceId,
          mode,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setMessage(data.error || "Checkout failed.");
      }
    } catch (err: any) {
      setMessage(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section">
      <h1 className="section-title">Support FaithTube</h1>

      <p className="soft mb-4">
        Your support helps us create more faith-filled movies and unlocks downloads.
      </p>

      <div className="video-grid">
        {/* Donation */}
        <div className="info-card">
          <h2>🙏 Donate Once</h2>
          <p className="soft">
            Support the mission and unlock downloads instantly.
          </p>

          <button
            className="btn btn-primary"
            disabled={loading}
            onClick={() => startCheckout("price_donation_id", "payment")}
          >
            Donate £5
          </button>
        </div>

        {/* Supporter */}
        <div className="info-card">
          <h2>❤️ Supporter</h2>
          <p className="soft">
            Monthly support + downloads + supporter badge.
          </p>

          <button
            className="btn btn-primary"
            disabled={loading}
            onClick={() => startCheckout("price_supporter_id", "subscription")}
          >
            £5 / month
          </button>
        </div>

        {/* Premium */}
        <div className="info-card">
          <h2>⭐ Premium</h2>
          <p className="soft">
            Full access to exclusive movies + downloads.
          </p>

          <button
            className="btn btn-primary"
            disabled={loading}
            onClick={() => startCheckout("price_premium_id", "subscription")}
          >
            £10 / month
          </button>
        </div>
      </div>

      {message && <p className="soft mt-4">{message}</p>}
    </section>
  );
}