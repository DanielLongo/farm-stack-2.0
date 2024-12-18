import React, { FC, useEffect, useState } from "react";
import { FiHelpCircle, FiChevronDown, FiUser, FiLogOut } from "react-icons/fi";
import SourcesView from "./SourcesView";
import DatasetsView from "./DatasetsView";
import StudioView from "./StudioView";
import SideMenu from "../../components/layout/SideMenu";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import useUser from "../../hooks/useUser";
import { Auth0ProviderWithNavigate } from "../../core/auth0ProviderWithNavigate";
type View = "sources" | "datasets" | "studio" | "search";

interface HomePageProps {
  urlView?: View;
}

const HomePage: FC<HomePageProps> = ({ urlView }) => {
  const { logout } = useAuth0();
  const { user, userFetchError, userFetchLoading } = useUser();
  const [view, setView] = useState<View>(urlView || "sources");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const renderView = () => {
    switch (view) {
      case "sources":
        return <SourcesView />;
      case "search":
        return <DatasetsView />;
      case "studio":
        return <StudioView />;
    }
  };
  useEffect(() => {
    setView(urlView || "sources");
  }, [urlView]);
  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white">
      <div className="bg-slate-900 p-4 flex justify-between items-center w-full">
        <div className="flex flex-row space-x-4 justify-between items-center">
          <h1 className="text-xl font-semibold">LIBRE</h1>
          <div className="relative">
            Sample Project
            {/* {projectsDataLoading || !projectsData ? (
              <div className="animate-pulse bg-slate-500 border border-slate-700 text-white py-1 px-4 pr-8 rounded leading-tight w-48 h-8"></div>
            ) : projectsDataError ? (
              <div className="text-red-500">Error loading projects</div>
            ) : (
              <select
                className="appearance-none bg-slate-800 border border-slate-700 text-white py-1 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-slate-700 focus:border-slate-500"
                onChange={(e) => handleProjectSelect(e.target.value)}
              >
                <option>Select Project</option>
                {projectsData.map((project, index) => (
                  <option key={index} value={project.project_unique_name}>
                    {project.project_unique_name}
                  </option>
                ))}
              </select> 
            )}*/}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-300 hover:text-white">
            <FiHelpCircle size={24} />
          </button>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                  userFetchLoading ? "animate-pulse bg-gray-600" : "bg-gray-500"
                }`}
              >
                {userFetchLoading ? "" : user?.name.charAt(0)}
              </div>
              <FiChevronDown
                className={`transition-transform duration-200 ${
                  isDropdownOpen ? "transform rotate-180" : ""
                }`}
              />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg py-1 z-10">
                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-slate-700">
                  <FiUser className="mr-2" />
                  Admin
                </button>
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-slate-700"
                  onClick={() => {
                    logout({
                      logoutParams: { returnTo: window.location.origin },
                    });
                  }}
                >
                  <FiLogOut className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        {/* {selectedProject ? ( */}
        <>
          <SideMenu projects={[]} selectedProject={null} />
          <div className="flex-1 bg-gray-850 overflow-auto">{renderView()}</div>
        </>
        {/* ) : ( */}
        {/* <div className="flex-1 flex items-center justify-center">
            <p className="text-xl text-gray-400">
              Select a Project to get started
            </p>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default withAuthenticationRequired(HomePage, {
  returnTo: "/",
  onRedirecting: () => <HomePage />,
});
