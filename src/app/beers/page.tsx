import Link from "next/link";
import { capitalize } from "@/lib/strings";

import { fetchBatches } from "@lib/brewfather";
import { BeerCard } from "@components/Beers/BeerCard";

export default async function Page({ searchParams }) {
  const data = await fetchBatches({
    debug: searchParams.debug,
    clearCache: searchParams.clearCache,
  });
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
