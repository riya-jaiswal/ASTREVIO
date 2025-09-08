import React from "react";
import { useNavigate } from "react-router-dom";

function PageNotFound() {
  const nav = useNavigate();
  return (
    <div className="w-screen h-screen flex  justify-center items-center">
      <div className="space-y-6 flex flex-col justify-center items-center">
        <h2 className="">404! </h2>
        <h3 className="">Page Not Found</h3>
        <div>
          <button
            onClick={() => {
              nav("/");
            }}
          >
            Back To Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default PageNotFound;
