import React from "react";
import "./RegisteredUsers.css";

import { Divider } from "primereact/divider";

import RegisteredDataTable from "../../pages/Datatable/RegisteredDataTable";

const RegisteredUsers: React.FC = () => {
  return (
    <div className="usersTable">
      <div className="headerPrimary">
        <h3>REGISTERED USER DATA</h3>
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

          <RegisteredDataTable />
        </div>
      </div>
    </div>
  );
};

export default RegisteredUsers;
