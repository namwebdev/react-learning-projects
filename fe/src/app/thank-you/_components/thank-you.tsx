"use client";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { OrderResponse } from "@/types";
import {
  CheckCircle2,
  Clock,
  Inbox,
  Key,
  XCircle,
  CreditCard,
} from "lucide-react";

type OrderStatus = "created" | "paid";

export const ThankYou = ({ order }: { order: OrderResponse }) => {
  const status = order.transaction?.status as OrderStatus;
  if (!status)
    return (
      <div>
        <p>Invalid order status</p>
      </div>
    );

  const currentStatus = generateThankYouPageData(status);
  const { customer, transaction } = order;

  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      {/* Status Header */}
      <div
        className={cn(
          "flex flex-col items-center text-center p-8 border-b",
          currentStatus.bgColor,
          currentStatus.borderColor
        )}
      >
        <currentStatus.icon
          className={cn("w-16 h-16 mb-4", currentStatus.color)}
        />

        <h1 className="text-2xl font-bold mb-2">{currentStatus.title}</h1>
        <p className="text-muted-foreground">{currentStatus.description}</p>

        {status === "paid" && (
          <div className="mt-4 flex items-center gap-2 text-sm bg-blue-50 text-blue-700 px-4 py-2 rounded-full border border-blue-100">
            <Inbox className="w-4 h-4" />
            <span>
              Check <b>{customer.email}</b> for your license key
            </span>
          </div>
        )}
      </div>

      <div className="p-6 md:p-8">
        {/* Order Information */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Key className="w-5 h-5" /> License Details
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Transaction Number
                </span>
                <span className="font-medium">{transaction._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">
                  {formatDate(transaction.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{customer?.email}</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" /> Payment Summary
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">
                  ${transaction.price.toFixed(2)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${transaction.price.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {status === "paid" && (
          <div className="mt-8 p-6 bg-slate-50 rounded-lg border">
            <h3 className="font-semibold mb-4">Next Steps:</h3>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>
                Check your email for the license key and joining instructions
              </li>
              <li>Follow the installation guide in your email to join group</li>
            </ol>
          </div>
        )}
      </div>
    </Card>
  );
};

function generateThankYouPageData(status: OrderStatus) {
  const statusConfig = {
    paid: {
      icon: CheckCircle2,
      title: "Thank You for Your Purchase!",
      description:
        "We've sent your license key and download joining to your email.",
      color: "text-green-600",
      bgColor: "bg-green-50/50",
      borderColor: "border-green-100",
    },
    created: {
      icon: Clock,
      title: "Payment Processing",
      description: "Please wait while we confirm your payment.",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50/50",
      borderColor: "border-yellow-100",
    },
    failed: {
      icon: XCircle,
      title: "Payment Failed",
      description:
        "There was an issue processing your payment. Please try again.",
      color: "text-red-600",
      bgColor: "bg-red-50/50",
      borderColor: "border-red-100",
    },
  };

  return statusConfig[status];
}

const formatDate = (dateInput: Date | string): string => {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

  const day = date.getDate().toString().padStart(2, "0");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};
