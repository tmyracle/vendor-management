import React, { useState, Fragment, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { withToken } from "../lib/authHandler";
import { DocumentAddIcon } from "@heroicons/react/solid";
import * as yup from "yup";
import toast from "react-hot-toast";
import FileUploader from "./FileUploader";
import { DateInput } from "@blueprintjs/datetime";
import { Position } from "@blueprintjs/core";
import "./datepicker.css";

const schema = yup.object().shape({
  policy_effective: yup.date(),
  policy_expires: yup.date(),
  vendor_id: yup.number(),
});

const INPUT_STYLES = "mt-1 focus:ring-indigo-500 focus:border-indigo-500";

const CoiAddEditModal = (props) => {
  const [s3Responses, setS3Responses] = useState(null);
  const { register, handleSubmit, reset, setValue } = useForm({
    resolver: yupResolver(schema),
  });

  let cancelButtonRef = useRef(null);

  const handleS3Response = (s3Responses) => {
    setS3Responses(s3Responses);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    }).format(date);
  };

  useEffect(() => {
    if (props.mode === "edit" && props.coi) {
      const defaults = {
        policyEffective: props.coi.policy_effective,
        policyExpires: props.coi.policy_expires,
      };
      reset(defaults);
    } else {
      reset({
        policyEffective: "",
        policyExpires: "",
      });
    }
  }, [props.coi, props.mode, reset]);

  const handleCoiSubmit = async (data) => {
    const payload = {
      policy_effective: data.policyEffective,
      policy_expires: data.policyExpires,
      vendor_id: props.vendor.id,
      document: s3Responses ? s3Responses[0].blob_signed_id : null,
    };

    if (props.mode === "add") {
      try {
        const res = await axios.post("/api/v1/cois", payload, withToken());
        if (res.status === 200) {
          toast.success(`COI added for ${props.vendor.name}`);
          props.fetchVendor();
          props.toggleCoiAddEditModal();
          reset();
        }
      } catch (err) {
        toast.error(err.response.data.message);
      }
    } else if (props.mode === "edit") {
      try {
        const res = await axios.patch(
          `/api/v1/cois/${props.coi.id}`,
          payload,
          withToken()
        );
        if (res.status === 200) {
          toast.success(`COI updated`);
          props.fetchVendor();
          props.toggleCoiAddEditModal();
          reset();
        }
      } catch (err) {
        toast.error(err.response.data.message);
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
          initialFocus={cancelButtonRef}
          open={props.isOpen}
          onClose={props.toggleCoiAddEditModal}
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
              <div className="inline-block align-bottom overflow-visible bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <form onSubmit={handleSubmit(handleCoiSubmit)}>
                  <div>
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                      <DocumentAddIcon
                        className="h-6 w-6 text-blue-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-lg leading-6 font-medium text-gray-900 text-center"
                      >
                        {props.mode === "add" ? "Add" : "Edit"} COI for{" "}
                        {props.vendor.name}
                      </Dialog.Title>
                      <div className="space-y-3 mt-4">
                        <div className="grid grid-cols-6 gap-3">
                          <div className="col-span-6 sm:col-span-3">
                            <label
                              htmlFor="title"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Policy effective
                            </label>

                            <DateInput
                              {...register("policyEffective")}
                              inputProps={{ className: INPUT_STYLES }}
                              formatDate={(date) => formatDate(date)}
                              onChange={(date) =>
                                setValue("policyEffective", date)
                              }
                              popoverProps={{
                                position: Position.BOTTOM,
                                usePortal: false,
                              }}
                              parseDate={(str) => new Date(str)}
                              placeholder={"MM/DD/YYYY"}
                            />
                          </div>

                          <div className="col-span-6 sm:col-span-3">
                            <label
                              htmlFor="title"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Policy expires
                            </label>
                            <DateInput
                              {...register("policyExpires")}
                              inputProps={{ className: INPUT_STYLES }}
                              formatDate={(date) => formatDate(date)}
                              onChange={(date) =>
                                setValue("policyExpires", date)
                              }
                              popoverProps={{
                                position: Position.BOTTOM,
                                usePortal: false,
                              }}
                              parseDate={(str) => new Date(str)}
                              placeholder={"MM/DD/YYYY"}
                            />
                          </div>

                          <div className="col-span-6">
                            <FileUploader
                              multipleFilesAllowed={false}
                              handleS3Response={handleS3Response}
                            />
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
                        ref={cancelButtonRef}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                        onClick={props.toggleCoiAddEditModal}
                      >
                        Cancel
                      </button>
                    </div>
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

export default CoiAddEditModal;
