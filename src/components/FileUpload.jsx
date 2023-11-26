import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [filesData, setFilesData] = useState([]);
  const fileRef = useRef(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [uploadedFilesData, setUploadedFilesData] = useState([]);

  useEffect(() => {
    if (selectedFile === null) return;

    // Prevent duplicate files
    if (files.find((file) => file.name === selectedFile.name)) return;

    // Add file to files array
    setFiles((prevState) => [...prevState, selectedFile]);
  }, [selectedFile]);

  useEffect(() => {
    // Create object to store file data
    const filesData = files.map((file) => ({
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`, // Format size to MB with 2 decimal places
      type: file.type,
    }));

    // Set filesData state
    setFilesData(filesData);
  }, [files]);

  const handleSelectedFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleRemoveFile = (fileName) => {
    // Remove files from files array
    setFiles((prevState) => prevState.filter((file) => file.name !== fileName));

    setSelectedFile(null);

    // Clear file input
    fileRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle file upload => send file to backend
    const formData = new FormData();

    files.forEach((file) => {
      console.log(file);
      formData.append("files[]", file);
    }); // Append files to formData

    console.log(formData);
    // Send formData to backend
    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };

      axios
        .post("https://file-upload-yzdg.onrender.com/upload", formData, config)
        .then((res) => {
          createDownloadLinks();
          setIsUploaded(true);
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log("Error uploading files:", error);
    }
  };

  const createDownloadLinks = () => {
    filesData.forEach((file) => {
      const newFileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        downloadURL: `https://file-upload-yzdg.onrender.com/download/${file.name}`,
      };
      setUploadedFilesData((prevState) => [...prevState, newFileData]);
    });
  };

  return (
    <div className="flex flex-col justify-center items-center w-1/2 min-h-[400px] bg-white rounded-md p-4 py-8 gap-8">
      <h1 className="text-blue-500 font-medium text-2xl">Upload File</h1>
      <form
        className="flex flex-col w-3/4 gap-4"
        onSubmit={(e) => handleSubmit(e)}
      >
        <label
          htmlFor="fileInput"
          className="cursor-pointer border-blue-500 border-dotted border-2 text-blue-500 rounded-md p-2 h-[150px] flex flex-col justify-center items-center"
        >
          Browse file to upload
          <input
            ref={fileRef}
            type="file"
            id="fileInput"
            className="hidden"
            onChange={(e) => handleSelectedFileChange(e)}
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
      {filesData.length > 0 && !isUploaded && (
        <div className="flex flex-col w-3/4 gap-4">
          <h1 className="text-blue-500 font-medium text-2xl">
            Files pending to upload
          </h1>
          <ul className="flex flex-col gap-4 max-h-60 overflow-y-auto">
            {filesData.map((file, index) => (
              <li
                key={index}
                className="flex flex-col gap-2 bg-gray-100 rounded-md p-2 relative"
              >
                <span className="text-blue-500 font-medium text-lg">
                  {file.name}
                </span>
                <span className="text-gray-500 font-medium text-md">
                  {file.size}
                </span>
                <span className="text-gray-500 font-medium text-md">
                  {file.type}
                </span>
                <div
                  type="button"
                  className="absolute top-3 right-4 text-red-500 hover:text-red-700 cursor-pointer text-center"
                  onClick={() => handleRemoveFile(file.name)}
                >
                  X
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {uploadedFilesData.length > 0 && isUploaded && (
        <div className="flex flex-col w-3/4 gap-4">
          <h1 className="text-blue-500 font-medium text-2xl">Files uploaded</h1>
          <ul className="flex flex-col gap-4 max-h-60 overflow-y-auto">
            {uploadedFilesData.map((file, index) => (
              <li
                key={index}
                className="flex flex-col gap-2 bg-gray-100 rounded-md p-2 relative"
              >
                <span className="text-blue-500 font-medium text-lg">
                  {file.name}
                </span>
                <span className="text-gray-500 font-medium text-md">
                  {file.size}
                </span>
                <span className="text-gray-500 font-medium text-md">
                  {file.type}
                </span>
                <a
                  href={file.downloadURL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 font-medium text-md"
                >
                  Download
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
