import React, { useState, useEffect } from "react";
import axios from "axios";
import { withToken } from "../../lib/authHandler";
import VendorDetail from "../../components/VendorDetail";
import VendorList from "../../components/VendorList";
import AddVendorModal from "../../components/AddVendorModal";
import VendorEdit from "../../components/VendorEdit";

const Vendors = () => {
  const [vendors, setVendors] = useState();
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [addVendorModalOpen, setAddVendorModalOpen] = useState(false);
  const [editFormVisible, setEditFormVisible] = useState(false);

  const toggleAddVendorModal = () => {
    setAddVendorModalOpen(!addVendorModalOpen);
  };

  const toggleEditFormVisible = () => {
    console.log("I have been toggled");
    setEditFormVisible(!editFormVisible);
  };

  const handleVendorSelection = (v) => {
    setSelectedVendor(v);
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
          handleVendorSelection={handleVendorSelection}
          toggleAddVendorModal={toggleAddVendorModal}
        />
        <VendorDetail
          vendor={selectedVendor}
          toggleEditFormVisible={toggleEditFormVisible}
        />
        <VendorEdit
          vendor={selectedVendor}
          isVisible={editFormVisible}
          toggleEditFormVisible={toggleEditFormVisible}
        />
        <AddVendorModal
          isOpen={addVendorModalOpen}
          toggleAddVendorModal={toggleAddVendorModal}
        />
      </div>
    </div>
  );
};

export default Vendors;
