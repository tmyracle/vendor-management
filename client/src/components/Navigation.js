import { LogoutIcon } from '@heroicons/react/outline'
import React from 'react'
import { Link, withRouter } from 'react-router-dom'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Navigation = withRouter((props) => {
  return (
    <div className="flex flex-col h-0 flex-1 bg-gray-800">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="logo-name text-3xl text-white">vendurr</div>
          {/*
          <img
            className="h-8 w-auto"
            src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg"
            alt="Workflow"
          />
          */}
        </div>
        <nav
          className="mt-5 flex-1 px-2 bg-gray-800 space-y-1"
          aria-label="Sidebar"
        >
          {props.navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={classNames(
                item.href === props.location.pathname
                  ? 'bg-gray-900 text-white hover:text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
              )}
            >
              <item.icon
                className={classNames(
                  item.href === props.location.pathname
                    ? 'text-gray-300'
                    : 'text-gray-400 group-hover:text-gray-300',
                  'mr-3 flex-shrink-0 h-6 w-6',
                )}
                aria-hidden="true"
              />
              <span className="flex-1">{item.name}</span>
              {item.count ? (
                <span
                  className={classNames(
                    item.href === props.location.pathname
                      ? 'bg-gray-800'
                      : 'bg-gray-900 group-hover:bg-gray-800',
                    'ml-3 inline-block py-0.5 px-3 text-xs font-medium rounded-full',
                  )}
                >
                  {item.count}
                </span>
              ) : null}
            </Link>
          ))}
        </nav>
      </div>
      <div>
        <div
          onClick={props.handleLogout}
          className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-4 py-4 text-sm font-medium cursor-pointer"
        >
          <LogoutIcon
            className="text-gray-400 group-hover:text-gray-300 mr-3 flex-shrink-0 h-6 w-6"
            aria-hidden="true"
          />
          <span className="flex-1">Log out</span>
        </div>
      </div>
      <div className="flex-shrink-0 flex bg-gray-700 p-4">
        <Link to="/profile" className="flex-shrink-0 w-full group block">
          <div className="flex items-center">
            <div>
              <img
                className="inline-block h-9 w-9 rounded-full"
                src={props.user.companies[0].logo_url}
                alt=""
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">
                {props.user.full_name}
              </p>
              <p className="text-xs font-medium text-gray-300 group-hover:text-gray-200">
                {props.user.companies[0].name}
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
})

export default Navigation
