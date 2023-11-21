import React from "react";

const FileUpload = () => {
  return (
    <div className="flex flex-col justify-center items-center h-1/2 w-1/2 bg-white rounded-md p-4 gap-8">
      <h1 className="text-blue-500 font-medium text-2xl">Upload File</h1>
      <form className="flex flex-col w-3/4 gap-4">
        <label
          htmlFor="fileInput"
          className="cursor-pointer border-blue-500 border-dotted border-2 text-blue-500 rounded-md p-2 h-[150px] flex flex-col justify-center items-center"
        >
          Browse file to upload
          <input
            type="file"
            id="fileInput"
            className="hidden"
            // Add any additional input attributes or event handlers as needed
          />
        </label>
        <button
          type="submit"
          className="bg-blue-500 text-white hover:bg-blue-700 transition duration-100 rounded-md p-2 cursor-pointer"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
