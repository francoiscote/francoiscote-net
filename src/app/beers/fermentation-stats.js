import Head from "next/head";
import Link from "next/link";
import NodeCache from "node-cache";

import { NavBar } from "@components/NavBar";

const BREWFATHER_API_DOMAIN = "https://api.brewfather.app/v1";
const CACHE_TTL = 5 * 60; // 5mins

const memoryCache = new NodeCache({ stdTTL: CACHE_TTL });

export async function getServerSideProps({ req, res, query }) {
  // https://nextjs.org/docs/going-to-production#caching
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=240"
  );

  const isDebug = query.hasOwnProperty("debug");

  const authString = Buffer.from(
    `${process.env.BREWFATHER_API_USER_ID}:${process.env.BREWFATHER_API_KEY}`
  ).toString("base64");

  const headers = {
    authorization: `Basic ${authString}`,
  };

  const includes = [
    "bottlingDate",
    "boilTime",
    "estimatedColor",
    "estimatedFg",
    "estimatedIbu",
    "estimatedTotalGravity",
    "measuredAbv",
    "measuredAttenuation",
    "measuredBatchSize",
    "measuredBoilSize",
    "measuredBottlingSize",
    "measuredConvertionEfficiency",
    "measuredEfficiency",
    "measuredFermenterTopUp",
    "measuredFg",
    "measuredKettleEfficiency",
    "measuredKettleSize",
    "measuredMashPh",
    "measuredMashEfficiency",
    "measuredOg",
    "measuredPreBoilGravity",
    "measuredPostBoilGravity",
    "recipe.style.name",
    "recipe.boilTime",
    "status",
  ];

  const endpoint = isDebug
    ? `/batches?complete=true`
    : `/batches?include=${includes.join(",")}`;

  const cachedBFData = memoryCache.get(endpoint);

  /**
   * -----------------------
   * Fetch Data
   * -----------------------
   */

  let rawData;
  // Maybe HIT Brewfather's API
  if (cachedBFData && !isDebug) {
    rawData = cachedBFData;
  } else {
    const response = await fetch(`${BREWFATHER_API_DOMAIN}${endpoint}`, {
      headers,
    });
    rawData = await response.json();
    memoryCache.set(endpoint, rawData);
  }

  if (isDebug) {
    console.log(rawData);
  }

  if (!rawData) {
    return {
      notFound: true,
    };
  }

  // Massage Data
  const returnedData = rawData
    // Filter Out planned batches
    .filter((b) => b.status !== "Planning")
    // bubble up some recipe properties to the root of the batch object
    .map(({ recipe, ...batch }) => ({
      styleName: recipe.style.name,
      boilTime: recipe.boilTime,
      ...batch,
    }));

  // Sort by brew date ASC
  returnedData.sort((a, b) => a.brewDate - b.brewDate);

  return {
    props: {
      batches: returnedData,
    },
  };
}

export default function BeersPage({ batches }) {
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
      calculatedValue: (b) => b.boilTime / 60,
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
      <Head>
        <title>Fermentation Stats - francoiscote.net</title>
      </Head>

      <NavBar />

      <main>
        <Link href="/beers">
          <a className="block mb-8">← Beers</a>
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
              <td
                className={`font-semibold text-right border p-2 bg-slate-100`}
              >
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
      </main>
    </>
  );
}
