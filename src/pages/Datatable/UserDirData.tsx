import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";

import { TabView, TabPanel } from "primereact/tabview";
import { Fieldset } from "primereact/fieldset";

import Axios from "axios";

import { FilterMatchMode } from "primereact/api";
import UserProfileEdit from "../UserProfileEdit/UserProfileEdit";

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

export default function UserDirData() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>([]);
  const [visibleLeft, setVisibleLeft] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<Customer | null>(null);
  const [UserDetailss, setUserDetailss] = useState<UserDetails[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");


  const [refid, setRefId] = useState<string>("");

  // Filters state
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  // Function to fetch customers
  const fetchCustomers = async () => {
    try {
      const response = await Axios.get(
        import.meta.env.VITE_API_URL + `/staff/userManagementPage`
      );
      console.log("response", response);
      const fetchedCustomers: Customer[] = response.data.text.data.map(
        (customer: any) => ({
          id: customer.refStId,
          userId: customer.refSCustId,
          fname: customer.refStFName + " " + customer.refStLName,
          lname: customer.refStLName,
          email: customer.refCtEmail || "",
          trial: customer.refUtIdLabel || "Trial",
          date: customer.transTime || "",
          mobile: customer.refCtMobile,
          comments: "",
          commentEnabled: false, // Default value for commentEnabled
        })
      );
      setCustomers(fetchedCustomers);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
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

      console.log("API response:", response.data); // Log the entire response

      const userData = response.data.userTransaction;
      const userDetails = response.data.UserData[0];

      console.log("userDetails", userDetails); // Log the userDetails
      setUserDetails(userDetails);

      console.log("userData", userData);
      setUserDetailss(userData);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

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

  const onGlobalFilterChange = (e: any) => {
    const value = e.target.value;
    const _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
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

  const onUserIdClick = (id: string, rowData: string) => {
    setSelectedUserId(rowData);
    fetchUserDetails(id);

    setRefId(id);

    console.log("user ID ----", id);
    

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
        sortField="userId"
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
          body={userIdTemplate}
          frozen
          filter
          sortable
          filterPlaceholder="Search by User ID"
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
          header="Current Status"
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
        className="w-[90%] lg:w-[75%]"
        visible={visibleLeft}
        position="right"
        onHide={() => setVisibleLeft(false)}
      >
        <h2>User Details</h2>
        <p>
          {selectedUserId ? `User ID: ${selectedUserId}` : "No user selected"}
        </p>
        <div className="card">
          <TabView>
            <TabPanel header="User Detail">
              <p className="m-0">
                {userDetails ? (
                  <>
                    <div className="mt-10">
                      <UserProfileEdit refid={refid} />
                    </div>
                  </>
                ) : (
                  <p>No user details available.</p>
                )}
              </p>
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