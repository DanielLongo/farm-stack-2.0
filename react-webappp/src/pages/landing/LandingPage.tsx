import React, { FC } from "react";
import AppBar from "../../components/layout/AppBar";
import nyc_sunrise from "../../assets/media/nyc_sunrise.mp4";
import { Link } from "react-router-dom";
const LandingPage: FC = () => {
  return (
    <div className="h-screen w-screen flex flex-col">
      <AppBar />
      <div className="flex-grow flex flex-col md:flex-row items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-10 w-full md:w-1/2  md:px-16">
          <div className="w-full max-w-[650px]">
            <p className="text-6xl font-roboto text-left">Trust Your Sources</p>
          </div>
          <div className="w-full max-w-[650px]">
            <p className="text-lg text-gray-500 font-robotoMono text-left">
              Define the accuracy of the sources you consume
            </p>
          </div>
          <div className="w-full max-w-[650px] flex justify-start items-center space-x-4">
            <button className="bg-black text-white px-4 py-2 rounded-md">
              Contact
            </button>
            <Link
              to="/playground"
              className="bg-white text-black px-4 py-2 rounded-md border border-black hover:bg-gray-200 hover:text-black transition-all duration-300"
            >
              Try an Instance
            </Link>
          </div>
          {/* <div className="w-full max-w-[650px] flex flex-col space-y-2">
            <p className="text-lg text-gray-500 font-robotoMono text-left">
              Products
            </p>
            <p className="text-lg font-robotoMono">
              <span className="font-bold">Leland</span> Generating datasets
            </p>
            <p className="text-lg font-robotoMono">
              <span className="font-bold">Oracle</span> Scoring epistemic
              authority
            </p>
          </div> */}
        </div>
        <div className="flex items-center justify-center w-full md:w-1/2 h-screen">
          <video
            src={nyc_sunrise}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover "
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
