import React from 'react'

const Settings = () => {
  return (
    <div className="flex-1 max-h-screen xl:overflow-y-auto">
      <div className="max-w-3xl mx-auto mt-8 py-10 px-4 sm:px-6 lg:py-8 lg:px-8 bg-white border-gray-300 rounded-md shadow">
        <h1 className="text-3xl font-extrabold ">Account</h1>

        <form className="mt-6 space-y-8 divide-y divide-y-blue-gray-200">
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
            <div className="sm:col-span-6">
              <h2 className="text-xl font-medium">Profile</h2>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="full-name" className="block text-sm font-medium">
                Full name
              </label>
              <input
                type="text"
                name="full-name"
                id="full-name"
                autoComplete="given-name"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="photo" className="block text-sm font-medium">
                Photo
              </label>
              <div className="mt-1 flex items-center">
                <img
                  className="inline-block h-12 w-12 rounded-full"
                  src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80"
                  alt=""
                />
                <div className="ml-4 flex">
                  <div className="relative bg-white py-2 px-3 border border-blue-gray-300 rounded-md shadow-sm flex items-center cursor-pointer hover:bg-blue-gray-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-blue-gray-50 focus-within:ring-blue-500">
                    <label
                      htmlFor="user-photo"
                      className="relative text-sm font-medium pointer-events-none"
                    >
                      <span>Change</span>
                      <span className="sr-only"> user photo</span>
                    </label>
                    <input
                      id="user-photo"
                      name="user-photo"
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer border-gray-300 rounded-md"
                    />
                  </div>
                  <button
                    type="button"
                    className="ml-3 bg-transparent py-2 px-3 border border-transparent rounded-md text-sm font-medium  hover:text-blue-gray-700 focus:outline-none focus:border-blue-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-gray-50 focus:ring-blue-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
            <div className="sm:col-span-6">
              <h2 className="text-xl font-medium">Company Information</h2>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="company-name"
                className="block text-sm font-medium"
              >
                Company name
              </label>
              <input
                type="text"
                name="company-name"
                id="company-name"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <p className="text-sm text-blue-gray-500 sm:col-span-6">
              This account was created on{' '}
              <time>
                {new Intl.DateTimeFormat('en-US', {
                  dateStyle: 'medium',
                  timeStyle: 'medium',
                }).format(new Date())}
              </time>
              .
            </p>
          </div>

          <div className="pt-8 flex justify-end">
            <button
              type="button"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium  hover:bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Settings
