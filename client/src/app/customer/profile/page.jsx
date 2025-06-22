import CustomerNav from "@/components/CustomerNav";
import CustomerPersonalProfile from "@/components/CustomerPersonalProfile";
import React from "react";

export default function page() {
  return (
    <div>
      <CustomerNav />
      <CustomerPersonalProfile />
    </div>
  );
}
