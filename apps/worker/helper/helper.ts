
export const formatCurrency = (amount: number) =>
new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
}).format(amount / 100);


 

export const formatDate = (date: Date) =>
new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
}).format(date);
