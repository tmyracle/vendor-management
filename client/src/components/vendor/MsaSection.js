import axios from "axios";
import { Switch } from "@headlessui/react";
import { DocumentAddIcon } from "@heroicons/react/solid";
import { DocumentIcon } from "@heroicons/react/outline";
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
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            {props.vendor.msas && props.vendor.msas.length >= 1 ? (
              <div className="relative grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 rounded-lg border border-gray-200 bg-white px-6 py-5 shadow-sm hover:shadow-md focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 cursor-pointer">
                <div className="sm:col-span-2 flex">
                  <DocumentIcon className="h-6 w-6 inline" />
                  <span className="font-medium ml-2 text-gray-900 truncate">
                    {props.vendor.msas[0].document_name}
                  </span>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {props.vendor.msas[0].status.charAt(0).toUpperCase() +
                      props.vendor.msas[0].status.slice(1)}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Uploaded on
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDate(props.vendor.msas[0].created_at)}
                  </dd>
                </div>
              </div>
            ) : (
              <div className="text-center">
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
