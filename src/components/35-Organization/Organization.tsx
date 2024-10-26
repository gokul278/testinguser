import React, { useState } from "react";
import { OrganizationChart } from "primereact/organizationchart";

const Organization: React.FC = () => {
  const [data] = useState([
    {
      label: "Director",
      expanded: true,
      children: [
        {
          label: "Finance Manager",
          expanded: true,
          children: [
            {
              label: "Front Office",
            },
          ],
        },
        {
          label: "Therapist",
          expanded: true,
        },
        {
          label: "Admin",
          expanded: true,
          children: [
            {
              label: "Front Office",
            },
            {
              label: "Instructor",
            },
          ],
        },
      ],
    },
  ]);
  return (
    <div>
      <div className="headerPrimary">
        <h3>Organization Chart</h3>
        <div className="quickAcces">
          <div className="p-link layout-topbar-button">
            <i className="pi pi-user"></i>
          </div>
          <h3 className="ml-2 mr-5">User Name</h3>
        </div>{" "}
      </div>
      <div className="card orgChart overflow-x-auto">
        <OrganizationChart value={data} />
      </div>
    </div>
  );
};

export default Organization;
