"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UpdateProfile({ userData }) {
  const { toast } = useToast();
  const router = useRouter();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    province: "",
    city: "",
    street: "",
    profile_picture: null,
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        province: userData.address?.province || "",
        city: userData.address?.city || "",
        street: userData.address?.street || "",
        profile_picture: null,
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const showToast = (message, variant) => {
    toast({
      title: message,
      variant: variant,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Handle address separately
    formDataToSend.append("province", formData.province);
    formDataToSend.append("city", formData.city);
    formDataToSend.append("street", formData.street);

    if (formData.profile_picture) {
      formDataToSend.append("profile_picture", formData.profile_picture);
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/users/${userData._id}`,
        {
          method: "PUT",
          body: formDataToSend,
          credentials: "include",
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        showToast("Profile updated successfully", "success");
      } else {
        const error = await response.json();
        showToast(error.message || "Failed to update profile", "destructive");
      }
    } catch (error) {
      console.log(error);
      showToast("An error occurred. Please try again later.", "destructive");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <form
        className="w-full max-w-md flex flex-col items-center"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col px-4 justify-center w-full space-y-6">
          <div className="flex flex-col justify-center items-center">
            <div className="grid w-full space-y-4 items-center gap-1.5">
              <div>
                <Label htmlFor="first_name">Firstname</Label>
                <Input
                  type="text"
                  id="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="last_name">Lastname</Label>
                <Input
                  type="text"
                  id="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="province">Province</Label>
                <Select
                  value={formData.address?.province}
                  onValueChange={(value) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      address: {
                        ...prevData.address,
                        province: value,
                      },
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a province" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="koshi">Province 1 - Koshi</SelectItem>
                      <SelectItem value="madhesh">
                        Province 2 - Madhesh
                      </SelectItem>
                      <SelectItem value="bagmati">
                        Province 3 - Bagmati
                      </SelectItem>
                      <SelectItem value="gandaki">
                        Province 4 - Gandaki
                      </SelectItem>
                      <SelectItem value="lumbini">
                        Province 5 - Lumbini
                      </SelectItem>
                      <SelectItem value="karnali">
                        Province 6 - Karnali
                      </SelectItem>
                      <SelectItem value="sudurpashchim">
                        Province 7 - Sudurpashchim
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  type="text"
                  id="city"
                  value={formData.address?.city}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="street">Street Address</Label>
                <Input
                  type="text"
                  id="street"
                  value={formData.address?.street}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <div className="flex focus-within:ring-black focus-within:ring-2 ring-offset-2 rounded">
                  <div className="border border-r-0 flex justify-center items-center px-2 border-gray-200 rounded-l w-16 text-gray-600">
                    +977
                  </div>
                  <Input
                    type="tel"
                    id="phone"
                    className="rounded-md focus-visible:ring-0 border-gray-200 border-l-0 rounded-l-none"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="profile_picture">Update profile picture</Label>
                <Input
                  type="file"
                  id="profile_picture"
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      profile_picture: e.target.files[0],
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between gap-1 mt-6 w-full">
          <Button type="submit" className="w-full">
            Update Profile
          </Button>
        </div>
      </form>
    </div>
  );
}
