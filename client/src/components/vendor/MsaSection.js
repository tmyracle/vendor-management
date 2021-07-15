import React, { useState } from "react";
import { Switch } from "@headlessui/react";
import { DocumentAddIcon } from "@heroicons/react/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const MsaSection = (props) => {
  const [enabled, setEnabled] = useState(false);

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
            checked={enabled}
            onChange={setEnabled}
            className={classNames(
              enabled ? "bg-green-600" : "bg-gray-200",
              "relative inline-flex float-right flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            )}
          >
            <span className="sr-only">Use setting</span>
            <span
              aria-hidden="true"
              className={classNames(
                enabled ? "translate-x-5" : "translate-x-0",
                "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
              )}
            />
          </Switch>
        </div>
        {enabled ? (
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            {props.vendor.msas.length >= 1 ? (
              <div>MSA GOES HERE </div>
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
