import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { withToken } from "../lib/authHandler";
import {
  ChevronLeftIcon,
  PencilAltIcon,
  UserAddIcon,
} from "@heroicons/react/solid";
import { UserIcon } from "@heroicons/react/outline";
import OverviewSection from "./vendor/OverviewSection";
import MsaSection from "./vendor/MsaSection";
import CoiSection from "./vendor/CoiSection";
import ContactSection from "./vendor/ContactsSection";
import MsaAddEditModal from "./MsaAddEditModal";
import CoiAddEditModal from "./CoiAddEditModal";
import ContactAddEditModal from "./ContactAddEditModal";

const coverImageUrl =
  "https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80";

const VendorDetail = (props) => {
  const [vendor, setVendor] = useState(props.vendor);
  const [contactModalMode, setContactModalMode] = useState(null);
  const [msaModalMode, setMsaModalMode] = useState(null);
  const [coiModalMode, setCoiModalMode] = useState(null);
  const [contact, setContact] = useState(null);
  const [msa, setMsa] = useState(null);
  const [coi, setCoi] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [contactAddEditModalOpen, setContactAddEditModalOpen] = useState(false);
  const [msaAddEditModalOpen, setMsaAddEditModalOpen] = useState(false);
  const [coiAddEditModalOpen, setCoiAddEditModalOpen] = useState(false);

  const toggleContactAddEditModal = () => {
    setContactAddEditModalOpen(!contactAddEditModalOpen);
  };

  const toggleContactAddModal = () => {
    setContactModalMode("add");
    toggleContactAddEditModal();
  };

  const toggleContactEditModal = (contact) => {
    setContactModalMode("edit");
    setContact(contact);
    toggleContactAddEditModal();
  };

  const toggleMsaAddEditModal = () => {
    setMsaAddEditModalOpen(!msaAddEditModalOpen);
  };

  const toggleMsaAddModal = () => {
    setMsaModalMode("add");
    toggleMsaAddEditModal();
  };

  const toggleMsaEditModal = (msa) => {
    setMsaModalMode("edit");
    setMsa(msa);
    toggleMsaAddEditModal();
  };

  const toggleCoiAddEditModal = () => {
    setCoiAddEditModalOpen(!coiAddEditModalOpen);
  };

  const toggleCoiAddModal = () => {
    setCoiModalMode("add");
    toggleCoiAddEditModal();
  };

  const toggleCoiEditModal = (msa) => {
    setCoiModalMode("edit");
    setCoi(msa);
    toggleCoiAddEditModal();
  };

  const handleVendorUpdate = (vendor) => {
    setVendor(vendor);
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
        <div className="mb-4">
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

            {/* Vendor Overview */}
            <OverviewSection vendor={vendor} />

            {/* MSA section */}
            <MsaSection
              vendor={vendor}
              updateVendor={handleVendorUpdate}
              toggleMsaAddModal={toggleMsaAddModal}
              toggleMsaEditModal={toggleMsaEditModal}
            />

            {/* COI section */}
            <CoiSection
              vendor={vendor}
              updateVendor={handleVendorUpdate}
              toggleCoiAddModal={toggleCoiAddModal}
              toggleCoiEditModal={toggleCoiEditModal}
            />

            {/* Contacts section */}
            <ContactSection
              vendor={vendor}
              fetchVendor={fetchVendor}
              toggleContactEditModal={toggleContactEditModal}
              toggleContactAddModal={toggleContactAddModal}
            />
          </article>
        </div>
      ) : (
        <div className="bg-white">
          {/* Empty state when vendor not selected */}
        </div>
      )}
      <ContactAddEditModal
        isOpen={contactAddEditModalOpen}
        mode={contactModalMode}
        contact={contact}
        toggleContactAddEditModal={toggleContactAddEditModal}
        vendor={vendor}
        fetchVendor={() => {
          fetchVendor(true);
        }}
      />
      <MsaAddEditModal
        isOpen={msaAddEditModalOpen}
        mode={msaModalMode}
        msa={msa}
        toggleMsaAddEditModal={toggleMsaAddEditModal}
        vendor={vendor}
        fetchVendor={() => {
          fetchVendor(true);
        }}
      />
      <CoiAddEditModal
        isOpen={coiAddEditModalOpen}
        mode={coiModalMode}
        coi={coi}
        toggleCoiAddEditModal={toggleCoiAddEditModal}
        vendor={vendor}
        fetchVendor={() => {
          fetchVendor(true);
        }}
      />
    </main>
  );
};

export default VendorDetail;
