import React, { useState } from "react";
import "./UsersDir.css";

import { Divider } from "primereact/divider";

import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import UserDirData from "../../pages/Datatable/UserDirData";

interface City {
  name: string;
  code: string;
}

const UsersDir: React.FC = () => {
  const [selectedCities, setSelectedCities] = useState<City | null>(null);
  const cities: City[] = [
    { name: "All", code: "LDN" },
    { name: "Trial", code: "NY" },
    { name: "Student", code: "RM" },
    { name: "Payment Pending", code: "IST" },
  ];

  return (
    <div className="usersTable">
      <div className="headerPrimary">
        <h3>USER DETAILS</h3>
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
                  className="w-16rem mt-2"
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

          <UserDirData />
        </div>
      </div>
    </div>
  );
};

export default UsersDir;
