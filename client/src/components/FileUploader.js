import React, { useState, useCallback } from "react";
import uploadToS3 from "../lib/fileUpload";
import toast from "react-hot-toast";
import { useDropzone } from "react-dropzone";
import { CloudUploadIcon, PaperClipIcon } from "@heroicons/react/outline";

const FileUploader = (props) => {
  const [files, setFiles] = useState(null);
  const onDrop = useCallback(
    (acceptedFiles) => {
      let s3Responses = [];
      acceptedFiles.forEach(async (file, index) => {
        const toastId = toast.loading("Loading...");
        const s3Response = await uploadToS3(file);
        s3Responses.push(s3Response);
        setFiles(acceptedFiles.slice(0, index + 1));
        toast.dismiss(toastId);
      });
      props.handleS3Response(s3Responses);
    },
    [props]
  );
  const { getRootProps, getInputProps } = useDropzone({
    multiple: props.multipleFilesAllowed,
    onDrop,
  });

  return (
    <>
      <div
        {...getRootProps()}
        className="flex justify-center mb-2 px-6 pt-5 pb-6 border-2 border-gray-300 hover:border-blue-500 border-dashed rounded-md bg-white cursor-pointer"
      >
        <div className="space-y-1 text-center">
          <CloudUploadIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-600">
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              {...getInputProps()}
              className="sr-only"
            />
            <p className="pl-1">Click to select file or drag and drop</p>
          </div>
        </div>
      </div>
      {files
        ? files.map((file) => (
            <div
              key={file.path}
              className="max-w-lg flex justify-start items-center mt-1 py-2 px-3 border border-gray-300 rounded-md bg-white"
            >
              <PaperClipIcon className="h-6 w-6 text-gray-500 mr-2" />
              <span className="text-sm truncate">{file.name}</span>
            </div>
          ))
        : null}
    </>
  );
};

export default FileUploader;
