"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";

export default function SettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [notifEmail, setNotifEmail] = useState(true);
  const [notifOffers, setNotifOffers] = useState(true);
  const [notifReferral, setNotifReferral] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const e = localStorage.getItem("notifEmail");
    const o = localStorage.getItem("notifOffers");
    const r = localStorage.getItem("notifReferral");

    if (e !== null) setNotifEmail(e === "true");
    if (o !== null) setNotifOffers(o === "true");
    if (r !== null) setNotifReferral(r === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("notifEmail", String(notifEmail));
  }, [notifEmail]);

  useEffect(() => {
    localStorage.setItem("notifOffers", String(notifOffers));
  }, [notifOffers]);

  useEffect(() => {
    localStorage.setItem("notifReferral", String(notifReferral));
  }, [notifReferral]);

  const clearPreferences = () => {
    localStorage.removeItem("notifEmail");
    localStorage.removeItem("notifOffers");
    localStorage.removeItem("notifReferral");

    setNotifEmail(false);
    setNotifOffers(false);
    setNotifReferral(false);

    alert("All saved preferences cleared!");
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleDeleteAccount = async () => {
    if (!session?.user?.email) {
      alert("You must be signed in to request account deletion.");
      return;
    }

    const ok = confirm(
      "Are you sure you want to request account deletion? Support will process this soon."
    );
    if (!ok) return;

    try {
      setDeleteLoading(true);

      const res = await fetch("/api/delete-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // @ts-ignore
          userId: session?.user?.id,
          email: session.user.email,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Account deletion request submitted.");
      } else {
        alert(data?.error || "Failed to submit request.");
      }
    } catch (err) {
      alert("Network error. Try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">

      {/* Back Button */}
      <BackButton />

      <h1 className="text-3xl font-bold mb-6 text-yellow-600">Settings</h1>

      {/* Preferences */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <h2 className="font-semibold text-lg">Preferences</h2>

        <label className="flex items-center justify-between">
          <span>
            <div className="font-medium">Email Notifications</div>
            <div className="text-sm text-gray-500">
              Receive account & offer emails
            </div>
          </span>
          <input
            type="checkbox"
            checked={notifEmail}
            onChange={() => setNotifEmail((s) => !s)}
            className="accent-yellow-500"
          />
        </label>

        <label className="flex items-center justify-between">
          <span>
            <div className="font-medium">Promotional Offers</div>
            <div className="text-sm text-gray-500">Get special deal alerts</div>
          </span>
          <input
            type="checkbox"
            checked={notifOffers}
            onChange={() => setNotifOffers((s) => !s)}
            className="accent-yellow-500"
          />
        </label>

        <label className="flex items-center justify-between">
          <span>
            <div className="font-medium">Referral Notifications</div>
            <div className="text-sm text-gray-500">
              Updates about referral rewards
            </div>
          </span>
          <input
            type="checkbox"
            checked={notifReferral}
            onChange={() => setNotifReferral((s) => !s)}
            className="accent-yellow-500"
          />
        </label>

        <button
          onClick={clearPreferences}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Clear Preferences
        </button>
      </div>

      {/* Account Section */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <h2 className="font-semibold text-lg">Account Management</h2>

        <div className="bg-gray-50 p-3 rounded-md">
          {session?.user ? (
            <p className="text-sm text-gray-700">
              Signed in as <span className="font-medium">{session.user.email}</span>.
            </p>
          ) : (
            <p className="text-sm text-gray-700">You are not signed in.</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
          >
            Logout
          </button>

          <button
            onClick={() => router.push("/profile")}
            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Edit Account
          </button>

          <button
            onClick={handleDeleteAccount}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            disabled={deleteLoading}
          >
            {deleteLoading ? "Submitting..." : "Request Account Deletion"}
          </button>
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <h2 className="font-semibold text-lg">Privacy & Support</h2>

        <p className="text-sm text-gray-600">
          View our{" "}
          <a href="/privacy" className="text-yellow-600 underline">
            Privacy Policy
          </a>
          .
        </p>

        <div className="space-y-2 text-sm">
          <p>
            💬{" "}
            <a href="/contact" className="text-yellow-600 underline">
              Contact Support
            </a>
          </p>

          <p>
            📝{" "}
            <a href="/feedback" className="text-yellow-600 underline">
              Share Your Feedback
            </a>
          </p>
        </div>
      </div>

      <div className="text-center">
        <a
          href="/"
          className="inline-block bg-gray-800 hover:bg-gray-900 text-white px-5 py-2 rounded-md"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
      }
