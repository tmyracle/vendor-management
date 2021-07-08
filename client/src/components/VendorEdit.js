import React, { useState, Fragment, useEffect } from "react";
import axios from "axios";
import { withToken } from "../lib/authHandler";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";

const VendorEdit = (props) => {
  const [open, setOpen] = useState(props.isVisible);
  const [vendorName, setVendorName] = useState(props.vendor.name);
  const [vendorWebsite, setVendorWebsite] = useState(props.vendor.website);
  const [vendorDescription, setVendorDescription] = useState(
    props.vendor.description
  );
  const [errorMessage, setErrorMessage] = useState(null);

  const handleVendorNameChange = (e) => {
    setVendorName(e.target.value);
  };

  const handleVendorWebsiteChange = (e) => {
    setVendorWebsite(e.target.value);
  };

  const handleVendorDescriptionChange = (e) => {
    setVendorDescription(e.target.value);
  };

  const handleVendorUpdate = async () => {
    const payload = {
      name: vendorName,
      website: vendorWebsite,
      description: vendorDescription,
    };

    try {
      const res = await axios.patch(
        `/api/v1/vendors/${props.vendor.id}`,
        payload,
        withToken()
      );
      if (res.status === 200) {
        props.fetchVendors(true);
        props.setVendor(res.data);
        props.toggleEditFormVisible();
      }
    } catch (err) {
      setErrorMessage(err.response.data.message);
    }
  };

  useEffect(() => {
    setOpen(props.isVisible);
  }, [props.isVisible]);

  useEffect(() => {
    setVendorName(props.vendor.name);
    setVendorWebsite(props.vendor.website);
    setVendorDescription(props.vendor.description);
  }, [props.vendor]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed inset-0 overflow-hidden"
        open={open}
        onClose={setOpen}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Dialog.Overlay className="absolute inset-0" />

          <div className="fixed top-16 bottom-0 right-0 pl-10 max-w-full flex sm:pl-16">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="w-screen max-w-2xl">
                <form className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="px-4 py-6 bg-gray-50 sm:px-6">
                      <div className="flex items-start justify-between space-x-3">
                        <div className="space-y-1">
                          <Dialog.Title className="text-lg font-medium text-gray-900">
                            Edit vendor
                          </Dialog.Title>
                          <p className="text-sm text-gray-500">
                            Update information about the vendor in the fields
                            below.
                          </p>
                          {errorMessage ? <p>{errorMessage}</p> : null}
                        </div>
                        <div className="h-7 flex items-center">
                          <button
                            type="button"
                            className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            onClick={props.toggleEditFormVisible}
                          >
                            <span className="sr-only">Close panel</span>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Divider container */}
                    <div className="py-6 space-y-6 sm:py-0 sm:space-y-0 sm:divide-y sm:divide-gray-200">
                      {/* Vendor name */}
                      <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                        <div>
                          <label
                            htmlFor="project-name"
                            className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                          >
                            Vendor name
                          </label>
                        </div>
                        <div className="sm:col-span-2">
                          <input
                            type="text"
                            name="name"
                            id="name"
                            autoComplete="off"
                            value={vendorName}
                            onChange={handleVendorNameChange}
                            className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      {/* Vendor website */}
                      <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                        <div>
                          <label
                            htmlFor="project-name"
                            className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                          >
                            Website
                          </label>
                        </div>
                        <div className="sm:col-span-2">
                          <input
                            type="text"
                            name="website"
                            id="website"
                            autoComplete="off"
                            value={vendorWebsite || ""}
                            onChange={handleVendorWebsiteChange}
                            className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      {/* Vendor description */}
                      <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                        <div>
                          <label
                            htmlFor="project-description"
                            className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                          >
                            Description
                          </label>
                        </div>
                        <div className="sm:col-span-2">
                          <textarea
                            id="description"
                            name="description"
                            rows={3}
                            autoComplete="off"
                            value={vendorDescription || ""}
                            onChange={handleVendorDescriptionChange}
                            className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex-shrink-0 px-4 border-t border-gray-200 py-5 sm:px-6">
                    <div className="space-x-3 flex justify-end">
                      <button
                        type="button"
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={props.toggleEditFormVisible}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleVendorUpdate}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default VendorEdit;
