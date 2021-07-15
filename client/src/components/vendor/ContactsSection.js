import React from "react";
import { ContactCard } from "../ContactCard";
import { UserAddIcon } from "@heroicons/react/solid";

const ContactsSection = (props) => {
  return (
    <section
      className="px-8 mt-4"
      aria-labelledby="applicant-information-title"
    >
      <div className="bg-white shadow border border-gray-200 sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2
            id="applicant-information-title"
            className="text-lg leading-6 font-medium text-gray-900"
          >
            Contacts
          </h2>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          {props.vendor.contacts && props.vendor.contacts.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
              {props.vendor.contacts.map((contact) => (
                <ContactCard
                  contact={contact}
                  key={contact.id}
                  fetchVendor={() => {
                    props.fetchVendor(true);
                  }}
                  toggleContactEditModal={() => {
                    props.toggleContactEditModal(contact);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center">
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No contacts
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding a contact.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={props.toggleContactAddModal}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <UserAddIcon
                    className="-ml-1 mr-2 h-5 w-5"
                    aria-hidden="true"
                  />
                  Add Contact
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactsSection;
