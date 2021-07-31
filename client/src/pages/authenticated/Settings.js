import React, { useState, useEffect } from "react";
import axios from "axios";
import { withToken } from "../../lib/authHandler";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import uploadToS3 from "../../lib/fileUpload";

const schema = yup.object().shape({
  fullName: yup.string(),
  companyName: yup.string(),
  changePassword: yup.string(),
  changePasswordConfirm: yup.string(),
});

const Settings = () => {
  const [user, setUser] = useState(null);
  const [s3Response, setS3Response] = useState(null);
  const [logoRemoved, setLogoRemoved] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const { register, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const handleUserUpdate = async (data) => {
    try {
      let company_id = user.companies[0].id;
      let payload = {
        full_name: data.fullName,
        companies_attributes: {
          [company_id]: {
            id: user.companies[0].id,
            name: data.companyName,
          },
        },
      };

      if (
        data.changePassword.length > 0 &&
        data.changePasswordConfirm.length > 0 &&
        data.changePassword === data.changePasswordConfirm
      ) {
        payload.new_password = data.changePassword;
      } else if (
        data.changePassword.length > 0 &&
        data.changePasswordConfirm.length > 0 &&
        data.changePassword !== data.changePasswordConfirm
      ) {
        toast.error("Passwords must match");
        return;
      }

      if (logoRemoved === true || s3Response !== null) {
        payload.companies_attributes[company_id].logo = s3Response
          ? s3Response.blob_signed_id
          : null;
      }

      const res = await axios.patch("/api/v1/users", payload, withToken());
      if (res.status === 200) {
        setUser(res.data);
        reset({
          fullName: res.data.full_name,
          companyName: res.data.companies[0].name,
        });
        toast.success("Account updated");
        window.location.reload();
      }
    } catch {
      toast.error("Couldn't update account");
    }
  };

  const handleLogoRemove = () => {
    setSelectedFile("");
    setS3Response(null);
    setLogoRemoved(true);
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length === 1) {
      const toastId = toast.loading("Loading...");
      const s3Res = await uploadToS3(e.target.files[0]);
      setSelectedFile(e.target.files[0]);
      setS3Response(s3Res);
      toast.dismiss(toastId);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/v1/current_user", withToken());
        if (res.status === 200) {
          setUser(res.data);
          reset({
            fullName: res.data.full_name,
            companyName: res.data.companies[0].name,
          });
        }
      } catch (err) {
        toast.error("Something went wrong");
      }
    };
    fetchUser();
  }, [reset]);

  return (
    <div className="flex-1 max-h-screen xl:overflow-y-auto">
      {user ? (
        <div className="max-w-3xl mx-auto mt-8 py-10 px-4 sm:px-6 lg:py-8 lg:px-8 bg-white border-gray-300 rounded-md shadow">
          <h1 className="text-3xl font-extrabold ">Account</h1>

          <form
            onSubmit={handleSubmit(handleUserUpdate)}
            className="mt-6 space-y-8 divide-y divide-y-blue-gray-200"
          >
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
              <div className="sm:col-span-6">
                <h2 className="text-xl font-medium">Profile</h2>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="full-name"
                  className="block text-sm font-medium"
                >
                  Full name
                </label>
                <input
                  type="text"
                  {...register("fullName")}
                  autoComplete="off"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="photo" className="block text-sm font-medium">
                  Photo
                </label>
                <div className="mt-1 flex items-center">
                  {selectedFile || logoRemoved ? (
                    <img
                      className="inline-block h-12 w-12 rounded-full"
                      src={
                        selectedFile ? URL.createObjectURL(selectedFile) : ""
                      }
                      alt=""
                    />
                  ) : (
                    <img
                      className="inline-block h-12 w-12 rounded-full"
                      src={user.companies[0].logo_url}
                      alt=""
                    />
                  )}

                  <div className="ml-4 flex">
                    <div className="relative bg-white py-2 px-3 border border-blue-gray-300 rounded-md shadow-sm flex items-center cursor-pointer hover:bg-blue-gray-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-blue-gray-50 focus-within:ring-blue-500">
                      <label
                        htmlFor="user-photo"
                        className="relative text-sm font-medium pointer-events-none"
                      >
                        <span>Change</span>
                        <span className="sr-only"> user photo</span>
                      </label>
                      <input
                        id="user-photo"
                        name="user-photo"
                        type="file"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer border-gray-300 rounded-md"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleLogoRemove}
                      className="ml-3 bg-transparent py-2 px-3 border border-transparent rounded-md text-sm font-medium  hover:text-blue-gray-700 focus:outline-none focus:border-blue-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-gray-50 focus:ring-blue-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="full-name"
                  className="block text-sm font-medium"
                >
                  Change password
                </label>
                <input
                  type="password"
                  {...register("changePassword")}
                  autoComplete="off"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="full-name"
                  className="block text-sm font-medium"
                >
                  Confirm new password
                </label>
                <input
                  type="password"
                  {...register("changePasswordConfirm")}
                  autoComplete="off"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-8 grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
              <div className="sm:col-span-6">
                <h2 className="text-xl font-medium">Company Information</h2>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="company-name"
                  className="block text-sm font-medium"
                >
                  Company name
                </label>
                <input
                  type="text"
                  {...register("companyName")}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <p className="text-sm text-blue-gray-500 sm:col-span-6">
                This account was created on{" "}
                <time>
                  {new Intl.DateTimeFormat("en-US", {
                    dateStyle: "medium",
                    timeStyle: "medium",
                  }).format(new Date(user.created_at))}
                </time>
                .
              </p>
            </div>

            <div className="pt-8 flex justify-end">
              <button
                type="button"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium  hover:bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default Settings;
