import React, { useState, useEffect } from "react";
import { withToken } from "../lib/authHandler";
import axios from "axios";
import { SearchIcon, PlusCircleIcon } from "@heroicons/react/solid";
import toast from "react-hot-toast"

const VendorList = (props) => {
  const [vendors, setVendors] = useState(props.vendors);
  const [queryTerm, setQueryTerm] = useState("");

  const getVendorInitials = (vendor) => {
    const words = vendor.name.split(" ");
    if (words.length > 1) {
      return `${words[0][0].toUpperCase() + words[1][0].toUpperCase()}`;
    } else {
      return words[0][0];
    }
  };

  const handleQueryTermChange = (e) => {
    setQueryTerm(e.target.value);
  };

  useEffect(() => {
    const queryVendors = async () => {
      try {
        let config = withToken();
        config.params = { query_term: queryTerm };

        const res = await axios.get("/api/v1/vendor_list", config);
        if (res.status === 200) {
          setVendors(res.data);
        }
      } catch (error) {
        toast.error("Something went wrong fetching vendor list.")
      }
    };
    queryVendors();
  }, [queryTerm, props.vendors]);

  return (
    <aside className="hidden xl:order-first xl:flex xl:flex-col flex-shrink-0 w-96 border-r border-gray-200">
      <div className="px-6 pt-6 pb-4">
        <div>
          <h2 className="text-lg w-1/2 inline font-medium text-gray-900">
            Vendors
          </h2>
          <button
            type="button"
            onClick={props.toggleVendorAddModal}
            className="inline-flex float-right items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusCircleIcon
              className="-ml-0.5 mr-2 h-4 w-4"
              aria-hidden="true"
            />
            Add vendor
          </button>
        </div>
        <p className="mt-4 text-sm text-gray-600">
          Search directory of vendors
        </p>
        <form className="mt-2 flex space-x-4" action="#">
          <div className="flex-1 min-w-0">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                type="search"
                name="queryTerm"
                id="queryTerm"
                autoComplete="off"
                onChange={handleQueryTermChange}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search"
              />
            </div>
          </div>
        </form>
      </div>
      {/* Directory list */}
      {vendors ? (
        <nav className="flex-1 min-h-0 overflow-y-auto" aria-label="Directory">
          {Object.keys(vendors).map((letter) => (
            <div key={letter} className="relative">
              <div className="z-10 sticky top-0 border-t border-b border-gray-200 bg-gray-50 px-6 py-1 text-sm font-medium text-gray-500">
                <h3>{letter}</h3>
              </div>
              <ul className="relative z-0 divide-y divide-gray-200">
                {vendors[letter].map((vendor) => (
                  <li key={vendor.id}>
                    <div className="relative px-6 py-5 flex items-center space-x-3 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 flex rounded-full bg-gray-200 text-center justify-center items-center">
                          <span>{getVendorInitials(vendor)}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <button
                          onClick={() => props.handleVendorSelection(vendor)}
                          className="focus:outline-none container"
                        >
                          {/* Extend touch target to entire panel */}

                          <span
                            className="absolute inset-0"
                            aria-hidden="true"
                          />

                          <p className="text-sm text-left font-medium text-gray-900">
                            {vendor.name}
                          </p>
                          <p className="text-sm text-left text-gray-500 object-contain truncate">
                            {vendor.description}
                          </p>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      ) : null}
    </aside>
  );
};

export default VendorList;
