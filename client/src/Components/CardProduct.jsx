import { Link } from "react-router-dom";
import { IoTimeOutline } from "react-icons/io5";
import validUrl from "../utils/validUrlConvert";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import AddToCartButton from "./AddToCartButton";

const formatCardPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

const getDeliveryMins = (id = "") => {
  const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return 8 + (hash % 7);
};

const DiscountBadge = ({ discount }) => (
  <div
    className="absolute left-1.5 top-0 z-20 flex min-w-[26px] flex-col items-center justify-start bg-[#3b82d9] px-1 pb-2 pt-1 text-center text-[8px] font-bold uppercase leading-[9px] text-white"
    style={{
      clipPath:
        "polygon(0 0, 100% 0, 100% 84%, 87.5% 100%, 75% 84%, 62.5% 100%, 50% 84%, 37.5% 100%, 25% 84%, 12.5% 100%, 0 84%)",
    }}
  >
    <span>{discount}%</span>
    <span>OFF</span>
  </div>
);

const CardProduct = ({ data, width, fluid = false }) => {
  const url = `/product/${validUrl(data.name)}-${data._id}`;
  const hasDiscount = data.discount > 0;
  const deliveryMins = getDeliveryMins(data._id);
  const salePrice = pricewithDiscount(data.price, data.discount);

  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-xl border border-[#eef0f2] bg-white ${
        fluid ? "min-w-0 w-full max-w-none" : "min-w-[148px] max-w-[176px]"
      }`}
      style={width && !fluid ? { width, minWidth: 0, maxWidth: width } : undefined}
    >
      {hasDiscount && <DiscountBadge discount={data.discount} />}

      <div className="flex flex-col p-3">
      <Link to={url} className="relative mb-2 block aspect-square w-full">
        <img
          src={data?.image?.[0]}
          alt={data.name}
          className="h-full w-full object-contain"
        />
      </Link>

      <div className="mb-1.5 flex w-fit items-center gap-1 rounded-full bg-[#f3f4f6] px-2 py-0.5">
        <IoTimeOutline size={11} className="text-gray-600" />
        <span className="text-[9.5px] font-semibold uppercase tracking-wide text-gray-700">
          {deliveryMins} mins
        </span>
      </div>

      <Link to={url} className="mb-0.5 line-clamp-2 text-xs font-semibold leading-4 text-gray-900">
        {data.name}
      </Link>

      <p className="mb-3 text-xs text-gray-500">{data.unit || "1 pc"}</p>

      <div className="mt-auto flex items-end justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-bold leading-tight text-gray-800">
            {formatCardPrice(salePrice)}
          </p>
          {hasDiscount && (
            <p className="text-[9px] text-gray-400 line-through">
              {formatCardPrice(data.price)}
            </p>
          )}
        </div>

        <div className="shrink-0">
          {data.stock === 0 ? (
            <span className="inline-block rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] font-bold uppercase text-red-600">
              Out
            </span>
          ) : (
            <AddToCartButton data={data} outlined compact />
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default CardProduct;
