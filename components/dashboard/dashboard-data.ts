import { CircleCheckBig, DollarSign, TriangleAlert, Wallet } from "lucide-react";

export const stats = [
  {
    title: "Revenue",
    value: "$18,240",
    change: "+12.4%",
    description: "vs last month",
    icon: DollarSign,
  },
  {
    title: "Outstanding",
    value: "$4,380",
    change: "3 invoices",
    description: "awaiting payment",
    icon: Wallet,
  },
  {
    title: "Paid",
    value: "24",
    change: "+4",
    description: "this month",
    icon: CircleCheckBig,
  },
  {
    title: "Overdue",
    value: "2",
    change: "$1,250",
    description: "requires action",
    icon: TriangleAlert,
  },
];