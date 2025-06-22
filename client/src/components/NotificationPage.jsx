import React from "react";

import { BellRing, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Switch } from "@/components/ui/switch";

const notifications = [
  {
    title: "Your order has been completed",
    description: "1 hour ago",
  },
  {
    title: "Your order has been cancelled",
    description: "1 hour ago",
  },
  {
    title: "Your bid was accepted by Customer1",
    description: "2 hours ago",
  },
];

function NotificationPage() {
  return (
    <div>
      <div>
        {notifications.map((notification, index) => (
          <div
            key={index}
            className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
          >
            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                {notification.title}
              </p>
              <p className="text-sm text-muted-foreground">
                {notification.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationPage;
