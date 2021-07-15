import React, { useState } from "react";
import parsePhoneNumber from "libphonenumber-js";
import { TrashIcon } from "@heroicons/react/outline";
import { ContactDeleteConfirmation } from "./ContactDeleteConfirmation";

export const ContactCard = (props) => {
  const [open, setOpen] = useState(false);
  const fields = [
    {
      field: "primary_phone",
      displayName: "Primary phone",
      value: props.contact.primary_phone,
    },
    {
      field: "secondary_phone",
      displayName: "Secondary phone",
      value: props.contact.secondary_phone,
    },
    { field: "email", displayName: "Email", value: props.contact.email },
    { field: "name", displayName: "Notes", value: props.contact.notes },
  ];

  const getInitials = (field) => {
    const words = field.split(" ");
    if (words.length > 1) {
      return `${words[0][0].toUpperCase() + words[1][0].toUpperCase()}`;
    } else {
      return words[0][0];
    }
  };

  const formatField = (field) => {
    if (field.field === "primary_phone" || field.field === "secondary_phone") {
      if (field.value && field.value.length > 0) {
        const phoneNumber = parsePhoneNumber(field.value, "US");
        return phoneNumber.formatNational();
      } else {
        return field.value;
      }
    } else {
      return field.value;
    }
  };

  const handleContactClick = () => {
    props.toggleContactEditModal();
  };

  const handleDeleteIconClick = (e) => {
    e.stopPropagation();
    setOpen(!open);
  };

  return (
    <div
      className="relative group rounded-lg border border-gray-200  bg-white px-6 py-5 shadow-sm hover:shadow-md flex items-center space-x-3 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 cursor-pointer"
      onClick={handleContactClick}
    >
      <TrashIcon
        className="absolute right-6 z-10 top-5 h-6 w-6 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100"
        onClick={handleDeleteIconClick}
      />
      <div className="flex-shrink-0">
        <div className="h-12 w-12 flex rounded-full bg-gray-200 text-center justify-center items-center">
          <span>{getInitials(props.contact.name)}</span>
        </div>
      </div>
      <div className="flex-1 pl-4">
        <span className="absolute inset-0" aria-hidden="true" />
        <div className="flex items-center space-x-3">
          <p className="font-medium text-gray-900 sm:col-span-2">
            {props.contact.name}
          </p>
          {props.contact.title && props.contact.title.length > 0 ? (
            <span className="flex-shrink-0 inline-block ml-2 px-2 py-0.5 text-gray-800 text-xs font-medium bg-gray-200 rounded-full">
              {props.contact.title}
            </span>
          ) : null}
        </div>
        <div className="flex-1 mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
          {fields.map((field) => (
            <div key={field.field} className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                {field.displayName}
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formatField(field)}
              </dd>
            </div>
          ))}
        </div>
      </div>
      {open ? (
        <ContactDeleteConfirmation
          contact={props.contact}
          open={open}
          fetchVendor={props.fetchVendor}
          toggleAlert={handleDeleteIconClick}
        />
      ) : null}
    </div>
  );
};
