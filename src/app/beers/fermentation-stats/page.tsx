import Link from "next/link";

import { fetchFermentationStats } from "@/lib/brewfather";

const BREWFATHER_API_DOMAIN = "https://api.brewfather.app/v1";

export default async function Page({ searchParams }) {
  const batches = await fetchFermentationStats({
    debug: searchParams.debug,
    clearCache: searchParams.clearCache,
  });
  const stats = [
    {
      key: "measuredBatchSize",
      label: "Batch Vol.",
      unit: "L",
    },
    {
      key: "measuredBoilSize",
      label: "Pre-Boil Vol.",
      unit: "L",
    },
    {
      key: "boilTime",
      label: "Boil Time",
      unit: "h",
      calculatedValue: (b) => b.recipe.boilTime / 60,
    },
    {
      key: "measuredKettleSize",
      label: "Post-Boil Vol.",
      unit: "L",
    },
    {
      key: "boilEvaporation",
      label: "Boil-off Rate",
      unit: "L/h",
      highlight: true,
      calculatedValue: (b) =>
        (b.measuredBoilSize - b.measuredKettleSize) / (b.boilTime / 60),
    },
  ];

  const dtf = new Intl.DateTimeFormat("en-CA");

  const runningTotals = {};

  const getStatValue = (stat, batch) => {
    // either use the calculatedValue, or
    // the key from the batch.
    return typeof stat.calculatedValue === "function"
      ? stat.calculatedValue(batch)
      : batch[stat.key];
  };

  return (
    <>
      <Link href="/beers" className="block mb-8">
        ← Beers
      </Link>
      <h1>Fermentation Stats 🧪🔬👨🏻‍🔬</h1>

      <table className="table-fixed w-full">
        <thead className="text-center">
          <tr>
            <th></th>
            {stats.map((s) => {
              runningTotals[s.key] = 0;
              return (
                <th
                  key={`stats-${s.key}`}
                  className="font-normal border p-2 bg-slate-100"
                >
                  <span className="font-semibold">{s.label}</span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {batches.map((b) => {
            return (
              <tr key={`batch-${b._id}`}>
                <td className={`text-right border p-2 bg-slate-100`}>
                  <span className="font-semibold">
                    {b.name} #{b.batchNo}
                  </span>
                  <br />
                  <span className="text-slate-500">
                    {dtf.format(b.brewDate)}
                  </span>
                </td>
                {stats.map((s) => {
                  const val = getStatValue(s, b);
                  runningTotals[s.key] += val;
                  return (
                    <td
                      key={`stat-${s.key}-batch-${b._id}`}
                      className={`text-right font-mono text-base border p-2 bg-white ${
                        s.highlight ? "bg-red-50" : ""
                      }`}
                    >
                      {val.toPrecision(3)} {s.unit}
                    </td>
                  );
                })}
              </tr>
            );
          })}
          <tr>
            <td className={`font-semibold text-right border p-2 bg-slate-100`}>
              Average
            </td>
            {stats.map((s) => {
              const val = runningTotals[s.key] / batches.length;
              return (
                <td
                  key={`stat-${s.key}-batch-average`}
                  className={`text-right font-mono text-base border p-2 bg-white ${
                    s.highlight ? "bg-red-50" : ""
                  }`}
                >
                  {val.toPrecision(3)} {s.unit}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
      <ul></ul>
    </>
  );
}
