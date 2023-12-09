import Link from "next/link";

import { groupBy } from "@lib/collections";
import { capitalize } from "@lib/strings";

import { BeerCard } from "@components/Beers/BeerCard";

const BREWFATHER_API_DOMAIN = "https://api.brewfather.app/v1";

const authString = Buffer.from(
  `${process.env.BREWFATHER_API_USER_ID}:${process.env.BREWFATHER_API_KEY}`
).toString("base64");

const headers = {
  authorization: `Basic ${authString}`,
};

const includes = [
  "batchNotes",
  "batchFermentables",
  "batchHops",
  "batchYeasts",
  "bottlingDate",
  "estimatedColor",
  "estimatedIbu",
  "notes",
  "measuredAbv",
  "measuredBatchSize",
  "measuredFg",
  "measuredOg",
  "recipe.style.name",
  "status",
  "tasteRating",
  "tasteNotes",
];

// prettier ignore because I want to force the quotes
// on properties names, because they are IDs
// prettier-ignore
const batchesColors = {
  gY2KZyKLFhQxktMJcGjvs4mF0D3TUI: "#da9cdf",
  KF4QB9uONI0xlmGZlFDMkSdynNAstr: "#a16452",
  WBkgeGLkfkwNOSV9pnD3zS6UkaTWou: "#ebc94f",
  i2E4ooAkLp8tkjKc1MCfygHvpRBB0N: "#f5b290",
  kCtZyLhBhBbSoNiIl8GkFiYXoCVQ8s: "#8aab60",
  "2znilKPnYjmF6rLhAARCBuAkOdaOXM": "#a16452",
  wT4VAk3t1uaZiWVpBd4wo0ZmecK3Ih: "#301E18",
  jJHVCzgXk5OebF6m9FppFbYSSOLvbL: "#F3DE95",
};

async function getData() {
  // todo: use query params
  const isDebug = false;

  const endpoint = isDebug
    ? `/batches?complete=true`
    : `/batches?include=${includes.join(",")}`;

  const res = await fetch(`${BREWFATHER_API_DOMAIN}${endpoint}`, {
    headers,
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  const rawData = await res.json();

  const data = rawData.map((b, i) => {
    let batch = {};

    // Add Color data data to the beer
    batch = {
      ...b,
      color: batchesColors[b._id] || null,
    };

    // Order Fermentables by Amount Descending
    batch.batchFermentables.sort((a, b) => {
      return b.amount - a.amount;
    });
    // Order Fermentables by Amount Descending
    batch.batchHops.sort((a, b) => {
      return b.amount - a.amount;
    });

    return batch;
  });

  // Group by Status
  const {
    planning = [],
    brewing = [],
    fermenting = [],
    conditioning = [],
    completed = [],
  } = groupBy(data, (b) => b.status.toLowerCase());

  return {
    planning,
    brewing,
    fermenting,
    conditioning,
    completed,
  };
}

export default async function Page() {
  const data = await getData();
  const statuses = Object.keys(data);

  return (
    <>
      <h1>Beers 🍻</h1>
      <p className="lead">
        Sometimes, I brew beer.
        <br />
        Here is a live view of what is brewing based on the{" "}
        <a href="https://brewfather.app/?via=694b06">Brewfather</a>
        <span className="text-slate-400">*</span> API.
      </p>

      <p>
        You can also have a look at the detailed{" "}
        <Link href="/beers/fermentation-stats">fermentation stats</Link> I use
        to calibrate my equipment profile.
      </p>

      <p className="text-right text-xs text-slate-400">
        * This is an affiliate link, but I truly love this product
      </p>
      {statuses.map((s, i) => {
        const beers = data[s];

        if (!beers.length) {
          return false;
        }

        return (
          <section key={`status-${s}`} className="mt-20">
            <h3 className="mb-10">{capitalize(s)}</h3>
            {beers.map((b, i) => (
              <BeerCard key={`beer-${i}`} {...b} />
            ))}
          </section>
        );
      })}
    </>
  );
}
