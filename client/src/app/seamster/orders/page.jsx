"use client";
import React from "react";
import Image from "next/image";
import TailorNav from "@/components/TailorNav";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { sendNotification } from "@/utils/notificationUtils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import OrderDetail from "@/components/OrderDetail";
import CustomerProfile from "@/components/CustomerProfile";

export default function SeamsterOrders() {
  const { toast } = useToast();
  const { user } = useAuth();
  const user_id = user?._id;
  const [orders, setOrders] = useState(null);
  const [sortField, setSortField] = useState("created_at");
  const [completedOrders, setCompletedOrders] = useState(0);
  const [cancelledOrders, setCancelledOrders] = useState(0);
  const [inProgressOrders, setInProgressOrders] = useState(0);

  const handleStatusChange = async (value, order_id, order_title) => {
    console.log(value, order_id);
    try {
      const response = await fetch(
        `http://localhost:8080/api/orders/${order_id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ order_status: value }),
        }
      );
      if (response.ok) {
        await sendNotification(
          user_id,
          orders.find((order) => order._id === order_id).customer_id._id,
          value === "completed"
            ? "positive"
            : value === "cancelled"
            ? "negative"
            : "neutral",
          value === "completed"
            ? `Your order for ${order_title} is ready. Contact the seamster for delivery and payment details.`
            : value === "cancelled"
            ? `Your order for ${order_title} has been cancelled by the seamster. Contact them for further details.`
            : `Your order for ${order_title} is in progress.`
        );

        showToast("Status updated successfully", "success");
        setOrders((prevOrders) => {
          const newOrders = prevOrders.map((order) =>
            order._id === order_id ? { ...order, order_status: value } : order
          );

          const completedCount = newOrders.filter(
            (order) => order.order_status === "completed"
          ).length;
          const cancelledCount = newOrders.filter(
            (order) => order.order_status === "cancelled"
          ).length;
          const inProgressCount = newOrders.filter(
            (order) => order.order_status === "in-progress"
          ).length;

          setCompletedOrders(completedCount);
          setCancelledOrders(cancelledCount);
          setInProgressOrders(inProgressCount);

          return newOrders;
        });
      }
    } catch (error) {
      showToast(error.message, "destructive");
    }
  };

  useEffect(() => {
    if (user_id) {
      fetch(
        `http://localhost:8080/api/orders/seamster/${user_id}?sort=${sortField}`
      )
        .then((res) => res.json())
        .then((data) => {
          // Reset the counts before recalculating
          let completedCount = 0;
          let cancelledCount = 0;
          let inProgressCount = 0;

          const processedData = data.map((order) => {
            if (order.order_status === "completed") {
              completedCount++;
            } else if (order.order_status === "cancelled") {
              cancelledCount++;
            } else if (order.order_status === "in-progress") {
              inProgressCount++;
            }

            const placedAt = new Date(order.created_at);
            const requiredBy = new Date(order.post_id.required_by);
            let options = {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            };
            let formattedPlacedAt = placedAt.toLocaleDateString(
              "en-US",
              options
            );
            let formattedRequiredBy = requiredBy.toLocaleDateString(
              "en-US",
              options
            );
            return {
              ...order,
              post_id: {
                ...order.post_id,
                required_by: formattedRequiredBy,
              },
              created_at: formattedPlacedAt,
            };
          });

          setOrders(processedData);
          setCompletedOrders(completedCount);
          setCancelledOrders(cancelledCount);
          setInProgressOrders(inProgressCount);
          console.log("orders are these", processedData);
        })
        .catch((error) => {
          console.error("Error fetching orders:", error);
        });
    }
  }, [user_id, sortField]);

  const showToast = (message, variant) => {
    toast({
      title: message,
      variant: variant,
    });
  };

  return (
    <div className="w-screen h-screen">
      <TailorNav />{" "}
      <div className="bg-neutral-100 flex gap-[5rem] items-center justify-center rounded-lg w-full px-[10rem] py-[4rem]">
        <div className="w-full flex flex-col gap-[5rem] items-between ">
          <div className="flex flex-col items-center gap-2">
            <div className="font-bold text-5xl">
              {orders?.length > 0 ? orders.length : 0}
            </div>
            <div className="font-medium text-md text-neutral-500">
              Total Orders
            </div>
          </div>
        </div>
        <div className="w-full flex gap-[5rem] flex-col justify-between ">
          <div className="flex flex-col items-center gap-2">
            <div className="font-bold text-5xl">{inProgressOrders || 0}</div>
            <div className="font-medium text-md text-neutral-500">
              In-progress Orders
            </div>
          </div>
        </div>
        <div className="w-full flex gap-[5rem] flex-col justify-between ">
          <div className="flex flex-col items-center gap-2">
            <div className="font-bold text-5xl">{completedOrders || 0}</div>
            <div className="font-medium text-md text-neutral-500">
              Completed Orders
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col gap-[5rem] justify-between ">
          <div className="flex flex-col items-center gap-2">
            <div className="font-bold text-5xl">{cancelledOrders || 0}</div>
            <div className="font-medium text-md text-neutral-500">
              Cancelled Orders
            </div>
          </div>
        </div>
      </div>
      <div className="w-screen flex flex-col px-[7rem] py-[2rem]">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <div>
              <div className="text-lg font-medium text-neutral-800">
                All Orders
              </div>
              <div className="text-sm text-neutral-500">
                Here is the list of all the customers' orders{" "}
              </div>
            </div>
            <Select
              value={sortField}
              onValueChange={(value) => setSortField(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  placeholder={"Sort By"}
                  className="text-neutral-600"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="created_at" className="text-neutral-600">
                    Sort By: Placed At
                  </SelectItem>
                  <SelectItem
                    value="required_by"
                    variant="outline"
                    className="text-neutral-600"
                  >
                    Sort By: Required By
                  </SelectItem>
                  <SelectItem
                    value="first_name"
                    variant="outline"
                    className="text-neutral-600"
                  >
                    Sort By: Customer Name
                  </SelectItem>
                  <SelectItem
                    value="order_status"
                    variant="outline"
                    className="text-neutral-600"
                  >
                    Sort By: Status
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <ScrollArea>
            <div className=" flow-root border border-neutral-200 rounded-lg px-10 py-4">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 ">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6  lg:px-8">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-base font-medium text-gray-600 sm:pl-0"
                        >
                          Customer name
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-base font-medium text-gray-600"
                        >
                          Order title
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-base font-medium text-gray-600"
                        >
                          Price
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-base font-medium text-gray-600"
                        >
                          Placed at
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-base font-medium text-gray-600"
                        >
                          Required by
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-base font-medium text-gray-600"
                        >
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {orders?.map((order) => (
                        <tr key={order._id}>
                          <td className="whitespace-nowrap py-5 pl-4 pr-3 text-base sm:pl-0">
                            <div className="flex items-center">
                              <div className="h-12 w-12 rounded-full bg-neutral-200 overflow-hidden">
                                <div className="relative w-full h-full">
                                  <Image
                                    layout="fill"
                                    className="rounded-full object-cover"
                                    src={order.customer_id.profile_picture.path}
                                    alt="Profile Picture"
                                  />
                                </div>
                              </div>
                              <div className="ml-4">
                                <Sheet>
                                  <SheetTrigger>
                                    {" "}
                                    <div className="font-medium text-gray-700">
                                      {order.customer_id.first_name +
                                        " " +
                                        order.customer_id.last_name}
                                    </div>
                                  </SheetTrigger>
                                  <SheetContent className="w-[35rem] pr-12">
                                    <SheetDescription>
                                      <CustomerProfile
                                        customer={order.customer_id}
                                      />
                                    </SheetDescription>
                                  </SheetContent>
                                </Sheet>
                                <div className="mt-1 text-gray-500 text-sm">
                                  {order.customer_id.address.city}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-5 text-base text-gray-500">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="text-gray-700 rounded-full text-lg font-medium"
                                >
                                  {order.post_id.title}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-[50rem] h-[35rem] p-0">
                                <OrderDetail order={order} />
                              </DialogContent>
                            </Dialog>
                          </td>
                          <td className="whitespace-nowrap px-3 py-5 text-lg font-medium text-gray-700">
                            NPR {order.price}
                          </td>
                          <td className="whitespace-nowrap px-3 py-5  text-gray-600">
                            {order.created_at}
                          </td>
                          <td className="whitespace-nowrap px-3 py-5  text-gray-600">
                            {order.post_id.required_by}
                          </td>
                          <td className="whitespace-nowrap px-3 py-5 text-base text-gray-500">
                            <Select
                              value={order.order_status}
                              onValueChange={(value) =>
                                handleStatusChange(
                                  value,
                                  order._id,
                                  order.post_id.title
                                )
                              }
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue
                                  placeholder={
                                    <Badge variant={"outline"}>
                                      Select Status
                                    </Badge>
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem value="in-progress">
                                    <Badge variant="">In progress</Badge>
                                  </SelectItem>
                                  <SelectItem
                                    value="completed"
                                    variant="outline"
                                  >
                                    <Badge variant={"secondary"}>
                                      Completed
                                    </Badge>
                                  </SelectItem>
                                  <SelectItem value="cancelled">
                                    <Badge variant="destructive">
                                      Cancelled
                                    </Badge>
                                  </SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
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
