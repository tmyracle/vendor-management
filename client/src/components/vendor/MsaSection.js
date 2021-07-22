import axios from "axios";
import { Switch } from "@headlessui/react";
import { DocumentAddIcon, PaperClipIcon } from "@heroicons/react/solid";
import toast from "react-hot-toast";
import { withToken } from "../../lib/authHandler";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const MsaSection = (props) => {
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    }).format(new Date(date));
  };

  const handleVendorUpdate = async () => {
    try {
      const res = await axios.patch(
        `/api/v1/vendors/${props.vendor.id}`,
        { msa_required: !props.vendor.msa_required },
        withToken()
      );
      if (res.status === 200) {
        toast.success("MSA requirement updated");
        props.updateVendor(res.data);
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  const handleEditClick = () => {
    props.toggleMsaEditModal(props.vendor.msas[0]);
  };

  return (
    <section
      className="px-8 mt-4"
      aria-labelledby="applicant-information-title"
    >
      <div className="bg-white shadow border border-gray-200 sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2
            id="applicant-information-title"
            className="text-lg inline leading-6 font-medium text-gray-900"
          >
            MSA
          </h2>
          <Switch
            checked={props.vendor.msa_required}
            onChange={handleVendorUpdate}
            className={classNames(
              props.vendor.msa_required ? "bg-green-600" : "bg-gray-200",
              "relative inline-flex float-right flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            )}
          >
            <span className="sr-only">Use setting</span>
            <span
              aria-hidden="true"
              className={classNames(
                props.vendor.msa_required ? "translate-x-5" : "translate-x-0",
                "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
              )}
            />
          </Switch>
        </div>
        {props.vendor.msa_required ? (
          <div className="border-t border-gray-200">
            {props.vendor.msas && props.vendor.msas.length >= 1 ? (
              <div className="relative grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 rounded-lg bg-white px-6 py-5 shadow-sm">
                {props.vendor.msas[0].document_name ? (
                  <div className="p-3 col-span-2 flex items-center justify-between text-sm border border-gray-200 rounded-md">
                    <div className="w-0 flex-1 flex items-center">
                      <PaperClipIcon
                        className="flex-shrink-0 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      <span className="ml-2 flex-1 w-0 truncate">
                        {props.vendor.msas[0].document_name}
                      </span>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <a
                        href={props.vendor.msas[0].document_url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium inline text-blue-600 hover:text-blue-500 cursor-pointer"
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
                  <dd className="mt-1 text-sm text-gray-900">
                    {props.vendor.msas[0].status.charAt(0).toUpperCase() +
                      props.vendor.msas[0].status.slice(1)}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Uploaded by
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {props.vendor.msas[0].uploader}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Uploaded on
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDate(props.vendor.msas[0].updated_at)}
                  </dd>
                </div>
                {props.vendor.msas[0].status === "executed" ? (
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Executed on
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formatDate(props.vendor.msas[0].executed_on)}
                    </dd>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="text-center py-5">
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No MSA uploaded
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by adding an MSA.
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={props.toggleMsaAddModal}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <DocumentAddIcon
                      className="-ml-1 mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                    Upload MSA
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default MsaSection;
