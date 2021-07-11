import React from "react";

export const ContactCard = (props) => {
  const fields = [{ field: "", displayName: "", value: "" }];

  return (
    <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
      <div className="flex-shrink-0">
        <img className="h-10 w-10 rounded-full" src={null} alt="" />
      </div>
      <div className="flex-1 min-w-0">
        <a href="/" className="focus:outline-none">
          <span className="absolute inset-0" aria-hidden="true" />
          <p className="text-sm font-medium text-gray-900">
            {props.contact.name}
          </p>
          <p className="text-sm text-gray-500 truncate">
            {props.contact.title}
          </p>
          {/*
          <div key={field} className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">{field}</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {profile.fields[field]}
            </dd>
          </div>
          */}
        </a>
      </div>
    </div>
  );
};
