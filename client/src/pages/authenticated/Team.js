import React, { useState, useEffect } from "react";
import axios from "axios";
import { withToken } from "./../../lib/authHandler";

const Team = (props) => {
  const [company, setCompany] = useState(props.user.companies[0]);
  console.log(company);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axios.get(
          `/api/v1/companies/${company.id}`,
          withToken()
        );
        if (res.status === 200) {
          setCompany(res.data.company);
          console.log(res.data.company);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchCompany();
  }, [company]);

  return (
    <div className="p-8">
      <div className="mb-4">{company.name}</div>
      {!company.users ? null : (
        <div>
          {company.users.map((user) => (
            <p>
              {user.full_name} - {user.email} -{" "}
              {new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "long",
                day: "2-digit",
              }).format(new Date(user.created_at))}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default Team;
