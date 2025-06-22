"use client";
import React from "react";
import Image from "next/image";
import TailorNav from "@/components/TailorNav";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import OrderDetail from "@/components/OrderDetail";
import { Trash2 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import CustomerNav from "@/components/CustomerNav";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { sendNotification } from "@/utils/notificationUtils";

export default function CustomerOrders() {
  const { toast } = useToast();
  const { user } = useAuth();
  const user_id = user?._id;
  const [orders, setOrders] = useState(null);
  const [sortField, setSortField] = useState("created_at");

  useEffect(() => {
    if (user_id) {
      fetch(
        `http://localhost:8080/api/orders/customer/${user_id}?sort=${sortField}`
      )
        .then((res) => res.json())
        .then((data) => {
          data?.map((order) => {
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
            order.post_id.required_by = formattedRequiredBy;
            order.created_at = formattedPlacedAt;
          });
          setOrders(data);
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
  // const handleStatusChange = async (value, order_id) => {
  //   console.log(value, order_id);
  //   try {
  //     const response = await fetch(
  //       `http://localhost:8080/api/orders/${order_id}`,
  //       {
  //         method: "PUT",
  //         credentials: "include",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ order_status: value }),
  //       }
  //     );
  //     if (response.ok) {
  //       showToast("Status updated successfully", "success");
  //       setOrders((prevOrders) =>
  //         prevOrders.map((order) =>
  //           order._id === order_id ? { ...order, order_status: value } : order
  //         )
  //       );
  //     }
  //   } catch (error) {
  //     showToast(error.message, "destructive");
  //   }
  // };

  const handleDeleteOrder = async (order) => {
    const order_id = order?._id;
    try {
      const response = await fetch(
        `http://localhost:8080/api/orders/${order?._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (response.ok) {
        await sendNotification(
          user_id,
          order.seamster_id._id,
          "negative",
          `The order for ${
            order.post_id.fabric + " " + order.post_id.title
          } has been cancelled by the customer.`
        );
        showToast("Order deleted successfully", "success");
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== order_id)
        );
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
      <CustomerNav />{" "}
      <div className="w-screen flex flex-col px-[7rem] py-[2rem]">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-end">
            <div>
              <div className=" font-semibold text-neutral-800">Your Orders</div>
              <div className="text-sm text-neutral-500">
                Here are the list of orders you have placed till date
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
                  <SelectItem value="price" className="text-neutral-600">
                    Sort By: Price
                  </SelectItem>
                  <SelectItem
                    value="created_at"
                    variant="outline"
                    className="text-neutral-600"
                  >
                    Sort By: Placed At
                  </SelectItem>
                  <SelectItem
                    value="order_status"
                    variant="outline"
                    className="text-neutral-600"
                  >
                    Sort By: Status
                  </SelectItem>

                  {/* <SelectItem value="">Customer Name</SelectItem> */}
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
                          Seamster name
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
                          Status
                        </th>
                      </tr>
                    </thead>
                    {/* <ScrollArea className="w-full"> */}
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
                                    src={
                                      order.seamster_id?.profile_picture?.path
                                    }
                                    alt="Profile Picture"
                                  />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-gray-700">
                                  {order.seamster_id?.first_name +
                                    " " +
                                    order.seamster_id?.last_name}
                                </div>
                                <div className="mt-1 text-gray-500 text-sm">
                                  {order.seamster_id?.address.city}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-5 text-base text-gray-700 rounded-full text-lg font-medium text-gray-500">
                            {/* <Dialog>
                              <DialogTrigger asChild> */}
                            {/* <Button
                              variant="ghost"
                              className="text-gray-700 rounded-full text-lg font-medium"
                            > */}
                            {order?.post_id?.fabric +
                              " " +
                              order?.post_id?.title}
                            {/* </Button> */}
                            {/* </DialogTrigger>
                              <DialogContent className="max-w-[50rem] h-[35rem] p-0">
                                <OrderDetail order={order} />
                              </DialogContent>
                            </Dialog> */}
                          </td>
                          <td className="whitespace-nowrap px-3 py-5 text-lg font-medium text-gray-700">
                            NPR {order?.price}
                          </td>
                          <td className="whitespace-nowrap px-3 py-5  text-gray-500">
                            {order?.created_at}
                          </td>
                          <td className="whitespace-nowrap px-3 py-5 text-base text-gray-500">
                            {order.order_status === "cancelled" ? (
                              <Badge variant="destructive">Cancelled</Badge>
                            ) : order.order_status === "in-progress" ? (
                              <Badge variant="secondary">In-progress</Badge>
                            ) : (
                              <Badge variant="default">Completed</Badge>
                            )}
                          </td>
                          <td>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost">
                                  <Trash2 size={24} />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    You are about to cancel/delete this Order.
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-600 hover:bg-red-500"
                                    onClick={() => handleDeleteOrder(order)}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </td>
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
