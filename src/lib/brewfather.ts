import { revalidateTag } from "next/cache";
import { groupBy } from "@/lib/collections";

const BREWFATHER_API_DOMAIN = "https://api.brewfather.app/v1";
const FETCH_TAG = "brewfather";

const authString = Buffer.from(
  `${process.env.BREWFATHER_API_USER_ID}:${process.env.BREWFATHER_API_KEY}`
).toString("base64");

export const fetchBatches = async ({
  debug = false,
  clearCache = false,
}: {
  debug: boolean;
  clearCache: boolean;
}) => {
  type BatchStatus =
    | "planning"
    | "brewing"
    | "fermenting"
    | "conditioning"
    | "completed";
  interface ColoredBatch extends Brewfather.Batch {
    color: string;
  }

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

  const rawData = await fetchBrewfatherData<Brewfather.Batch[]>({
    endpoint: `/batches?include=${includes.join(",")}`,
    debug,
    clearCache,
  });

  const data = rawData.map((b) => {
    let batch: ColoredBatch;

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
  } = groupBy(data, (b: ColoredBatch) => b.status.toLowerCase());

  return {
    planning,
    brewing,
    fermenting,
    conditioning,
    completed,
  };
};

export const fetchFermentationStats = async ({
  debug,
  clearCache,
}: {
  debug: boolean;
  clearCache: boolean;
}) => {
  "use server";
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

  const rawData = await fetchBrewfatherData<Brewfather.Batch[]>({
    endpoint: `/batches?include=${includes.join(",")}`,
    debug,
    clearCache,
  });

  if (!rawData) {
    return {
      notFound: true,
    };
  }

  // Massage Data
  return (
    rawData
      // Filter Out planned batches
      .filter((b) => b.status !== "Planning")
      // bubble up some recipe properties to the root of the batch object
      .map(({ recipe, ...batch }) => ({
        styleName: recipe.style.name,
        boilTime: recipe.boilTime,
        ...batch,
      }))
      // Sort by brew date ASC
      .sort((a, b) => a.brewDate - b.brewDate)
  );
};

const fetchBrewfatherData = async <T>({
  endpoint,
  debug = false,
  clearCache = false,
}: {
  endpoint: string;
  debug: boolean;
  clearCache: boolean;
}): Promise<T> => {
  "use server";

  if (clearCache) {
    revalidateTag(FETCH_TAG);
  }

  const res = await fetch(
    `${BREWFATHER_API_DOMAIN}${debug ? "/batches?complete=true" : endpoint}`,
    {
      headers: {
        authorization: `Basic ${authString}`,
      },
      next: {
        revalidate: 3600,
        tags: [FETCH_TAG],
      },
    }
  );

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();

  if (debug) {
    console.log(data);
  }

  return data;
};
