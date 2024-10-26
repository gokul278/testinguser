import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Button } from "primereact/button";
import Axios from "axios";

import { TabView, TabPanel } from "primereact/tabview";
import { Fieldset } from "primereact/fieldset";
import { Sidebar } from "primereact/sidebar";

import { FilterMatchMode } from "primereact/api"; // Import FilterMatchMode for global filtering

interface Customer {
  id: string;
  userId: string;
  fname: string;
  lname: string;
  email: string;
  date: string;
  mobile: string;
  refStDOB: string;
  refStFName: string;
  refCtEmail: string;
  refStLName: string;
  comments?: string;
  commentEnabled?: boolean;
}

interface UserDetails {
  id: string;
  code: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  quantity: number;
  inventoryStatus: string;
  rating: number;
}

export default function StaffDatas() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>([]);
  const [visibleLeft, setVisibleLeft] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<Customer | null>(null);
  const [UserDetailss, setUserDetailss] = useState<UserDetails[]>([]);

  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");

  // Filters state
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  // Function to fetch customers
  const fetchCustomers = async () => {
    try {
      const response = await Axios.get(
        import.meta.env.VITE_API_URL + `/director/staff`
      );

      const fetchedCustomers: Customer[] = (
        response.data.text.data as unknown[]
      ).map((customer: any) => ({
        id: customer.refStId,
        userId: customer.refSCustId,
        fname: customer.refStFName + " " + customer.refStLName,
        lname: customer.refStLName,
        email: customer.refCtEmail || "",
        trial: customer.refUserTypeName || "Trial",
        date: customer.transTime || "",
        mobile: customer.refCtMobile,
        comments: "",
        commentEnabled: false,
      }));

      setCustomers(fetchedCustomers);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const onGlobalFilterChange = (e: any) => {
    const value = e.target.value;
    const _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(customers);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      saveAsExcelFile(excelBuffer, "customers");
    });
  };

  const saveAsExcelFile = (buffer: Uint8Array, fileName: string) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        const EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const EXCEL_EXTENSION = ".xlsx";
        const data = new Blob([buffer], { type: EXCEL_TYPE });

        module.default.saveAs(
          data,
          `${fileName}_export_${new Date().getTime()}${EXCEL_EXTENSION}`
        );
      }
    });
  };

  const renderHeader = () => {
    return (
      <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </IconField>

        <div className="flex align-items-center justify-content-end gap-2">
          <Button
            type="button"
            severity="success"
            onClick={exportExcel}
            data-pr-tooltip="XLS"
          >
            Export As Excel
          </Button>
        </div>
      </div>
    );
  };

  const fetchUserDetails = async (id: string) => {
    try {
      const payload = {
        refStId: id,
      };
      console.log("payload", payload);

      const response = await Axios.post(
        import.meta.env.VITE_API_URL + `/director/userData`,
        payload
      );

      console.log("API response:", response.data);

      const userData = response.data.userTransaction;
      const userDetails = response.data.UserData[0];

      console.log("userDetails", userDetails);
      setUserDetails(userDetails);

      console.log("userData", userData);
      setUserDetailss(userData);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const onUserIdClick = (id: string, rowData: string) => {
    setSelectedUserId(rowData);
    console.log("rowData", rowData);
    fetchUserDetails(id);

    setVisibleLeft(true);
  };

  const userIdTemplate = (rowData: Customer) => {
    return (
      <Button
        label={rowData.userId}
        className="p-button-link"
        style={{ textAlign: "start" }}
        onClick={() => onUserIdClick(rowData.id, rowData.userId)}
      />
    );
  };

  const header = renderHeader();

  return (
    <div className="card" style={{ overflow: "auto" }}>
      <DataTable
        value={customers}
        paginator
        header={header}
        rows={10}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        rowsPerPageOptions={[10, 25, 50]}
        dataKey="id"
        selectionMode="checkbox"
        selection={selectedCustomers}
        onSelectionChange={(e) => {
          const customers = e.value as Customer[];
          setSelectedCustomers(customers);
        }}
        emptyMessage="No customers found."
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        sortField="trial"
        sortOrder={-1}
        filters={filters}
      >
        <Column
          selectionMode="multiple"
          frozen
          headerStyle={{ inlineSize: "3rem" }}
        />
        <Column
          field="userId"
          header="User ID"
          frozen
          body={userIdTemplate}
          filter
          sortable
          filterPlaceholder="Search by name"
          style={{ inlineSize: "14rem" }}
        />
        <Column
          field="fname"
          header="Name"
          filter
          sortable
          style={{ inlineSize: "14rem" }}
        />
        <Column
          field="trial"
          header="User Status"
          filter
          sortable
          style={{ inlineSize: "14rem", textTransform: "capitalize" }}
        />
        <Column
          field="mobile"
          header="Mobile"
          sortable
          style={{ inlineSize: "14rem" }}
          filterPlaceholder="Search by Mobile"
        />
        <Column
          field="email"
          header="Email"
          filter
          sortable
          style={{ inlineSize: "14rem" }}
        />
      </DataTable>
      <Sidebar
        visible={visibleLeft}
        position="right"
        onHide={() => setVisibleLeft(false)}
        style={{ inlineSize: "60vw" }}
      >
        <h2>Staff Details</h2>
        <p>
          {selectedUserId ? `User ID: ${selectedUserId}` : "No user selected"}
        </p>
        <div className="card">
          <TabView>
            <TabPanel header="User Detail">
              <p className="m-0">
                <Fieldset
                  legend={
                    selectedUserId ? `${selectedUserId}` : "No user selected"
                  }
                >
                  {userDetails ? (
                    <div>
                      <p>
                        <strong>Name:</strong> {userDetails.refStFName}{" "}
                        {userDetails.refStLName}
                      </p>
                      <p>
                        <strong>Email:</strong> {userDetails.refCtEmail}
                      </p>
                      <p>
                        <strong>DOB:</strong> {userDetails.refStDOB}
                      </p>
                    </div>
                  ) : (
                    <p>No user details available.</p>
                  )}
                </Fieldset>
              </p>
              {userDetails ? (
                <div className="contents">
                  <div className="card">
                    <h5 className="mb-4">User Profile</h5>
                    <table className="w-full">
                      <tbody>
                        <tr>
                          <td className="text-900 font-medium p-2">Phone</td>
                          <td className="text-600 p-2">
                            {userDetails.refCtEmail}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-900 font-medium p-2">Gender</td>
                          <td className="text-600 p-2">
                            {userDetails.refStSex}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-900 font-medium p-2">
                            Qualification
                          </td>
                          <td className="text-600 p-2">
                            {userDetails.refQualification}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-900 font-medium p-2">
                            Occupation
                          </td>
                          <td className="text-600 p-2">
                            {userDetails.refOccupation}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-900 font-medium p-2">Height</td>
                          <td className="text-600 p-2">
                            {userDetails.refHeight}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-900 font-medium p-2">Weight</td>
                          <td className="text-600 p-2">
                            {userDetails.refWeight}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-900 font-medium p-2">
                            Blood Group
                          </td>
                          <td className="text-600 p-2">
                            {userDetails.refBlood}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p>No user details available.</p>
              )}
            </TabPanel>
            <TabPanel header="Audit">
              <p className="m-0">
                <DataTable
                  value={UserDetailss}
                  tableStyle={{ inlineSize: "50rem" }}
                >
                  <Column
                    header="S.No"
                    body={(rowData, options) => options.rowIndex + 1}
                  />{" "}
                  <Column
                    field="transData"
                    header="Action"
                    style={{ textTransform: "capitalize" }}
                  ></Column>
                  <Column
                    field="transTime"
                    header="Date"
                    style={{ textTransform: "capitalize" }}
                  ></Column>
                  <Column
                    field="refUpdatedBy"
                    header="Performed By"
                    style={{ textTransform: "capitalize" }}
                  ></Column>
                </DataTable>
              </p>
            </TabPanel>
          </TabView>
        </div>
      </Sidebar>
    </div>
  );
}
