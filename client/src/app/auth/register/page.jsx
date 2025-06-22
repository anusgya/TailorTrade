"use client";

import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Signup() {
  const [formNumber, setFormNumber] = useState(1);
  const buttonText = formNumber === 4 ? "Register" : "Next";
  const { toast } = useToast();
  const router = useRouter();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    user_role: "",
    email: "",
    password: "",
    phone: "",
    province: "",
    city: "",
    street: "",
    profile_picture: null,
    gender: "",
    image_type: "profilePic",
  });

  // const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    console.log(formData);
  };

  const handleGenderChange = (gender) => {
    setFormData({ ...formData, gender: gender });
  };

  const showToast = (message, variant) => {
    toast({
      title: message,
      variant: variant,
    });
  };

  const handleRoleChange = (role) => {
    setFormData({ ...formData, user_role: role });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setFormNumber(formNumber + 1);
  };

  const handlePrevious = (e) => {
    e.preventDefault();
    setFormNumber(formNumber - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("first_name", formData.first_name);
    formDataToSend.append("last_name", formData.last_name);
    formDataToSend.append("user_role", formData.user_role);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("province", formData.province);
    formDataToSend.append("city", formData.city);
    formDataToSend.append("street", formData.street);
    formDataToSend.append("gender", formData.gender);
    formDataToSend.append("image_type", formData.image_type);
    formDataToSend.append("profile_picture", formData.profile_picture);

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        const data = await response.json();
        showToast("Signed up successfully", "success");
        router.push("/auth/login");
      } else {
        const error = await response.json();
        showToast("Invalid Credentials", "destructive");
      }
    } catch (error) {
      console.log(error);
      showToast("An error occurred. Please try again later.", "destructive");
    }
  };

  // Ad

  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen">
      <form
        className="w-96  flex flex-col items-center "
        // onChange={handleChange}
      >
        {formNumber === 1 && (
          <div className="flex flex-col w-full gap-2 justify-center items-center">
            <div className="flex flex-col gap-1 items-center mb-4">
              <div className="text-xl  font-semibold">
                Welcome to Tailor
                <span className=" text-teal-900">Trade</span>
              </div>
              <div className="  text-neutral-500">
                Join as a Customer or a Seamster
              </div>
            </div>
            <RadioGroup className="w-full">
              <div className="pt-5 pb-5 pl-4 pr-4 border border-gray-300 rounded-sm flex items-center justify-between">
                <div className="flex items-center">
                  <User size={32} className="mr-2" />
                  <Label htmlFor="customer" className="text-base">
                    I am a customer
                  </Label>
                </div>
                <RadioGroupItem
                  onClick={() => handleRoleChange("customer")}
                  value="customer"
                  id="customer"
                />
              </div>
              <div className="pt-5 pb-5 pl-4 pr-4 border border-gray-300 rounded-sm flex items-center justify-between">
                <div className="flex items-center">
                  <User size={32} className="mr-2" />
                  <Label htmlFor="seamster" className="text-base">
                    I am a seamster
                  </Label>
                </div>
                <RadioGroupItem
                  onClick={() => handleRoleChange("seamster")}
                  value="seamster"
                  id="seamster"
                />
              </div>
            </RadioGroup>
          </div>
        )}
        {formNumber === 2 && (
          <div className="flex flex-col justify-center w-96 space-y-12 -mt-40">
            <div className="flex flex-col justify-center items-center">
              <h1 className="font-semibold text-xl text-gray-700 pb-10">
                Signup To TailorTrade
              </h1>

              <div className="grid w-full space-y-2 max-w-sm items-center gap-1.5">
                <div>
                  <Label htmlFor="first_name">Firstname</Label>
                  <Input
                    type="text"
                    id="first_name"
                    placeholder="Eg: John"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Lastname</Label>
                  <Input
                    type="text"
                    id="last_name"
                    placeholder="Eg: Doe"
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    placeholder="Eg: johndoe@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    type="password"
                    id="password"
                    placeholder="**********"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <RadioGroup
                    className="flex"
                    id="gender"
                    // value={formData.gender}
                  >
                    <div className=" p-3 flex-1  border border-1 border-gray-300 flex rounded-sm items-center justify-between">
                      <Label htmlFor="male" className="mr-3">
                        Male
                      </Label>
                      <RadioGroupItem
                        onClick={() => handleGenderChange("male")}
                        value="male"
                        id="male"
                      />
                    </div>
                    <div className=" p-3 flex-1 border border-1 border-gray-300 flex rounded-sm items-center justify-between">
                      <Label htmlFor="female" className="mr-3">
                        Female
                      </Label>
                      <RadioGroupItem
                        onClick={() => handleGenderChange("female")}
                        value="female"
                        id="female"
                      />
                    </div>
                    <div className=" p-3 flex-1 border border-1 border-gray-300 flex rounded-sm items-center justify-between">
                      <Label htmlFor="other" className="mr-3">
                        Other
                      </Label>
                      <RadioGroupItem
                        onClick={() => handleGenderChange("other")}
                        value="other"
                        id="other"
                      />
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          </div>
        )}
        {formNumber === 3 && (
          <div className="flex flex-col justify-center w-full items-center">
            <div className="-mt-20 mb-10 text-xl font-medium">
              {"We're almost there"}
            </div>
            <div className="grid w-full space-y-2 items-center gap-1.5">
              <div className="w-sm">
                <Label htmlFor="province">Province</Label>
                <Select
                  id="province"
                  className="w-full"
                  value={formData.province}
                  onValueChange={(value) =>
                    setFormData({ ...formData, province: value })
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
                  placeholder="Eg: Kathmandu"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="street">Street Address</Label>
                <Input
                  type="text"
                  id="street"
                  placeholder="Eg: Near Dharahara"
                  value={formData.street}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        )}
        {formNumber === 4 && (
          <div className="flex flex-col justify-center items-center  w-full ">
            <div className="-mt-20 mb-10 text-xl font-medium">
              {"Final step and we're all set"}
            </div>
            {/* <div className="bg-teal-300"> */}
            <div className="  gap-4 flex flex-col">
              {/* <div className="">
                <div className="flex w-full justify-center items-center flex-col gap-2  ">
                 
                  <div className=" border border-neutral-300  rounded-full h-20 w-20">
                    <Image
                      src="/user.png"
                      width={500}
                      height={500}
                      alt="Picture of the author"
                    />
                  </div>
                  <Input
                    type="file"
                    id="profilePic"
                    value={formData.phone}
                    // placeholder="none"
                    className="w-96"
                    onChange={handleChange}
                  />
                </div>
              </div> */}
              <div>
                <Label htmlFor="image">Add a profile picture</Label>
                <Input
                  type="file"
                  id="image"
                  placeholder=""
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      profile_picture: e.target.files[0],
                    })
                  }
                />
              </div>

              <div className="">
                <div className="w-96">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="flex focus-within:ring-black focus-within:ring-2 ring-offset-2 rounded ">
                    <div className="border border-r-0 flex justify-center items-center px-2 border-gray-200 rounded-l w-44 text-gray-600">
                      {" "}
                      +977
                    </div>
                    <Input
                      type="number"
                      id="phone"
                      placeholder=""
                      className=" rounded-md focus-visible:ring-0 border-gray-200  border-l-0 rounded-l-none"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                {/* <div className="mt-6"></div> */}
              </div>
            </div>
            {/* </div> */}
          </div>
        )}
        <div className="flex justify-between gap-1 mt-6 w-full">
          {formNumber > 1 && (
            <Button
              // type="submit"
              variant="secondary"
              onClick={handlePrevious}
              className="w-full "
            >
              Previous
            </Button>
          )}
          {formNumber < 4 ? (
            <Button className="w-full" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button type="submit" className="w-full" onClick={handleSubmit}>
              Register
            </Button>
          )}
        </div>
        <div className="w-full flex mt-4 justify-center items-center">
          <p className="text-xs">
            Already have an account?
            <Link href={"/auth/login"}>
              <span className="font-medium cursor-pointer text-teal-900 hover:text-teal-800">
                {" "}
                login
              </span>
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

// user_id: "",
// title: "",
// description: "",
// category_name: "",
// image_url: "",
// fabric: "",
// color: "",
// size: "",
// bidding_due_date: "",
// required_by: "",
// total_offers: "",
// status: "",
