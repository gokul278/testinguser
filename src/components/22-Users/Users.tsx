import React, { useState } from "react";
import "./Users.css";

import { Divider } from "primereact/divider";

import Datatables from "../../pages/Datatable/Datatable";

import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";

interface City {
  name: string;
  code: string;
}

const Users: React.FC = () => {
  const [selectedCities, setSelectedCities] = useState<City | null>(null);
  const cities: City[] = [
    { name: "New York", code: "NY" },
    { name: "Rome", code: "RM" },
    { name: "London", code: "LDN" },
    { name: "Istanbul", code: "IST" },
    { name: "Paris", code: "PRS" },
  ];

  return (
    <div className="usersTable">
      <div className="headerPrimary">
        <h3>SIGNED UP USER DATA</h3>
        <div className="quickAcces">
          <div className="p-link layout-topbar-button">
            <i className="pi pi-user"></i>
          </div>
          <h3 className="ml-2 mr-5">User Name</h3>
        </div>{" "}
      </div>
      <div className="routesCont">
        <div className="routeContents">
          <Divider />

          <Datatables />
        </div>
      </div>
    </div>
  );
};

export default Users;
