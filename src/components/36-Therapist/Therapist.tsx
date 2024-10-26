import React, { useState } from "react";
import { Divider } from "primereact/divider";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import TherapistTable from "../../pages/Datatable/TherapistTable";

interface City {
  name: string;
  code: string;
}

const Therapist: React.FC = () => {
  const [selectedCities, setSelectedCities] = useState<City[]>([]);

  const cities: City[] = [
    { name: "All", code: "LDN" },
    { name: "Front Office", code: "NY" },
    { name: "Instructor", code: "RM" },
    { name: "Finance", code: "IST" },
  ];

  return (
    <div className="usersTable">
      <div className="headerPrimary">
        <h3>THERAPIST USERS</h3>
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
              </div>
            </div>
          </div>
          <Divider />

          <TherapistTable />
        </div>
      </div>
    </div>
  );
};

export default Therapist;
