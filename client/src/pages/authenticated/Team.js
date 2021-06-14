import React, { useState, useEffect } from "react";
import axios from "axios";
import { withToken } from "./../../lib/authHandler";
import StripedTable from "../../components/StripedTable";

const Team = (props) => {
  const [company, setCompany] = useState(props.user.companies[0]);
  const columnNames = [
    { displayName: "Name", field: "full_name", dataType: "text" },
    { displayName: "Email", field: "email", dataType: "text" },
    { displayName: "Joined", field: "created_at", dataType: "date" },
  ];

  useEffect(() => {
    let isMounted = true;
    const fetchCompany = async () => {
      try {
        const res = await axios.get(
          `/api/v1/companies/${company.id}`,
          withToken()
        );
        if (res.status === 200 && isMounted) {
          setCompany(res.data.company);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchCompany();
    return () => {
      isMounted = false;
    };
  }, [company]);

  return (
    <div className="p-2">
      <h1 className="mb-4 text-3xl font-extrabold text-gray-900">
        {company.name}
      </h1>
      {!company.users ? null : (
        <StripedTable columnNames={columnNames} tableData={company.users} />
      )}
    </div>
  );
};

export default Team;
