import React, { useState, Fragment, useEffect } from "react";
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

const schema = yup.object().shape({
  status: yup.string().required("Status is a required field"),
  executed_on: yup.date(),
  vendor_id: yup.number(),
});

const MsaAddEditModal = (props) => {
  const [s3Responses, setS3Responses] = useState(null);
  const [date, setDate] = useState(null);
  const { register, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const handleS3Response = (s3Responses) => {
    setS3Responses(s3Responses);
  };

  const handleDateChange = (date) => {
    console.log(date);
    //setDate(date);
  };

  const parseDateFromString = (e) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    }).format(new Date(e.target.value));
  };

  useEffect(() => {
    if (props.mode === "edit" && props.msa) {
      const defaults = {
        status: props.msa.status,
        executedOn: props.msa.executed_on,
      };
      reset(defaults);
    } else {
      reset({
        status: "",
        executedOn: "",
      });
    }
  }, [props.msa, props.mode, reset]);

  const handleMsaSubmit = async (data) => {
    const payload = {
      status: data.status,
      executed_on: data.executedOn,
      vendor_id: props.vendor.id,
      document: s3Responses ? s3Responses[0].blob_signed_id : null,
    };

    if (props.mode === "add") {
      try {
        const res = await axios.post("/api/v1/msas", payload, withToken());
        if (res.status === 200) {
          toast.success(`MSA added for ${props.vendor.name}`);
          props.fetchVendor();
          props.toggleMsaAddEditModal();
          reset();
        }
      } catch (err) {
        toast.error(err.response.data.message);
      }
    } else if (props.mode === "edit") {
      try {
        const res = await axios.patch(
          `/api/v1/msas/${props.msa.id}`,
          payload,
          withToken()
        );
        if (res.status === 200) {
          toast.success(`MSA updated.`);
          props.fetchVendor();
          props.toggleMsaAddEditModal();
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
          initialFocus={null}
          open={props.isOpen}
          onClose={props.toggleMsaAddEditModal}
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
                <form onSubmit={handleSubmit(handleMsaSubmit)}>
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
                        {props.mode === "add" ? "Add" : "Edit"} MSA for{" "}
                        {props.vendor.name}
                      </Dialog.Title>
                      <div className="space-y-3 mt-4">
                        <div className="grid grid-cols-6 gap-3">
                          <div className="col-span-6 sm:col-span-3">
                            <label
                              htmlFor="status"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Status
                            </label>
                            <select
                              id="location"
                              {...register("status", { required: true })}
                              defaultValue=""
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            >
                              <option value="pending">Pending</option>
                              <option value="negotiating">Negotiating</option>
                              <option value="executedc">Executed</option>
                            </select>
                          </div>

                          <div className="col-span-6 sm:col-span-3">
                            <label
                              htmlFor="title"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Execution Date
                            </label>
                            <div className="mt-1">
                              {/*
                              <DateInput
                                defaultValue={new Date()}
                                closeOnSelection={false}
                                formatDate={(date) => date.toLocaleString()}
                                onChange={handleDateChange}
                                popoverProps={{ position: Position.BOTTOM }}
                                parseDate={(str) => new Date(str)}
                                placeholder={"M/D/YYYY"}
                                value={date}
                              />
                              */}

                              <input
                                type="text"
                                autoComplete="off"
                                {...register("executedOn")}
                                onBlur={(e) => {
                                  e.target.value = parseDateFromString(e);
                                }}
                                className="appearance-none inline w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              />
                            </div>
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
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                        onClick={props.toggleMsaAddEditModal}
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

export default MsaAddEditModal;
