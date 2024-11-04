import React, { useState, useEffect } from "react";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import StaffDatas from "../../pages/Datatable/StaffData";
import { Sidebar } from "primereact/sidebar";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import axios, { Axios } from "axios"; // Import axios for API calls

interface City {
  name: string;
  code: string;
}

const StaffData: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCities, setSelectedCities] = useState<City[]>([]);
  const [visibleRight, setVisibleRight] = useState<boolean>(false); // Sidebar visibility state
  const [staffName, setStaffName] = useState<string>(""); // State for staff name
  const [staffRole, setStaffRole] = useState<string>(""); // State for staff role
  const [dob, setDob] = useState<Date | null>(null); // Date of birth state
  const [dropdownValue, setDropdownValue] = useState<string>("");
  const [dropdownValueBranch, setDropdownValueBranch] = useState<string>(""); // Dropdown state
  const [email, setEmail] = useState<string>(""); // Email state
  const [mobile, setMobile] = useState<string>(""); // Mobile state
  const [panCard, setPanCard] = useState<string>(""); // PAN card state
  const [aadharCard, setAadharCard] = useState<string>(""); // Aadhar card state
  const [userTypes, setUserTypes] = useState([]); // State to store user types from API

  const [dropdownOptions, setDropdownOptions] = useState<
    { label: string; value: number }[]
  >([]);

  const [dropdownOptionsBranch, setDropdownOptionsBranch] = useState<
    { label: string; value: number }[]
  >([]);

  const fetchUserTypeLabel = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + `/director/userTypeLabel`
      );

      console.log(response);

      if (response.data.text.success) {
        // Update state with the fetched dropdown options
        setDropdownOptions(
          response.data.text.userTypeLabel.map((item: any) => ({
            label: item.refUserType,
            value: item.refUtId,
          }))
        );

        setDropdownOptionsBranch(
          response.data.text.branch.map((item: any) => ({
            label: item.refBranchName,
            value: item.refbranchId,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching user type labels:", error);
    }
  };

  useEffect(() => {
    fetchUserTypeLabel();
  }, []);

  const cities: City[] = [
    { name: "All", code: "LDN" },
    { name: "Front Office", code: "NY" },
    { name: "Instructor", code: "RM" },
    { name: "Finance", code: "IST" },
  ];

  const handlePlusButtonClick = async () => {
    try {
      // const response = await axios.get(
      //   import.meta.env.VITE_API_URL + `/director/userTypeLabel`
      // );
      // console.log("response", response);
      // setUserTypes(response.data);
      setVisibleRight(true);
    } catch (error) {
      console.error("Error fetching user types:", error);
    }
  };

  const handleAddStaff = async () => {
    try {
      const staffData = {
        refFName: staffName,
        refLName: staffRole,
        refDob: dob,
        refUserType: dropdownValue,
        refbranchId: dropdownValueBranch,
        refEmail: email,
        refPhone: mobile,
        refPanCard: panCard,
        refAadharCard: aadharCard,
      };

      // Making the POST request to the API
      const response = await axios.post(
        import.meta.env.VITE_API_URL + `/director/addEmployee`,
        staffData
      );

      console.log("Staff added successfully:", response.data);

      setVisibleRight(false);
      setStaffName("");
      setStaffRole("");
      setDob(null);
      setDropdownValue("");
      setDropdownValueBranch("");
      setEmail("");
      setMobile("");
      setPanCard("");
      setAadharCard("");
    } catch (error) {
      console.error("Error adding staff:", error);
    }
  };

  return (
    <div className="usersTable">
      <div className="headerPrimary">
        <h3>STAFF DETAILS</h3>
        <div className="quickAcces">
          <div className="p-link layout-topbar-button">
            <i className="pi pi-user"></i>
          </div>
          <h3 className="ml-2 mr-5">User Name</h3>
        </div>{" "}
      </div>
      <div className="routesCont">
        <div className="routeContents">
          <div className="filterHeaders">
            <div className="card filterContents w-full md:w-12/12 mx-auto">
              <div
                className="filter w-full md:w-3/12 mx-auto"
                style={{ alignItems: "start", justifyContent: "start" }}
              >
                <MultiSelect
                  value={selectedCities}
                  onChange={(e: MultiSelectChangeEvent) =>
                    setSelectedCities(e.value)
                  }
                  options={cities}
                  optionLabel="name"
                  filter
                  placeholder="Select Options"
                  maxSelectedLabels={3}
                  className="w-16rem mt-3"
                />
              </div>

              <div
                className="filter w-full md:w-3/12 mx-auto"
                style={{ alignItems: "end", justifyContent: "end" }}
              >
                <p className="pr-5">Clear Filter</p>
                <p className="pr-5">Apply Filter</p>
                <Button
                  icon="pi pi-plus"
                  rounded
                  severity="success"
                  aria-label="Add Staff"
                  onClick={handlePlusButtonClick}
                />
              </div>
            </div>
          </div>
          <Divider />

          <StaffDatas />
        </div>
      </div>

      <Sidebar
        visible={visibleRight}
        onHide={() => setVisibleRight(false)}
        position="right"
        style={{ width: "60vw" }}
      >
        <h2>Add New Staff</h2>

        {/* Form content starts here */}
        <div className="p-fluid grid" style={{ justifyContent: "center" }}>
          {/* First Name and Last Name */}
          <div className="field col-5">
            <span className="p-float-label">
              <InputText
                id="firstName"
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
              />
              <label htmlFor="firstName">First Name</label>
            </span>
          </div>
          <div className="field col-5">
            <span className="p-float-label">
              <InputText
                id="lastName"
                value={staffRole}
                onChange={(e) => setStaffRole(e.target.value)}
              />
              <label htmlFor="lastName">Last Name</label>
            </span>
          </div>

          {/* Date of Birth and Dropdown */}
          <div className="field col-5">
            <span className="p-float-label">
              <Calendar
                id="dob"
                value={dob}
                onChange={(e) => setDob(e.value as Date)}
                dateFormat="dd/mm/yy"
              />
              <label htmlFor="dob">Date of Birth</label>
            </span>
          </div>
          <div className="field col-5">
            <span className="p-float-label">
              <Dropdown
                id="dropdown"
                value={dropdownValue}
                options={dropdownOptions}
                optionLabel="label"
                optionValue="value"
                onChange={(e) => setDropdownValue(e.value)}
                placeholder="Select Option"
              />
              <label htmlFor="dropdown">Select Role</label>
            </span>
          </div>

          {/* Email and Mobile */}
          <div className="field col-5">
            <span className="p-float-label">
              <InputText
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="email">Email</label>
            </span>
          </div>
          <div className="field col-5">
            <span className="p-float-label">
              <InputText
                id="mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
              <label htmlFor="mobile">Mobile</label>
            </span>
          </div>

          {/* PAN Card and Aadhar Card */}
          <div className="field col-5">
            <span className="p-float-label">
              <InputText
                id="panCard"
                value={panCard}
                onChange={(e) => setPanCard(e.target.value)}
              />
              <label htmlFor="panCard">PAN Card</label>
            </span>
          </div>
          <div className="field col-5">
            <span className="p-float-label">
              <InputText
                id="aadharCard"
                value={aadharCard}
                onChange={(e) => setAadharCard(e.target.value)}
              />
              <label htmlFor="aadharCard">Aadhar Card</label>
            </span>
          </div>

          <div className="field col-5">
            <span className="p-float-label">
              <Dropdown
                id="dropdownbranch"
                value={dropdownValueBranch}
                options={dropdownOptionsBranch}
                optionLabel="label"
                optionValue="value"
                onChange={(e) => setDropdownValueBranch(e.value)}
                placeholder="Select Branch"
              />
              <label htmlFor="dropdown">Select Branch</label>
            </span>
          </div>
        </div>
        <div
          className="buttons"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            label="Success"
            severity="success"
            raised
            onClick={handleAddStaff}
          />
        </div>
      </Sidebar>
    </div>
  );
};

export default StaffData;
