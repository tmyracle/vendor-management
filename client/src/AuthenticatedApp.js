import React, { useEffect, useState, useContext, Fragment } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import {
  HomeIcon,
  MenuAlt2Icon,
  UsersIcon,
  BriefcaseIcon,
  XIcon,
  CogIcon,
} from "@heroicons/react/outline";
import { Dialog, Transition } from "@headlessui/react";
import Navigation from "./components/Navigation";
import MobileNavigation from "./components/MobileNavigation";
import Dashboard from "./pages/authenticated/Dashboard";
import Team from "./pages/authenticated/Team";
import Settings from "./pages/authenticated/Settings";
import Projects from "./pages/authenticated/Projects";
import FileUploadTest from "./pages/authenticated/FileUploadTest";
import Vendors from "./pages/authenticated/Vendors";
import { useAuth, withToken } from "./lib/authHandler";
import toast from "react-hot-toast";

const navigation = [
  { name: "Dashboard", icon: HomeIcon, href: "/dashboard", current: true },
  {
    name: "Vendors",
    icon: BriefcaseIcon,
    href: "/vendors",
    current: false,
  },
  { name: "Team", icon: UsersIcon, href: "/team", current: false },
  { name: "Settings", icon: CogIcon, href: "/settings", current: false },
];

export default function AuthenticatedApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const { clearAuth, clearUser } = useAuth();

  const handleLogout = () => {
    clearAuth();
    clearUser();
    localStorage.removeItem("token");
    window.location.replace("/");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/v1/auto_login", withToken());
        if (res.data.isAuthenticated) {
          setCurrentUser(res.data.user);
        }
      } catch (error) {
        toast.error("Something went wrong.");
      }
    };
    fetchUser();
  }, []);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="h-screen flex overflow-hidden bg-gray-100">
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            static
            className="fixed inset-0 flex z-40 md:hidden"
            open={sidebarOpen}
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-gray-800">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex-shrink-0 flex items-center px-4">
                  <img
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg"
                    alt="Workflow"
                  />
                </div>
                <div className="mt-5 flex-1 h-0 overflow-y-auto">
                  <MobileNavigation
                    navigation={navigation}
                    handleCloseSidebar={() => setSidebarOpen(false)}
                  />
                </div>
              </div>
            </Transition.Child>
            <div className="flex-shrink-0 w-14" aria-hidden="true">
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <Navigation
              user={currentUser}
              navigation={navigation}
              handleLogout={handleLogout}
            />
          </div>
        </div>
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow md:hidden">
            <button
              className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div>
              <div className="mx-auto">
                {/* Replace with your content */}
                <Switch>
                  <Route path="/dashboard" onEnter>
                    <Dashboard user={currentUser} />
                  </Route>
                  <Route path="/vendors">
                    <Vendors />
                  </Route>
                  <Route path="/team">
                    <Team user={currentUser} />
                  </Route>
                  <Route path="/projects">
                    <Projects />
                  </Route>
                  <Route path="/file_upload_test">
                    <FileUploadTest />
                  </Route>{" "}
                  <Route path="/settings">
                    <Settings />
                  </Route>
                  <Route path="/*">
                    <Redirect to="/dashboard" />
                  </Route>
                </Switch>
                {/* /End replace */}
              </div>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}
