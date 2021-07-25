import CryptoJS from "crypto-js";
import axios from "axios";
import { withToken } from "./authHandler";
import toast from "react-hot-toast";

const md5FromFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (fileEvent) => {
      let binary = CryptoJS.lib.WordArray.create(fileEvent.target.result);
      const md5 = CryptoJS.MD5(binary);
      resolve(md5);
    };
    reader.onerror = () => {
      reject("Something went wrong.");
    };

    reader.readAsArrayBuffer(file);
  });
};

const fileChecksum = async (file) => {
  const md5 = await md5FromFile(file);
  const checksum = md5.toString(CryptoJS.enc.Base64);
  return checksum;
};

const createPresignedUrl = async (file, byte_size, checksum) => {
  const contentTypes = {
    jpeg: "image/jpeg",
    jpg: "image/jpg",
    png: "image/png",
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  };

  const fileContentType = () => {
    let extension = file.name.split(".").pop();
    if (!!contentTypes[extension]) {
      return contentTypes[extension];
    } else {
      toast.error("File type not supported");
    }
  };

  const payload = {
    file: {
      filename: file.name,
      byte_size: byte_size,
      checksum: checksum,
      content_type: fileContentType(),
    },
  };

  try {
    const res = await axios.post("api/v1/presigned_url", payload, withToken());
    if (res.status === 200) {
      return res;
    }
  } catch (err) {
    toast.error("Error uploading file");
  }
};

const uploadToS3 = async (file) => {
  const checksum = await fileChecksum(file);
  const presignedFileParams = await createPresignedUrl(
    file,
    file.size,
    checksum
  );
  try {
    const awsRes = await axios.put(
      presignedFileParams.data.direct_upload.url,
      file,
      { headers: presignedFileParams.data.direct_upload.headers }
    );
    if (awsRes.status === 200) {
      return presignedFileParams.data;
    } else {
      toast.error("Something went wrong uploading file");
    }
  } catch (err) {
    toast.error("Error uploading the file");
    return err;
  }
};

export default uploadToS3;
