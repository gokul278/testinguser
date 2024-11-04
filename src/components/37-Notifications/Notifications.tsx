import React, { useState } from "react";
import "./Notifications.css";

import { Divider } from "primereact/divider";

import Notify from "../../pages/Datatable/Notify";
import { Dropdown } from "primereact/dropdown";

interface SelectType {
  name: string;
  code: string;
}

const Notifications: React.FC = () => {
  const SelectTypeOption: SelectType[] = [
    { name: "Student", code: "Student" },
    { name: "Staff", code: "Staff" },
  ];

  const [selectedType, setSelectedType] = useState(SelectTypeOption[0].code);

  return (
    <div className="usersTable">
      <div className="headerPrimary">
        <h3>USER AUDIT PAGE</h3>
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
                className="filter w-full md:w-3/12 mx-auto mt-"
                style={{ alignItems: "start", justifyContent: "start" }}
              >
                <Dropdown
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.value)}
                  options={SelectTypeOption}
                  optionLabel="name"
                  optionValue="code"
                />
              </div>

              <div
                className="filter w-full md:w-3/12 mx-auto"
                style={{ alignItems: "end", justifyContent: "end" }}
              >
                <p className="pr-5">Clear Filter</p>
                <p>Apply Filter</p>
              </div>
            </div>
          </div>
          <Divider />

          <Notify selectedType={selectedType} />
        </div>
      </div>
    </div>
  );
};

export default Notifications;
