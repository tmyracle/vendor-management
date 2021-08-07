import React, { useState } from "react";
import axios from "axios";
import { withToken } from "../../lib/authHandler";
import toast from "react-hot-toast";
import FileUploader from "../../components/FileUploader";
import FillBar from "../../components/ui/FillBar";

const Dashboard = () => {
  const [msaId, setMsaId] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [s3Responses, setS3Responses] = useState(null);

  const handleMsaChange = (e) => {
    setMsaId(e.target.value);
  };

  const handleS3Response = (s3Responses) => {
    setS3Responses(s3Responses);
  };

  const handleFileUpload = async () => {
    const toastId = toast.loading("Uploading file");

    try {
      const res = await axios.patch(
        `api/v1/msas/${msaId}`,
        {
          document: s3Responses[0].blob_signed_id,
        },
        withToken()
      );
      if (res.status === 200) {
        setFileUrl(res.data.document_url);
        toast.success("File uploaded!", { id: toastId });
      }
    } catch (err) {
      toast.error("Error uploading file", { id: toastId });
    }
  };

  return (
    <div className="p-8">
      <div className="mb-4">
        This is a throwaway page for testing file uploads
      </div>
      <FillBar percentNumber={85} lowThreshold={30} midThreshold={70} />
      <p>let's upload a file</p>
      <div>
        <label
          htmlFor="companyName"
          className="block text-sm font-medium text-gray-700"
        >
          Object ID
        </label>
        <div className="mt-1">
          <input
            id="companyName"
            name="companyName"
            type="text"
            onChange={handleMsaChange}
            required
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
      <div className="mt-2">
        <FileUploader
          multipleFilesAllowed={true}
          handleS3Response={handleS3Response}
        />
        <button
          className="w-full flex justify-center mt-2 mb-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={handleFileUpload}
        >
          Upload!
        </button>
      </div>
      {fileUrl ? (
        <a href={fileUrl} target="_blank" rel="noreferrer">
          {fileUrl}
        </a>
      ) : null}
    </div>
  );
};

export default Dashboard;
