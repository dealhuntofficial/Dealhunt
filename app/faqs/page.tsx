"use client";

import React, { useMemo, useState } from "react";
import { faqs, categories } from "@/data/faqs";
import FAQSearch from "@/components/FAQSearch";
import FAQCategoryTabs from "@/components/FAQCategoryTabs";
import FAQList from "@/components/FAQList";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import BackButton from "@/components/BackButton";

// JSON-LD generator
function buildFaqJsonLd(topItems: { q: string; a: string }[]) {
  const mainEntity = topItems.map((t) => ({
    "@type": "Question",
    name: t.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: t.a,
    },
  }));

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  };
}

export default function FAQPage() {
  const cats = categories;
  const [active, setActive] = useState<string>(cats[0] || "General");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 250);

  const filtered = useMemo(() => {
    const list = faqs[active] || [];
    if (!debouncedSearch.trim()) return list;
    const s = debouncedSearch.toLowerCase();
    return list.filter(
      (f) => f.q.toLowerCase().includes(s) || f.a.toLowerCase().includes(s)
    );
  }, [active, debouncedSearch]);

  const topForSchema = useMemo(() => {
    return filtered.slice(0, 12).map((f) => ({ q: f.q, a: f.a }));
  }, [filtered]);

  const jsonLd = JSON.stringify(buildFaqJsonLd(topForSchema));

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <head>
        <title>DealHunt — FAQ</title>
        <meta
          name="description"
          content="Frequently asked questions about DealHunt — products, wallet, account, affiliate program and Cart to Heart."
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      </head>

      <BackButton />

      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center mt-6">
        DealHunt FAQ Hub
      </h1>

      <section className="bg-white rounded-2xl p-6 mb-8 shadow">
        <h2 className="text-2xl font-semibold mb-2">Welcome to DealHunt Help</h2>
        <p className="text-gray-700 leading-relaxed">
          This hub answers questions about product categories (luxury and general),
          how our affiliate system works, wallet & cashback, account & login, the
          Cart to Heart program, and partnerships. Use the search or choose a
          category to get started. If you can't find an answer, contact us through
          <a href="/support" className="text-yellow-600 underline"> Support</a>.
        </p>
      </section>

      <div className="flex justify-center mb-6">
        <FAQSearch
          value={search}
          onChange={setSearch}
          placeholder="Search FAQs (e.g. 'cashback', 'refund', 'warranty')"
        />
      </div>

      <FAQCategoryTabs
        categories={cats}
        active={active}
        onChange={(c) => {
          setActive(c);
          setSearch("");
        }}
      />

      <div className="mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold">{active}</h3>
          <p className="text-gray-600 mt-2">
            {{
              General:
                "DealHunt curates deals across categories. Use this section to understand how we work and how to get the most value.",
              "Orders & Products":
                "Details about products, authenticity, logistics and merchant policies.",
              "Cashback & Wallet":
                "How cashback works — rewards timing, withdrawal rules and effect of returns.",
              "Account & Login":
                "Account FAQs including login (Google-only), privacy and session guidance.",
              "Cart to Heart":
                "Details about our social initiative and how to participate.",
              "Affiliate & Partners":
                "Info for merchants/publishers regarding affiliate programs.",
            }[active]}
          </p>
        </div>
      </div>

      <FAQList items={filtered} searchTerm={debouncedSearch} />

      <div className="mt-10 text-sm text-gray-500">
        <p>
          Note: Prices, stock and shipping details are provided by merchants.
          DealHunt links you to merchant pages and provides tools to discover deals.
        </p>
      </div>
    </main>
  );
}
