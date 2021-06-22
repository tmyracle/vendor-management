import React, { Fragment, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { withToken } from "./../../lib/authHandler";
import StripedTable from "../../components/StripedTable";
import { MailIcon } from "@heroicons/react/solid";
import { Dialog, Transition } from "@headlessui/react";
import { PaperAirplaneIcon } from "@heroicons/react/outline";

const Team = (props) => {
  const [company, setCompany] = useState(props.user.companies[0]);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const columnNames = [
    { displayName: "Name", field: "full_name", dataType: "text" },
    { displayName: "Email", field: "email", dataType: "text" },
    { displayName: "Joined", field: "created_at", dataType: "date" },
  ];

  const toggleInviteModal = () => {
    setInviteModalOpen(!inviteModalOpen);
  };

  const handleFullNameChange = (e) => {
    setFullName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const fetchCompany = useCallback(async (companyId, isMounted) => {
    try {
      const res = await axios.get(
        `/api/v1/companies/${companyId}`,
        withToken()
      );
      if (res.status === 200 && isMounted) {
        setCompany(res.data.company);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    const invitePayload = {
      full_name: fullName,
      email: email,
    };

    try {
      const res = await axios.post(
        "/api/v1/invite",
        invitePayload,
        withToken()
      );
      if (res.status === 200) {
        toggleInviteModal();
        fetchCompany(company.id, true);
      }
    } catch (err) {
      if (err.response.data.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage("Something went wrong.");
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchCompany(company.id, isMounted);
    return () => {
      isMounted = false;
    };
  }, [company.id, fetchCompany]);

  return (
    <div className="p-2">
      <h1 className="mb-4 text-3xl font-extrabold text-gray-900">
        {company.name}
      </h1>
      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={toggleInviteModal}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <MailIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Invite teammate
        </button>
      </div>
      {!company.users ? null : (
        <StripedTable columnNames={columnNames} tableData={company.users} />
      )}

      <Transition.Root show={inviteModalOpen} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed z-10 inset-0 overflow-y-auto"
          initialFocus={null}
          open={inviteModalOpen}
          onClose={toggleInviteModal}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div>
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                    <PaperAirplaneIcon
                      className="h-6 w-6 text-blue-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900 text-center"
                    >
                      Invite to team
                    </Dialog.Title>
                    <div className="space-y-6 mt-4">
                      {errorMessage ? (
                        <div className="text-red-500">{errorMessage}</div>
                      ) : (
                        <></>
                      )}
                      <div>
                        <label
                          htmlFor="fullName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Full name
                        </label>
                        <div className="mt-1">
                          <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            autoComplete="fullName"
                            onChange={handleFullNameChange}
                            required
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email address
                        </label>
                        <div className="mt-1">
                          <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            onChange={handleEmailChange}
                            required
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                    onClick={handleInviteSubmit}
                  >
                    Invite
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                    onClick={toggleInviteModal}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default Team;
