import React, { useState, Fragment, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { withToken } from "../lib/authHandler";
import { DocumentAddIcon, PaperClipIcon } from "@heroicons/react/solid";
import * as yup from "yup";
import toast from "react-hot-toast";
import FileUploader from "./FileUploader";

const schema = yup.object().shape({
  taxpayer_id_number: yup.string(),
});

const W9AddEditModal = (props) => {
  const [s3Responses, setS3Responses] = useState(null);
  const [hasExistingFile, setHasExistingFile] = useState();
  const { register, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
  });

  let cancelButtonRef = useRef(null);

  const handleS3Response = (s3Responses) => {
    setS3Responses(s3Responses);
  };

  const handleDocumentRemove = async () => {
    setHasExistingFile(false);
  };

  const handleW9Delete = async () => {
    try {
      const res = await axios.delete(`/api/v1/w9s/${props.w9.id}`, withToken());
      if (res.status === 200) {
        toast.success(`W9 removed`);
        reset();
        props.fetchVendor();
        setHasExistingFile(false);
        handleModalClose();
      }
    } catch (err) {
      toast.error("Problem removing W9");
    }
  };

  const handleModalClose = () => {
    props.toggleW9AddEditModal();
    setHasExistingFile(
      props.w9 && props.w9.document_name && props.w9.document_name.length > 0
    );
    setS3Responses(null);
  };

  useEffect(() => {
    if (props.mode === "edit" && props.w9) {
      const defaults = {
        taxpayerIdNumber: props.w9.taxpayer_id_number,
      };
      reset(defaults);
    } else {
      reset({
        taxpayerIdNumber: "",
      });
    }
  }, [props.w9, props.mode, reset]);

  useEffect(() => {
    setHasExistingFile(
      props.w9 && props.w9.document_name && props.w9.document_name.length > 0
    );
  }, [props.w9]);

  const handleW9Submit = async (data) => {
    const payload = {
      taxpayer_id_number: data.taxpayerIdNumber,
      vendor_id: props.vendor.id,
      document: s3Responses ? s3Responses[0].blob_signed_id : null,
    };

    if (props.mode === "add") {
      try {
        const res = await axios.post("/api/v1/w9s", payload, withToken());
        if (res.status === 200) {
          toast.success(`W9 added for ${props.vendor.name}`);
          props.fetchVendor();
          handleModalClose();
          reset();
        }
      } catch (err) {
        toast.error(err.response.data.message);
      }
    } else if (props.mode === "edit") {
      try {
        if (hasExistingFile === false && s3Responses === null) {
          payload.remove_file = true;
        }
        const res = await axios.patch(
          `/api/v1/w9s/${props.w9.id}`,
          payload,
          withToken()
        );
        if (res.status === 200) {
          toast.success(`W9 updated`);
          props.fetchVendor();
          handleModalClose();
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
          onClose={handleModalClose}
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
                <form onSubmit={handleSubmit(handleW9Submit)}>
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
                        {props.mode === "add" ? "Add" : "Edit"} W9 for{" "}
                        {props.vendor.name}
                      </Dialog.Title>
                      <div className="space-y-3 mt-4">
                        <div className="grid grid-cols-6 gap-3">
                          <div className="col-span-6 sm:col-span-6">
                            <label
                              htmlFor="taxpayerIdNumber"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Taxpayer ID number
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                {...register("taxpayerIdNumber", {
                                  required: true,
                                })}
                                autoComplete="off"
                                className="appearance-none inline w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              />
                            </div>
                          </div>

                          <div className="col-span-6">
                            {hasExistingFile ? (
                              <div className="pl-3 pr-4 py-3 col-span-2 flex items-center justify-between text-sm border border-gray-200 rounded-md">
                                <div className="w-0 flex-1 flex items-center">
                                  <PaperClipIcon
                                    className="flex-shrink-0 h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                  <span className="ml-2 flex-1 w-0 truncate">
                                    {props.w9.document_name}
                                  </span>
                                </div>
                                <div className="ml-4 flex-shrink-0">
                                  <span
                                    onClick={handleDocumentRemove}
                                    className="font-medium text-red-600 hover:text-red-500 cursor-pointer"
                                  >
                                    Remove
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <FileUploader
                                multipleFilesAllowed={false}
                                handleS3Response={handleS3Response}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-4 sm:gap-3 sm:grid-flow-row-dense">
                      {props.mode === "add" ? (
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-3 sm:col-span-2 sm:text-sm"
                        >
                          Add
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-3 sm:col-span-2 sm:text-sm"
                        >
                          Save
                        </button>
                      )}
                      {props.mode === "edit" ? (
                        <>
                          <button
                            type="button"
                            ref={cancelButtonRef}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                            onClick={handleModalClose}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-100 text-base font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm sm:mt-0 sm:col-start-2 sm:text-sm"
                            onClick={handleW9Delete}
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          ref={cancelButtonRef}
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                          onClick={handleModalClose}
                        >
                          Cancel
                        </button>
                      )}
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

export default W9AddEditModal;
