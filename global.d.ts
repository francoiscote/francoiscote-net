declare namespace Brewfather {
  interface Batch {
    _id: string;
    batchFermentables: Fermentable[];
    batchHops: Hops[];
    batchNo: number;
    batchNotes: string;
    batchYeasts: Yeast[];
    boilTime: number;
    bottlingDate: number;
    brewDate: number;
    estimatedColor: number;
    estimatedFg: number;
    estimatedIbu: number;
    estimatedTotalGravity: number;
    hidden: boolean;
    measuredAbv: number;
    measuredAttenuation: number;
    measuredBatchSize: number;
    measuredBoilSize: number;
    measuredBottlingSize: number;
    measuredConvertionEfficiency: number;
    measuredEfficiency: number;
    measuredFermenterTopUp: number;
    measuredFg: number;
    measuredKettleEfficiency: number;
    measuredKettleSize: number;
    measuredMashEfficiency: number;
    measuredMashPh: number;
    measuredOg: number;
    measuredPostBoilGravity: number;
    measuredPreBoilGravity: number;
    notes: string;
    recipe: Recipe;
    status: string;
    tasteNotes: string;
    tasteRating: number;
  }

  interface Fermentable {
    name: string;
    amount: number;
  }

  interface Hops {
    name: string;
    amount: number;
  }

  interface Yeast {
    name: string;
    laboratory: string;
    productId: string;
    amount: number;
  }

  interface Recipe {
    boilTime: number;
    style: {
      name: string;
    };
  }
}
