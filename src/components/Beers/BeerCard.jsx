import { daysSince } from "../../lib/dates";
import { formatKiloGrams } from "../../lib/strings";

export const BeerCard = ({
  _id,
  brewDate,
  batchNo,
  batchFermentables,
  batchHops,
  batchYeasts,
  bottlingDate,
  color,
  estimatedIbu,
  measuredAbv,
  measuredBatchSize,
  measuredFg,
  measuredOg,
  name,
  recipe,
  status,
  tasteRating,
  tasteNotes,
}) => {
  const formatedBrewDate = new Date(brewDate).toDateString();
  const formatedBottlingDate = new Date(bottlingDate).toDateString();

  return (
    <article
      key={`batch-${batchNo}`}
      data-brewfather-id={_id}
      className="bg-gradient-to-br from-slate-100 to-slate-50 border border-gray-200 rounded-lg shadow-md p-4 md:p-6 mb-16"
    >
      <div className="md:grid grid-cols-12 gap-4 auto-rows-auto">
        <div className="md:hidden">
          <SupTitle>{recipe.name}</SupTitle>
          <h2 className="text-4xl">{name}</h2>
        </div>
        <div className="p-4 col-span-4">
          <div className="flex justify-center text-center">
            <BatchCircle number={batchNo} color={color} />
          </div>
          <div className="grid grid-cols-2 my-10 md:px-12 text-xl">
            {measuredAbv && (
              <div className="mb-6 text-xl text-center">
                {measuredAbv}&nbsp;
                <span className="font-semibold">%</span>
              </div>
            )}
            {estimatedIbu && (
              <div className="mb-6 text-xl text-center">
                <div>
                  {estimatedIbu}&nbsp;
                  <span className="font-semibold">IBU</span>
                </div>
              </div>
            )}
            {measuredOg && (
              <div className="text-center">
                {`${measuredOg}`.padEnd(5, 0)}&nbsp;
                <span className="font-semibold">OG</span>
              </div>
            )}
            {measuredFg && (
              <div className="text-center">
                {`${measuredFg}`.padEnd(5, 0)}&nbsp;
                <span className="font-semibold">FG</span>
              </div>
            )}
          </div>
          {tasteRating && (
            <div className="text-center mt-6">
              <StarRating rating={tasteRating} />
            </div>
          )}
        </div>
        <div className="p-4 col-span-8">
          <div className="hidden md:block">
            <SupTitle>{recipe.name}</SupTitle>
            <h2 className="">{name}</h2>
          </div>
          <div className="py-4 px-8 bg-white mb-8 border rounded-md">
            <ul className="md:flex text-center md:text-left justify-between">
              {status && (
                <div className="mb-6 md:mb-0">
                  <SupTitle>Status</SupTitle>
                  <div>
                    {status}
                    <StatusRelativeDate
                      status={status}
                      brewDate={brewDate}
                      bottlingDate={bottlingDate}
                    />
                  </div>
                </div>
              )}

              {measuredBatchSize && (
                <div className="mb-6 md:mb-0">
                  <SupTitle>Batch Size</SupTitle>
                  <div>{measuredBatchSize}L</div>
                </div>
              )}

              {formatedBrewDate && (
                <div className="mb-6 md:mb-0">
                  <SupTitle>Brew Date</SupTitle>
                  <div>{formatedBrewDate}</div>
                </div>
              )}
              {formatedBottlingDate && (
                <div>
                  <SupTitle>Bottling Date</SupTitle>
                  <div>{formatedBottlingDate}</div>
                </div>
              )}
            </ul>
          </div>

          <div className="md:grid grid-cols-3 gap-10 mb-6" role="list">
            <div className="mb-6 md:mb-0">
              <h3 className="text-lg tracking-normal uppercase font-semibold mb-2">
                Fermentables
              </h3>
              <ul className="text-sm">
                {batchFermentables.map((y) => (
                  <IngredientItem
                    item={y.name}
                    quantity={formatKiloGrams(y.amount)}
                    key={y.name}
                  />
                ))}
              </ul>
            </div>
            <div className="mb-6 md:mb-0">
              <h3 className="text-lg tracking-normal uppercase font-semibold mb-2">
                Hops
              </h3>
              <ul className="text-sm">
                {batchHops.map((y) => (
                  <IngredientItem
                    item={y.name}
                    quantity={`${y.amount}g`}
                    key={y.name}
                  />
                ))}
              </ul>
            </div>
            <div className="mb-6 md:mb-0">
              <h3 className="text-lg tracking-normal uppercase font-semibold mb-2">
                Yeasts
              </h3>
              <ul className="text-sm">
                {batchYeasts.map((y) => (
                  // { y.laboratory } — {y.name} {y.productId ? ` (${y.productId})` : ``}

                  <IngredientItem
                    item={`${y.laboratory} - ${y.name} ${
                      y.productId ? `(${y.productId})` : ``
                    }`}
                    key={y.name}
                  />
                ))}
              </ul>
            </div>
          </div>
          {/* {tasteNotes && (
            <div className="mt-9">
              <h2 className="text-2xl tracking-normal uppercase font-semibold mb-3">
                Notes
              </h2>
              <p>{tasteNotes}</p>
            </div>
          )} */}
          {/* {batchNotes && (
            <>
              <h3 className="text-base tracking-normal uppercase font-semibold">
                Notes
              </h3>{" "}
              <div style={{ whiteSpace: "pre-wrap" }}>{batchNotes}</div>
              </>
          )} */}
        </div>
      </div>
    </article>
  );
};

const StatusRelativeDate = ({ status, brewDate, bottlingDate }) => {
  const nbDays =
    status === "Fermenting"
      ? daysSince(brewDate)
      : ["Conditioning", "Completed"].includes(status)
      ? daysSince(bottlingDate)
      : null;

  if (!nbDays) {
    return null;
  }

  const unit = nbDays > 1 ? "days" : "day";

  return (
    <span className="text-slate-400">
      {" "}
      - {nbDays} {unit}
    </span>
  );
};

/**
 * the rating we receive from BrewFather is a value between 0 and 100
 * we want to convert this to a five star system with one decimal (ie: a score of 3.6/5.0)
 */
const StarRating = ({ rating }) => {
  const baseFiveRating = Math.round(rating / 10) / 2;
  const baseTenRating = rating / 20;
  const formatedRating = Number(baseTenRating).toFixed(1);
  return (
    <div className="text-xl text-slate-300">
      {[...Array(5)].map((star, index) => {
        index += 1;
        const starClass =
          index <= baseFiveRating
            ? "text-yellow-500"
            : index <= baseFiveRating + 0.5
            ? "half-star"
            : "";
        return (
          <span key={index} className={starClass}>
            &#9733;
          </span>
        );
      })}
      <div className="text-sm mx-1">({formatedRating})</div>
    </div>
  );
};

const BatchCircle = ({ color, number, className, ...restProps }) => {
  return (
    <div
      className={`relative flex justify-center items-center w-40 lg:w-52 h-40 lg:h-52 bg-gray-300 rounded-full drop-shadow text-center text-7xl md:text-9xl font-bold ${className}`}
      style={{ backgroundColor: color }}
      {...restProps}
    >
      <div className="mix-blend-overlay text-white opacity-40">
        <div className="absolute inset-y-1/3 left-1/4 text-2xl md:text-3xl font-semibold align-sub -mt-8">
          #
        </div>
        {number}
      </div>
    </div>
  );
};

const SupTitle = ({ children, className, ...restProps }) => (
  <div
    className={`uppercase text-gray-400 md:text-sm font-semibold md:mb-2 ${className}`}
    {...restProps}
  >
    {children}
  </div>
);

const IngredientItem = ({ item, quantity, ...props }) => (
  <li className="flex justify-between mb-2" {...props}>
    <span className={quantity ? "flex-shrink-0" : ""}>{item}</span>
    {quantity && (
      <>
        <span className="flex-shrink overflow-hidden text-slate-300  mx-4">
          ..........................................................
        </span>
        <span className="flex-shrink-0 text-slate-400">{quantity}</span>
      </>
    )}
  </li>
);
