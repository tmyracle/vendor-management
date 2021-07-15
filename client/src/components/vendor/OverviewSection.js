import React from "react";

const OverviewSection = (props) => {
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    }).format(new Date(date));
  };
  return (
    <section
      className="px-8 mt-8"
      aria-labelledby="applicant-information-title"
    >
      <div className="bg-white shadow border border-gray-200 sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2
            id="applicant-information-title"
            className="text-lg leading-6 font-medium text-gray-900"
          >
            Overview
          </h2>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Website</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <a
                  href={`https://${props.vendor.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 text-sm text-blue-500 hover:text-blue-700"
                >
                  {props.vendor.website}
                </a>
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Vendor Added
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formatDate(props.vendor.created_at)}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">About</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {props.vendor.description}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
};

export default OverviewSection;
