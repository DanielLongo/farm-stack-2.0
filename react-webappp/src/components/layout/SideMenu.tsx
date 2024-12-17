import React, { FC, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaDatabase,
  FaFolder,
  FaPaintBrush,
  FaCog,
  FaTasks,
  FaSearch,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { TbTools } from "react-icons/tb";
type Project = {
  id: string;
  name: string;
};

type SideMenuProps = {
  projects: Project[];
  selectedProject?: Project | null;
};

const SideMenu: FC<SideMenuProps> = ({ projects, selectedProject }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const createLinkTo = (path: string) => ({
    pathname: path,
    search: location.search,
  });

  const isActive = (path: string) => location.pathname.startsWith(path);

  const getLinkClass = (path: string) => `
    flex items-center px-2 py-2 rounded
    ${isCollapsed ? "justify-center" : ""}
    ${isActive(path) ? "bg-gray-700" : "hover:bg-gray-700"}
  `;

  return (
    <div
      className={`${
        isCollapsed ? "w-16" : "w-64"
      } flex-shrink-0 bg-slate-950 text-white flex flex-col border-r border-gray-800 transition-all duration-300 relative z-10`}
    >
      <button
        onClick={toggleCollapse}
        className="absolute top-1/2 -right-3 transform -translate-y-1/2 bg-slate-950 text-white p-1 rounded-full border border-gray-800"
      >
        {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
      </button>

      {/* Main Options */}
      <div className="flex-1 p-4 overflow-hidden">
        <ul>
          <li className="mb-4">
            <Link
              to={createLinkTo("/home/sources")}
              className={getLinkClass("/home/sources")}
            >
              <div className="flex items-center">
                <FaDatabase className="text-xl" />
                {!isCollapsed && (
                  <div className="flex items-center">
                    <span className="ml-3">Sources</span>
                    <span className="ml-2 bg-blue-500 text-white text-xs font-bold rounded-full px-2 py-1">
                      1
                    </span>
                  </div>
                )}
              </div>
            </Link>
          </li>
          <li className="mb-4">
            <Link
              to={createLinkTo("/home/search")}
              className={getLinkClass("/home/search")}
            >
              <FaSearch className="text-xl" />
              {!isCollapsed && <span className="ml-3">Search</span>}
            </Link>
          </li>
          {/* <li className="mb-4">
            <Link
              to={createLinkTo("/data/studio")}
              className={getLinkClass("/data/studio")}
            >
              <TbTools className="text-xl" />
              {!isCollapsed && <span className="ml-3">Studio</span>}
            </Link>
          </li> */}
        </ul>
      </div>

      {/* Project Settings */}
      <div className="p-4 border-t border-gray-800">
        <ul>
          <li className="mb-4">
            <Link
              to={createLinkTo("/job-status")}
              className={getLinkClass("/job-status")}
            >
              <FaTasks className="text-xl" />
              {!isCollapsed && <span className="ml-3">Job Status</span>}
            </Link>
          </li>
          <li>
            <Link
              to={createLinkTo("/settings")}
              className={getLinkClass("/settings")}
            >
              <FaCog className="text-xl" />
              {!isCollapsed && <span className="ml-3">Settings</span>}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideMenu;
