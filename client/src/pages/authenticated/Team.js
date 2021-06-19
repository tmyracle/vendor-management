import React, { Fragment, useRef, useState, useEffect } from "react";
import axios from "axios";
import { withToken } from "./../../lib/authHandler";
import StripedTable from "../../components/StripedTable";
import { MailIcon } from '@heroicons/react/solid'
import { Dialog, Transition } from '@headlessui/react'
import { PaperAirplaneIcon } from '@heroicons/react/outline'

const Team = (props) => {
  const [company, setCompany] = useState(props.user.companies[0]);
  const [inviteModalOpen, setInviteModalOpen] = useState(false)

  const columnNames = [
    { displayName: "Name", field: "full_name", dataType: "text" },
    { displayName: "Email", field: "email", dataType: "text" },
    { displayName: "Joined", field: "created_at", dataType: "date" },
  ];

  const handleInviteClick = () => {
    console.log(inviteModalOpen)
    setInviteModalOpen(true)
    console.log(inviteModalOpen)
  }

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
      <div className="flex justify-end mb-4">
      <button
        type="button"
        onClick={handleInviteClick}
        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <MailIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
        Invite teammate
      </button>
      </div>
      {!company.users ? null : (
        <StripedTable columnNames={columnNames} tableData={company.users} />
      )}

      {!inviteModalOpen ? null : (
        <Transition.Root show={inviteModalOpen} as={Fragment}>
          <Dialog
            as="div"
            static
            className="fixed z-10 inset-0 overflow-y-auto"
            open={inviteModalOpen}
            onClose={setInviteModalOpen(false)}
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
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
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
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                      <PaperAirplaneIcon className="h-6 w-6 text-blue-600 rotate-45" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                        Invite to team
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius aliquam laudantium explicabo
                          pariatur iste dolorem animi vitae error totam. At sapiente aliquam accusamus facere veritatis.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                      onClick={() => setInviteModalOpen(false)}
                    >
                      Invite
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                      onClick={() => setInviteModalOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
      )}
    </div>
  );
};

export default Team;
