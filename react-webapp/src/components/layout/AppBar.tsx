import React, { FC } from "react";
import { useAuth0 } from "@auth0/auth0-react";

interface AppBarProps {
  showLogin?: boolean;
}

const AppBar: FC<AppBarProps> = ({ showLogin = true }) => {
  const { loginWithRedirect } = useAuth0();
  return (
    <div className="w-full h-16   backdrop-filter  items-center flex flex-row justify-between px-6 absolute top-0 left-0 z-10">
      {/* <img
        src="https://via.placeholder.com/40"
        alt="logo"
        className="w-10 h-10"
      /> */}
      <h3 className="text-xl font-semibold font-robotoMono">
        [PLACEHOLDER NAME]
      </h3>
      {showLogin && (
        <p
          onClick={() => loginWithRedirect()}
          className="text-sm font-semibold font-robotoMono hover:underline bg-black bg-opacity-50 p-2 rounded-md text-white cursor-pointer"
        >
          Login
        </p>
      )}
    </div>
  );
};

export default AppBar;
