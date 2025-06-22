"use client";

import React, { useState, useEffect } from "react";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { Bell } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare } from "lucide-react";
import Cookies from "js-cookie";
import { useAuth } from "@/context/AuthContext";
import io from "socket.io-client";
import { LogOutIcon, User } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import NotificationPage from "./NotificationPage";
import NotificationHandler from "./NotificationHandler";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function TailorNav() {
  const { user } = useAuth();
  const userId = user?._id;
  const currentPath = usePathname();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const newSocket = io("http://localhost:8080");
    setSocket(newSocket);

    console.log("fetching user id from notification handler", userId);
    fetchNotifications();

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (socket && userId) {
      socket.emit("user_connected", userId);

      socket.on("notification", (notification) => {
        console.log("notification received", notification);
        setNotifications((prevNotifications) => [
          notification,
          ...prevNotifications,
        ]);
      });

      return () => {
        socket.off("notification");
      };
    }
  }, [socket, userId]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/notifications/" + userId,
        {
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();

      console.log(
        "notificationooonnssssssss2983409------------------------",
        data
      );
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };
  // const currentPath = router.usePathname();

  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          <div className="mx-auto px-2 sm:px-4 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex px-2 lg:px-0">
                <div className="flex flex-shrink-0 items-center">
                  <span className="font-semibold text-neutral-700">Tailor</span>
                  <span className="font-semibold text-teal-900">trade</span>
                </div>
                <div className="hidden lg:ml-6 lg:flex lg:space-x-8">
                  <Link
                    href="/seamster/home"
                    onClick={() => console.log(currentPath)}
                    className={classNames(
                      currentPath === "/seamster/home"
                        ? "border-b-2 border-neutral-900 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                      "inline-flex items-center px-1 pt-1 text-sm font-medium"
                    )}
                  >
                    Home
                  </Link>
                  <Link
                    href="/seamster/bids"
                    // onClick={() => setActiveTab("statistics")}
                    className={classNames(
                      currentPath === "/seamster/bids"
                        ? "border-b-2 border-neutral-900 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                      "inline-flex items-center px-1 pt-1 text-sm font-medium"
                    )}
                  >
                    Bids
                  </Link>
                  <Link
                    href="/seamster/orders"
                    // onClick={() => setActiveTab("projects")}
                    className={classNames(
                      currentPath === "/seamster/orders"
                        ? "border-b-2 border-neutral-900 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                      "inline-flex items-center px-1 pt-1 text-sm font-medium"
                    )}
                  >
                    Orders
                  </Link>
                </div>
              </div>
              <div className="flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end"></div>
              <div className="flex items-center lg:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-neutral-900">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="hidden lg:ml-4 lg:flex gap-4 lg:items-center">
                <Sheet>
                  <SheetTrigger>
                    {" "}
                    <button
                      type="button"
                      className="relative flex-shrink-0 flex rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
                    >
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">View notifications</span>
                      <Bell className="h-6 w-6" aria-hidden="true" />
                      {notifications?.length > 0 && (
                        <span className="rounded-full absolute left-4 text-xs h-4 w-4 bg-red-500 text-neutral-100">
                          {notifications?.length}
                        </span>
                      )}
                    </button>
                  </SheetTrigger>
                  <SheetContent className="w-[27rem] ">
                    <SheetHeader>
                      <SheetTitle className="mb-6">Notifications</SheetTitle>
                      <SheetDescription>
                        <NotificationHandler
                          notifications={notifications}
                          setNotifications={setNotifications}
                          // setNotificationsLength={setTotalNotifications}
                        />
                      </SheetDescription>
                    </SheetHeader>
                  </SheetContent>
                </Sheet>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-4 flex-shrink-0">
                  <div>
                    <Menu.Button className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <div className="h-10 w-10 rounded-full bg-neutral-200 overflow-hidden">
                        <div className="relative w-full h-full">
                          <Image
                            layout="fill"
                            className="rounded-full object-cover"
                            src={
                              user?.profile_picture?.path ||
                              "/default-profile-picture.png"
                            }
                            alt="Profile Picture"
                          />
                        </div>
                      </div>
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/seamster/profile"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 font-medium flex gap-1 text-sm text-gray-700"
                            )}
                          >
                            <User className="h-5 w-5" />
                            Your Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/auth/login"
                            onClick={() => Cookies.remove("accessToken")}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm flex gap-1 font-medium text-gray-700"
                            )}
                          >
                            <LogOutIcon className="h-5 w-5" />
                            Log out
                          </Link>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
}
