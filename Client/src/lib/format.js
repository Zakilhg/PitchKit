const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const formatCurrency = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? usdFormatter.format(amount) : "$0.00";
};
