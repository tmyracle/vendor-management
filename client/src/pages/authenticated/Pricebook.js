import { PlusCircleIcon } from "@heroicons/react/outline";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import StripedTable from "../../components/StripedTable";
import { withToken } from "../../lib/authHandler";

const Pricebook = () => {
  const [lineItems, setLineItems] = useState([]);
  const handleNewLineItem = () => {};

  const fetchLineItems = useCallback(async (isMounted) => {
    try {
      const res = await axios.get(`/api/v1/line_items`, withToken());
      if (res.status === 200 && isMounted) {
        setLineItems(res.data);
      }
    } catch (error) {
      toast.error("Error fetching line items");
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetchLineItems(isMounted);
    return () => {
      isMounted = false;
    };
  }, [fetchLineItems]);

  const columnNames = [
    { displayName: "Description", field: "description", dataType: "text" },
    { displayName: "Unit Cost", field: "unit_price", dataType: "currency" },
    { displayName: "Unit", field: "unit", dataType: "text" },
    { displayName: "Last updated", field: "updated_at", dataType: "date" },
  ];

  return (
    <div className="p-8">
      <div className="mb-4 flex flex-row justify-between font-semibold text-2xl text-gray-900">
        <div>Pricebook</div>
        <div>
          <button
            type="button"
            onClick={() => handleNewLineItem()}
            className="inline-flex float-right items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusCircleIcon
              className="-ml-0.5 mr-2 h-4 w-4"
              aria-hidden="true"
            />
            Add pricing
          </button>
        </div>
      </div>
      <div>
        {lineItems && lineItems.length > 0 ? (
          <>
            <StripedTable
              columnNames={columnNames}
              tableData={lineItems}
              dataEditable={false}
            />
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Pricebook;
