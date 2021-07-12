import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { withToken } from "../lib/authHandler";
import { ChevronLeftIcon, PencilAltIcon } from "@heroicons/react/solid";
import { UserIcon } from "@heroicons/react/outline";
import { UserAddIcon } from "@heroicons/react/solid";
import ContactAddEditModal from "./ContactAddEditModal";
import { ContactCard } from "./ContactCard";

const tabs = [
  { name: "Profile", href: "#", current: true },
  { name: "Documents", href: "#", current: false },
  { name: "Contacts", href: "#", current: false },
];

const coverImageUrl =
  "https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const VendorDetail = (props) => {
  const [vendor, setVendor] = useState(props.vendor);
  const [mode, setMode] = useState(null);
  const [contact, setContact] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [contactAddEditModalOpen, setContactAddEditModalOpen] = useState(false);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    }).format(new Date(date));
  };

  const toggleContactAddEditModal = () => {
    setContactAddEditModalOpen(!contactAddEditModalOpen);
  };

  const toggleContactAddModal = () => {
    setMode("add");
    toggleContactAddEditModal();
  };

  const toggleContactEditModal = (contact) => {
    setMode("edit");
    setContact(contact);
    toggleContactAddEditModal();
  };

  const fetchVendor = useCallback(
    async (isMounted) => {
      try {
        const res = await axios.get(
          `/api/v1/vendors/${props.vendor.id}`,
          withToken()
        );
        if (res.status === 200 && isMounted) {
          setVendor(res.data);
        }
      } catch (err) {
        setErrorMessage(err.response.data.message);
      }
    },
    [props.vendor.id]
  );

  useEffect(() => {
    let isMounted = true;
    fetchVendor(isMounted);
    return () => {
      isMounted = false;
    };
  }, [props.vendor, fetchVendor]);

  return (
    <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none xl:order-last">
      {/* Breadcrumb */}
      <nav
        className="flex items-start px-4 py-3 sm:px-6 lg:px-8 xl:hidden"
        aria-label="Breadcrumb"
      >
        <a
          href="/"
          className="inline-flex items-center space-x-3 text-sm font-medium text-gray-900"
        >
          <ChevronLeftIcon
            className="-ml-2 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          <span>Directory</span>
        </a>
      </nav>
      {vendor ? (
        <div>
          <article>
            {/* Profile header */}
            <div>
              <div>
                <img
                  className="h-32 w-full object-cover lg:h-48"
                  src={coverImageUrl}
                  alt=""
                />
              </div>
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
                  <div className="flex">
                    <div className="h-24 w-24 rounded-full ring-4 ring-white bg-gray-200 items-center justify-center flex sm:h-32 sm:w-32">
                      <UserIcon className="h-12 w-12 text-gray-500" />
                    </div>
                  </div>
                  <div className="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                    <div className="sm:hidden 2xl:block mt-6 min-w-0 flex-1">
                      <h1 className="text-2xl font-bold text-gray-900 truncate">
                        {vendor.name}
                      </h1>
                      {errorMessage ? <p>{errorMessage}</p> : null}
                    </div>
                    <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                      <button
                        type="button"
                        onClick={toggleContactAddModal}
                        className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <UserAddIcon
                          className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        <span>Add Contact</span>
                      </button>
                      <button
                        type="button"
                        onClick={props.toggleEditFormVisible}
                        className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <PencilAltIcon
                          className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:block 2xl:hidden mt-6 min-w-0 flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 truncate">
                    {vendor.name}
                  </h1>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-6 sm:mt-2 2xl:mt-5">
              <div className="border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                  <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {tabs.map((tab) => (
                      <a
                        key={tab.name}
                        href={tab.href}
                        className={classNames(
                          tab.current
                            ? "border-blue-500 text-gray-900"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                          "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                        )}
                        aria-current={tab.current ? "page" : undefined}
                      >
                        {tab.name}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            </div>

            {/* Description list */}
            <div className="mt-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Website</dt>
                  <a
                    href={`https://${vendor.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 text-sm text-blue-500 hover:text-blue-700"
                  >
                    {vendor.website}
                  </a>
                </div>

                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Vendor Added
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDate(vendor.created_at)}
                  </dd>
                </div>

                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">About</dt>
                  <dd
                    className="mt-1 max-w-prose text-sm text-gray-900 space-y-5"
                    dangerouslySetInnerHTML={{ __html: vendor.description }}
                  />
                </div>
              </dl>
            </div>

            {/* Contact list */}
            {vendor.contacts && vendor.contacts.length > 0 ? (
              <div className="mt-8 max-w-5xl mx-auto px-4 pb-12 sm:px-6 lg:px-8">
                <h2 className="text-sm font-medium text-gray-500">Contacts</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-1">
                  {vendor.contacts.map((contact) => (
                    <ContactCard
                      contact={contact}
                      key={contact.id}
                      fetchVendor={() => {
                        fetchVendor(true);
                      }}
                      toggleContactEditModal={() => {
                        toggleContactEditModal(contact);
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </article>
        </div>
      ) : (
        <div className="bg-white">
          {/* Empty state when vendor not selected */}
        </div>
      )}
      <ContactAddEditModal
        isOpen={contactAddEditModalOpen}
        mode={mode}
        contact={contact}
        toggleContactAddEditModal={toggleContactAddEditModal}
        vendor={vendor}
        fetchVendor={() => {
          fetchVendor(true);
        }}
      />
    </main>
  );
};

export default VendorDetail;
