import React from "react";
import { Link, withRouter } from "react-router-dom";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const MobileNavigation = withRouter((props) => {
  return (
    <nav className="px-2 space-y-1">
      {props.navigation.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          onClick={() => props.handleCloseSidebar()}
          className={classNames(
            item.href === props.location.pathname
              ? "bg-gray-900 text-white"
              : "text-gray-300 hover:bg-gray-700 hover:text-white",
            "group flex items-center px-2 py-2 text-base font-medium rounded-md"
          )}
        >
          <item.icon
            className={classNames(
              item.href === props.location.pathname
                ? "text-gray-300"
                : "text-gray-400 group-hover:text-gray-300",
              "mr-4 flex-shrink-0 h-6 w-6"
            )}
            aria-hidden="true"
          />
          {item.name}
        </Link>
      ))}
    </nav>
  );
});

export default MobileNavigation;
