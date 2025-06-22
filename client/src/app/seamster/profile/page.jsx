import TailorNav from "@/components/TailorNav";
import TailorProfile from "@/components/TailorProfile";
import React from "react";
import TailorPersonalProfile from "@/components/TailorPersonalProfile";
import { ReviewForm } from "@/components/ReviewForm";

export default function page() {
  return (
    <div>
      <TailorNav />
      <TailorPersonalProfile />
    </div>
  );
}
