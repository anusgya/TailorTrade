"use client";

import React from "react";
import Image from "next/image";
import TailorNav from "@/components/TailorNav";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Scroll } from "@phosphor-icons/react/dist/ssr";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Bids() {
  const { user } = useAuth();
  const user_id = user?._id;
  const { toast } = useToast();

  const [bids, setBids] = useState(null);
  const [bidsWon, setBidsWon] = useState(0);
  const [sortField, setSortField] = useState("bid_amount");

  let dateOptions = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const showToast = (message, variant) => {
    toast({
      title: message,
      variant: variant,
    });
  };

  useEffect(() => {
    if (user_id) {
      fetch(
        `http://localhost:8080/api/bids/seamster/${user_id}?sort=${sortField}`
      )
        .then((res) => res.json())
        .then((data) => {
          let bidsWonCount = 0;

          data.map((bid) => {
            const createdAt = new Date(bid.created_at);
            let formattedCreatedAt = createdAt.toLocaleDateString(
              "en-US",
              dateOptions
            );
            bid.created_at = formattedCreatedAt;
            if (bid.is_accepted) {
              bidsWonCount = bidsWonCount + 1;
            }
          });
          setBids(data);
          setBidsWon(bidsWonCount++);
        })
        .catch((error) => {
          console.error("Error fetching bids:", error);
        });
    }
  }, [user_id, sortField]);

  const handleDeleteBid = async (bid_id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/bids/${bid_id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        showToast("Bid deleted successfully", "success");
        setBids(bids.filter((bid) => bid._id !== bid_id));
      } else {
        console.log("error deleting order");
      }
    } catch (error) {
      console.log("Error deleting order:", error);
      showToast(error.message, "destructive");
    }
  };
  return (
    <div className="w-screen h-screen">
      <TailorNav />{" "}
      <div className="bg-neutral-100 flex gap-[5rem] items-center justify-center rounded-lg w-full px-[10rem] py-[4rem]">
        <div className="w-full flex flex-col gap-[5rem] items-between ">
          <div className="flex flex-col items-center gap-2">
            <div className="font-bold text-5xl">{bids?.length}</div>
            <div className="font-medium text-md text-neutral-500">
              Total Bids Made
            </div>
          </div>
          {/* <div className="flex flex-col items-center gap-2">
              <div className="font-bold text-5xl">4.7⭐️</div>
              <div className="font-medium text-md text-neutral-500">
                Average User Rating
              </div>
            </div> */}
        </div>
        <div className="w-full flex gap-[5rem] flex-col justify-between ">
          <div className="flex flex-col items-center gap-2">
            <div className="font-bold text-5xl">{bidsWon}</div>
            <div className="font-medium text-md text-neutral-500">
              Total Bids Won
            </div>
          </div>
          {/* <div className="flex flex-col items-center gap-2">
              <div className="font-bold text-5xl">3</div>
              <div className="font-medium text-md text-neutral-500">
                Repeating Customers
              </div>
            </div> */}
        </div>
        <div className="w-full flex flex-col gap-[5rem] justify-between ">
          <div className="flex flex-col items-center gap-2">
            <div className="font-bold text-5xl">
              {bids && bids.length > 0
                ? `${Math.floor((bidsWon / bids.length) * 100)} %`
                : "0 %"}
            </div>
            <div className="font-medium text-md text-neutral-500">
              Success Rate
            </div>
          </div>
          {/* 
            <div className="flex flex-col items-center gap-2">
              <div className="font-bold text-5xl">Rs 34,000</div>
              <div className="font-medium text-md text-neutral-500">
                Total revenue generated
              </div>
            </div> */}
        </div>
      </div>
      <div className="w-screen flex flex-col px-[7rem] py-[2rem] gap-[3rem]">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <div>
              <div className="text-lg font-medium text-neutral-800">
                All Bids
              </div>
              <div className="text-sm text-neutral-500">
                Here is the list of all the bids you have placed till date
              </div>
            </div>
            <Select
              value={sortField}
              onValueChange={(value) => setSortField(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={"Sort By"} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="bid_amount" variant="outline">
                    Sort By: Bid amount
                  </SelectItem>
                  <SelectItem value="is_accepted" variant="outline">
                    Sort By: Status
                  </SelectItem>
                  {/* <SelectItem value="">Customer Name</SelectItem> */}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <ScrollArea>
            <div className=" flow-root border border-neutral-200 rounded-lg px-10 py-4">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-base font-medium text-gray-600 sm:pl-0"
                        >
                          Request By
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-base font-medium text-gray-600"
                        >
                          Request For
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-base font-medium text-gray-600"
                        >
                          Offered Price
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-base font-medium text-gray-600"
                        >
                          Bid on
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-base font-medium text-gray-600"
                        >
                          Status
                        </th>
                      </tr>
                    </thead>
                    {/* <ScrollArea className="w-full"> */}
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {bids?.map((bid) => (
                        <tr key={bid._id}>
                          <td className="whitespace-nowrap py-5 pl-4 pr-3 text-base sm:pl-0">
                            <div className="flex items-center">
                              <div className="h-12 w-12 rounded-full bg-neutral-200 overflow-hidden">
                                <div className="relative w-full h-full">
                                  <Image
                                    layout="fill"
                                    className="rounded-full object-cover"
                                    src={
                                      bid.post_id?.user?.profile_picture.path
                                    }
                                    alt="Profile Picture"
                                  />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-gray-700">
                                  {bid.post_id?.user?.first_name +
                                    " " +
                                    bid.post_id?.user?.last_name}
                                </div>
                                <div className="mt-1 text-gray-500 text-sm">
                                  {bid.post_id?.user?.address.city}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-5 text-base text-gray-500">
                            <div className="text-gray-700 text-lg font-medium">
                              {bid.post_id?.title}
                            </div>
                            {/* <div className="mt-1 text-gray-500">{order.type}</div> */}
                          </td>
                          <td className="whitespace-nowrap px-3 py-5 text-lg font-medium text-gray-700">
                            NPR {bid.bid_amount}
                          </td>
                          <td className="whitespace-nowrap px-3 py-5  text-gray-500">
                            {bid.created_at}
                          </td>
                          <td className="whitespace-nowrap px-3 py-5 text-base text-gray-500">
                            <Badge
                              variant={
                                bid.is_accepted ? "default" : "destructive"
                              }
                            >
                              {bid.is_accepted ? "Accepted" : "Pending"}
                            </Badge>
                          </td>
                          <td>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  // onClick={() => handleDeleteOrder(order._id)}
                                >
                                  <Trash2 size={24} />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    You are about to delete your bid.
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    You cannot undo this action
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-600 hover:bg-red-500"
                                    onClick={() => handleDeleteBid(bid._id)}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </td>

                          {/* <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-base font-medium sm:pr-0">
              <a
                href="#"
                className="text-indigo-600 hover:text-indigo-900"
              >
                Edit<span className="sr-only">, {person.name}</span>
              </a>
            </td> */}
                        </tr>
                      ))}
                    </tbody>
                    {/* </ScrollArea> */}
                  </table>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
