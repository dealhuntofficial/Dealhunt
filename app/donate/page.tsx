import BackButton from "@/components/BackButton";

export default function Page() {
  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <BackButton />

      <h1 className="text-3xl font-bold text-yellow-600 mt-6">Donate Your Savings</h1>

      <p className="mt-4 text-gray-600">
        Contribute your savings to education, health, and social causes.
      </p>
    </main>
  );
}
