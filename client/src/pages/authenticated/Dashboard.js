import React from "react";

const Dashboard = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.replace("/");
  };

  return (
    <div className="p-8">
      <div className="mb-4">This is a placeholder dashboard!</div>
      <button
        type="button"
        onClick={handleLogout}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Log me out!
      </button>
    </div>
  );
};

export default Dashboard;
