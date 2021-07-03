import React, { useState, useEffect } from "react";
import axios from "axios";
import { withToken } from "../../lib/authHandler";
import VendorDetail from "../../components/VendorDetail";
import VendorList from "../../components/VendorList";
import AddVendorModal from "../../components/AddVendorModal";

const Vendors = () => {
  const [vendors, setVendors] = useState();
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [addVendorModalOpen, setAddVendorModalOpen] = useState(false);

  const toggleAddVendorModal = () => {
    setAddVendorModalOpen(!addVendorModalOpen);
  };

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await axios.get("/api/v1/vendor_list", withToken());
        if (res.status === 200) {
          setVendors(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchVendors();
  }, [addVendorModalOpen]);

  return (
    <div className="h-screen flex overflow-hidden bg-white">
      <div className="flex-1 relative z-0 flex overflow-hidden">
        <VendorList
          vendors={vendors}
          toggleAddVendorModal={toggleAddVendorModal}
        />
        <VendorDetail vendor={selectedVendor} />
        <AddVendorModal
          isOpen={addVendorModalOpen}
          toggleAddVendorModal={toggleAddVendorModal}
        />
      </div>
    </div>
  );
};

export default Vendors;
