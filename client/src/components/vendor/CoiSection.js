import {useState} from "react";
import axios from "axios";
import { Switch } from "@headlessui/react";
import {
  DocumentAddIcon,
  PaperClipIcon,
  BadgeCheckIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/solid";
import toast from "react-hot-toast";
import { withToken } from "../../lib/authHandler";
import CoiAddEditModal from "../CoiAddEditModal";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const CoiSection = (props) => {
  const [coiAddEditModalOpen, setCoiAddEditModalOpen] = useState(false);
  const [coiModalMode, setCoiModalMode] = useState(null);
  const [coi, setCoi] = useState(null);

  const toggleCoiAddEditModal = () => {
    setCoiAddEditModalOpen(!coiAddEditModalOpen);
  };

  const toggleCoiAddModal = () => {
    setCoiModalMode("add");
    setCoi({})
    toggleCoiAddEditModal();
  };

  const toggleCoiEditModal = (coi) => {
    setCoiModalMode("edit");
    setCoi(coi);
    toggleCoiAddEditModal();
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    }).format(new Date(date));
  };

  const handleEditClick = () => {
    toggleCoiEditModal(props.vendor.cois[0]);
  };

  const handleVendorUpdate = async () => {
    try {
      const res = await axios.patch(
        `/api/v1/vendors/${props.vendor.id}`,
        { coi_required: !props.vendor.coi_required },
        withToken()
      );
      if (res.status === 200) {
        toast.success("COI requirement updated");
        props.updateVendor(res.data);
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <section className="px-8 mt-4">
      <div className="bg-white shadow border border-gray-200 sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg inline leading-6 font-medium text-gray-900">
            COI
          </h2>
          <Switch
            checked={props.vendor.coi_required}
            onChange={handleVendorUpdate}
            className={classNames(
              props.vendor.coi_required ? "bg-green-600" : "bg-gray-200",
              "relative inline-flex float-right flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            )}
          >
            <span className="sr-only">Use setting</span>
            <span
              aria-hidden="true"
              className={classNames(
                props.vendor.coi_required ? "translate-x-5" : "translate-x-0",
                "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
              )}
            />
          </Switch>
        </div>
        {props.vendor.coi_required ? (
          <div className="border-t border-gray-200">
            {props.vendor.cois && props.vendor.cois.length >= 1 ? (
              <div className="relative grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 bg-white px-6 py-5 shadow-sm">
                {props.vendor.cois[0].document_name ? (
                  <div className="pl-3 pr-4 py-3 col-span-2 flex items-center justify-between text-sm border border-gray-200 rounded-md">
                    <div className="w-0 flex-1 flex items-center">
                      <PaperClipIcon
                        className="flex-shrink-0 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      <span className="ml-2 flex-1 w-0 truncate">
                        {props.vendor.cois[0].document_name}
                      </span>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <a
                        href={props.vendor.cois[0].document_url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
                      >
                        Download
                      </a>
                      <span className="text-gray-300 mx-2">|</span>
                      <span
                        onClick={handleEditClick}
                        className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
                      >
                        Edit
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="col-span-2 flex items-center justify-end text-sm absolute right-6 top-5">
                    <span
                      onClick={handleEditClick}
                      className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
                    >
                      Edit
                    </span>
                  </div>
                )}

                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm text-gray-900 flex items-center">
                    {props.vendor.coi_compliant ? (
                      <>
                        <BadgeCheckIcon className="text-green-500 h-5 w-5 inline" />
                        <span>&nbsp;Compliant</span>
                      </>
                    ) : (
                      <>
                        <ExclamationCircleIcon className="text-red-500 h-5 w-5 inline" />
                        <span>&nbsp;Not compliant</span>
                      </>
                    )}
                  </dd>
                </div>

                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Uploaded by
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {props.vendor.cois[0].uploader}
                  </dd>
                </div>

                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Policy effective
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDate(props.vendor.cois[0].policy_effective)}
                  </dd>
                </div>

                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Policy expires
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDate(props.vendor.cois[0].policy_expires)}
                  </dd>
                </div>
              </div>
            ) : (
              <div className="text-center py-5">
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No COI uploaded
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by adding a COI.
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={toggleCoiAddModal}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <DocumentAddIcon
                      className="-ml-1 mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                    Upload COI
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
      <CoiAddEditModal
        isOpen={coiAddEditModalOpen}
        mode={coiModalMode}
        coi={coi}
        toggleCoiAddEditModal={toggleCoiAddEditModal}
        vendor={props.vendor}
        fetchVendor={() => {
          props.fetchVendor(true);
        }}
      />
    </section>
  );
};

export default CoiSection;
