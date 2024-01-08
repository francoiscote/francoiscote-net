import Link from "next/link";

import { fetchFermentationStats } from "@/lib/brewfather";

export default async function Page({ searchParams }) {
  const batches = await fetchFermentationStats({
    debug: searchParams.debug,
    clearCache: searchParams.clearCache,
  });
  const stats = [
    {
      key: "recipeWater",
      label: "Recipe Mash Water",
      unit: "L",
      calculatedValue: (b) => b.recipe.data.mashWaterAmount,
    },
    {
      key: "recipeFermentables",
      label: "Recipe Mash Ferm. Amount",
      unit: "kg",
      calculatedValue: (b) => b.recipe.data.mashFermentablesAmount,
    },
    {
      key: "mashVolume",
      label: "Recipe Mash volume",
      unit: "L",
      calculatedValue: (b) => b.recipe.data.mashVolume,
    },
    {
      key: "grainWaterRatio",
      label: "Grain/Water Ratio (Calculated)",
      unit: "g/L",
      highlight: true,
      calculatedValue: (b) =>
        (b.recipe.data.mashFermentablesAmount / b.recipe.data.mashWaterAmount) * 1000,
    },
    {
      key: "recipePreBoilGravity",
      label: "Recipe Pre-Boil Gravity",
      unit: "",
      calculatedValue: (b) => b.recipe.preBoilGravity,
      precision: 4
    },
    {
      key: "preBoilGravity",
      label: "pre-Boil Gravity (Measured)",
      unit: "",
      calculatedValue: (b) => b.measuredPreBoilGravity,
      precision: 4
    },
    {
      key: "measuredBoilSize",
      label: "Pre-Boil Vol. (Hot)",
      unit: "L",
    },
    {
      key: "measuredMashEfficiency",
      label: "Mash Efficiency",
      unit: "%",
    },
    {
      key: "boilTime",
      label: "Boil Time",
      unit: "h",
      calculatedValue: (b) => b.recipe.boilTime / 60,
    },
    {
      key: "measuredKettleSize",
      label: "Post-Boil Vol. (Hot)",
      unit: "L",
    },
    {
      key: "boilEvaporation",
      label: "Boil-off Rate (Calculated)",
      unit: "L/h",
      highlight: true,
      calculatedValue: (b) =>
        (b.measuredBoilSize - b.measuredKettleSize) / (b.recipe.boilTime / 60),
    },
    {
      key: "measuredBatchSize",
      label: "Batch Vol.",
      unit: "L",
    },
    {
      key: "measuredBottlingSize",
      label: "Bottling Vol.",
      unit: "L",
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

      <table className="table-fixed w-full mb-12">
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
                    #{b.batchNo}
                  </span>
                  <br />
                  <span className="font-semibold text-slate-500">
                    {b.name}
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
                    val && (
                      <td
                        key={`stat-${s.key}-batch-${b._id}`}
                        className={`text-right font-mono text-base border p- ${
                          s.highlight ? "bg-red-50" : "bg-white"
                        }`}
                      >
                        {val.toPrecision(s.precision || 3)}{s.unit}
                      </td>
                    )
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
                  className={`text-right font-mono text-base border p- ${
                    s.highlight ? "bg-red-50" : "bg-white"
                  }`}
                >
                  {val.toPrecision(s.precision || 3)}{s.unit}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </>
  );
}
