import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { withToken } from "../lib/authHandler";
import {
  ChevronLeftIcon,
  PencilAltIcon,
  UserAddIcon,
} from "@heroicons/react/solid";
import OverviewSection from "./vendor/OverviewSection";
import MsaSection from "./vendor/MsaSection";
import CoiSection from "./vendor/CoiSection";
import W9Section from "./vendor/W9Section";
import ContactSection from "./vendor/ContactsSection";
import MsaAddEditModal from "./MsaAddEditModal";
import W9AddEditModal from "./W9AddEditModal";
import ContactAddEditModal from "./ContactAddEditModal";

const coverImageUrls = [
  "https://images.unsplash.com/photo-1527515234283-d93c5f8486a0?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2242&q=80",
  "https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
  "https://images.unsplash.com/photo-1508233620467-f79f1e317a05?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1868&q=80",
  "https://images.unsplash.com/photo-1508031100502-f2f679ea78eb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80",
  "https://images.unsplash.com/photo-1507963901243-ebfaecd5f2f4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2158&q=80",
  "https://images.unsplash.com/photo-1517256985756-924657c74fba?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80",
  "https://images.unsplash.com/photo-1464013778555-8e723c2f01f8?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
  "https://images.unsplash.com/photo-1517829695495-7363a9eb3539?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80",
  "https://images.unsplash.com/photo-1594878462522-f6e3db86d0ec?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1867&q=80",
  "https://images.unsplash.com/photo-1555600341-3ab8d338991d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=933&q=80",
];

const VendorDetail = (props) => {
  const [vendor, setVendor] = useState(props.vendor);
  const [contactModalMode, setContactModalMode] = useState(null);
  const [msaModalMode, setMsaModalMode] = useState(null);
  const [w9ModalMode, setW9ModalMode] = useState(null);
  const [contact, setContact] = useState(null);
  const [msa, setMsa] = useState(null);
  const [w9, setW9] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [contactAddEditModalOpen, setContactAddEditModalOpen] = useState(false);
  const [msaAddEditModalOpen, setMsaAddEditModalOpen] = useState(false);
  const [w9AddEditModalOpen, setW9AddEditModalOpen] = useState(false);

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
    setMsa({});
    toggleMsaAddEditModal();
  };

  const toggleMsaEditModal = (msa) => {
    setMsaModalMode("edit");
    setMsa(msa);
    toggleMsaAddEditModal();
  };

  const toggleW9AddEditModal = () => {
    setW9AddEditModalOpen(!w9AddEditModalOpen);
  };

  const toggleW9AddModal = () => {
    setW9ModalMode("add");
    setW9({});
    toggleW9AddEditModal();
  };

  const toggleW9EditModal = (w9) => {
    setW9ModalMode("edit");
    setW9(w9);
    toggleW9AddEditModal();
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
        <div className="mb-20">
          <article>
            {/* Profile header */}
            <div>
              <div>
                <img
                  className="h-16 w-full object-cover lg:h-32"
                  src={coverImageUrls[vendor.id % 10]}
                  alt=""
                />
              </div>

              <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-end sm:space-x-5">
                  {/*
                  <div className="flex">
                    <div className="h-24 w-24 rounded-full ring-4 ring-white bg-gray-200 items-center justify-center flex sm:h-32 sm:w-32">
                      <UserIcon className="h-12 w-12 text-gray-500" />
                    </div>
                  </div>
                  */}

                  <div className="mt-6 flex flex-row justify-between space-y-3 w-full sm:space-y-0 space-x-4 items-center">
                    <div className="text-2xl justify-self-start font-bold text-gray-900 truncate">
                      {vendor.name}
                    </div>
                    <div className="space-x-2">
                      <button
                        type="button"
                        onClick={toggleContactAddModal}
                        className="inline-flex justify-center justify-self-end px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
                        className="inline-flex justify-self-end justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
              fetchVendor={() => {
                fetchVendor(true);
              }}
              updateVendor={handleVendorUpdate}
            />

            {/* W9 section */}
            <W9Section
              vendor={vendor}
              updateVendor={handleVendorUpdate}
              toggleW9AddModal={toggleW9AddModal}
              toggleW9EditModal={toggleW9EditModal}
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
      <W9AddEditModal
        isOpen={w9AddEditModalOpen}
        mode={w9ModalMode}
        w9={w9}
        toggleW9AddEditModal={toggleW9AddEditModal}
        vendor={vendor}
        fetchVendor={() => {
          fetchVendor(true);
        }}
      />
    </main>
  );
};

export default VendorDetail;
