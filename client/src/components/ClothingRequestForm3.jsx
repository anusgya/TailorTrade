"use client";
import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function ClothingRequestForm1() {
  const [biddingDeadline, setbiddingDeadline] = useState(""); // Initialize with current date
  const [requiredByDate, setRequiredByDate] = useState(""); // Initialize with current date

  return (
    <div className="grid space-y-2 max-w-  gap-1.5 items-center flex-col ">
      <div>
        <Label htmlFor="bidding-deadline">Bidding's open until</Label>
        <Popover id="bidding-deadline">
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !biddingDeadline && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {biddingDeadline ? (
                format(biddingDeadline, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={biddingDeadline}
              onSelect={setbiddingDeadline}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Label htmlFor="apparel-deadline">Apparel required by</Label>
        <Popover id="apparel-deadline">
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !requiredByDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {requiredByDate ? (
                format(requiredByDate, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={requiredByDate}
              onSelect={setRequiredByDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      {/* <Button>Create Post</Button> */}
    </div>
  );
}
