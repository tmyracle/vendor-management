import React, { useState, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { withToken } from "../lib/authHandler";
import { UserAddIcon } from "@heroicons/react/solid";
import * as yup from "yup";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import toast from "react-hot-toast";

const schema = yup.object().shape({
  name: yup
    .string()
    .matches(/^([^0-9]*)$/, "Name should not contain numbers")
    .required("Name is a required field"),
  title: yup.string(),
  primary_phone: yup.string(),
  secondary_phone: yup.string(),
  email: yup.string().email("Email must be the correct format"),
  notes: yup.string(),
});

const normalizePhoneNumber = (val) => {
  const phoneNumber = parsePhoneNumberFromString(val, "US");
  if (!phoneNumber) {
    return val;
  }

  return phoneNumber.formatInternational();
};

const ContactAddEditModal = (props) => {
  const [errorMessage, setErrorMessage] = useState("");
  const { register, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (props.mode === "edit" && props.contact) {
      const defaults = {
        name: props.contact.name,
        title: props.contact.title,
        primaryPhone: props.contact.primary_phone,
        secondaryPhone: props.contact.secondary_phone,
        email: props.contact.email,
        notes: props.contact.notes,
      };
      reset(defaults);
    } else {
      reset({
        name: "",
        title: "",
        primaryPhone: "",
        secondaryPhone: "",
        email: "",
        notes: "",
      });
    }
  }, [props.contact, props.mode, reset]);

  const handleContactSubmit = async (data) => {
    const payload = {
      name: data.name,
      title: data.title,
      primary_phone: data.primaryPhone,
      secondary_phone: data.secondaryPhone,
      email: data.email,
      notes: data.notes,
      vendor_id: props.vendor.id,
    };

    if (props.mode === "add") {
      try {
        const res = await axios.post("/api/v1/contacts", payload, withToken());
        if (res.status === 200) {
          toast.success(
            `${payload.name} added to contacts for ${props.vendor.name}`
          );
          props.fetchVendor();
          props.toggleContactAddEditModal();
          reset();
        }
      } catch (err) {
        setErrorMessage(err.response.data.message);
      }
    } else if (props.mode === "edit") {
      try {
        const res = await axios.patch(
          `/api/v1/contacts/${props.contact.id}`,
          payload,
          withToken()
        );
        if (res.status === 200) {
          toast.success(`${payload.name} contact info updated.`);
          props.fetchVendor();
          props.toggleContactAddEditModal();
          reset();
        }
      } catch (err) {
        setErrorMessage(err.response.data.message);
      }
    }
  };

  return (
    <div>
      <Transition.Root show={props.isOpen} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed z-10 inset-0 overflow-y-auto"
          initialFocus={null}
          open={props.isOpen}
          onClose={props.toggleContactAddEditModal}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <form onSubmit={handleSubmit(handleContactSubmit)}>
                  <div>
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                      <UserAddIcon
                        className="h-6 w-6 text-blue-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-lg leading-6 font-medium text-gray-900 text-center"
                      >
                        Add a contact for {props.vendor.name}
                      </Dialog.Title>
                      <div className="space-y-3 mt-4">
                        {errorMessage ? (
                          <div className="text-red-500">{errorMessage}</div>
                        ) : (
                          <></>
                        )}

                        <div className="grid grid-cols-6 gap-3">
                          <div className="col-span-6 sm:col-span-3">
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Name
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                {...register("name", { required: true })}
                                autoComplete="off"
                                className="appearance-none inline w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              />
                            </div>
                          </div>

                          <div className="col-span-6 sm:col-span-3">
                            <label
                              htmlFor="title"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Title
                            </label>
                            <div className="mt-1">
                              <input
                                id="title"
                                name="title"
                                type="text"
                                autoComplete="off"
                                {...register("title")}
                                className="appearance-none inline w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              />
                            </div>
                          </div>

                          <div className="col-span-6 sm:col-span-3">
                            <label
                              htmlFor="primaryPhone"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Primary phone
                            </label>
                            <div className="mt-1">
                              <input
                                id="primaryPhone"
                                name="primaryPhone"
                                type="text"
                                {...register("primaryPhone")}
                                onChange={(event) => {
                                  event.target.value = normalizePhoneNumber(
                                    event.target.value
                                  );
                                }}
                                className="appearance-none inline w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              />
                            </div>
                          </div>

                          <div className="col-span-6 sm:col-span-3">
                            <label
                              htmlFor="secondaryPhone"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Secondary phone
                            </label>
                            <div className="mt-1">
                              <input
                                id="secondaryPhone"
                                name="secondaryPhone"
                                type="text"
                                {...register("secondaryPhone")}
                                onChange={(event) => {
                                  event.target.value = normalizePhoneNumber(
                                    event.target.value
                                  );
                                }}
                                className="appearance-none inline w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Email address
                          </label>
                          <div className="mt-1">
                            <input
                              id="email"
                              name="email"
                              type="text"
                              {...register("email")}
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Notes
                          </label>
                          <div className="mt-1">
                            <textarea
                              id="notes"
                              name="notes"
                              {...register("notes")}
                              rows={2}
                              className="max-w-lg shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    {props.mode === "add" ? (
                      <button
                        type="submit"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                      >
                        Add
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                      >
                        Save
                      </button>
                    )}

                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                      onClick={props.toggleContactAddEditModal}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default ContactAddEditModal;
