import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./OverallDashboard.css";
import { Link, useNavigate } from "react-router-dom";

import { Button, DataTable, Chart, Column, Menu } from "primereact";
import { Divider } from "primereact/divider";

import { AiOutlineUser } from "react-icons/ai";

const lineData = {
  labels: ["April", "May", "June", "July", "August", "September", "October  "],
  datasets: [
    {
      label: "Fee Payment",
      data: [28, 48, 40, 19, 86, 27, 90],
      fill: false,
      backgroundColor: "#00bb7e",
      borderColor: "#00bb7e",
      tension: 0.4,
    },
  ],
};

const OverallDashboard: React.FC = () => {
  const [products, setProducts] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState([]);
  const [futureClient, setFutureClient] = useState([]);
  const [overallStatus, setOverallStatus] = useState([]);

  const menu1 = useRef(null);
  const menu2 = useRef(null);

  const lineOptions = {
    plugins: {
      legend: {
        labels: {
          color: "#495057",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#495057",
        },
        grid: {
          color: "#ebedef",
        },
      },
      y: {
        ticks: {
          color: "#495057",
        },
        grid: {
          color: "#ebedef",
        },
      },
    },
  };

  // State to hold the card data
  const [cardData, setCardData] = useState([
    {
      id: 1,
      title: "",
      count: "",
      description: "Registerd Count",
      route: "/staff/registeredUsers",
      icon: <AiOutlineUser />,
    },
    {
      id: 2,
      title: "",
      count: "",
      description: "Signed Up Count",
      route: "/staff/signedupUsers",
      icon: <AiOutlineUser />,
    },
  ]);

  // Decrypt function

  useEffect(() => {
    const token = localStorage.getItem("JWTtoken");
    axios
      .get(import.meta.env.VITE_API_URL + `/staff/dashBoard`, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("API Response: ", response.data.text.data);

        const recentData = response.data.text.data.registerSampleData;
        console.log("recentData", recentData);
        const mappedData = recentData.map((item, index) => ({
          sno: index + 1,
          name: `${item.refStFName} ${item.refStLName}`,
          transTime: item.transTime,
        }));
        setProducts(mappedData);

        setFormSubmitted(response.data.text.data.registerCount[0].count_today);
        setFutureClient(response.data.text.data.signUpCount[0].count_today);
        setCardData([
          {
            id: 1,
            title: `Count Today: ${response.data.text.data.registerCount[0].count_today}`,
            count: `Count Previous Day: ${response.data.text.data.registerCount[0].count_other_days}`,
            description: "Registered Users",
            route: "/staff/registeredUsers",
            icon: <AiOutlineUser />,
          },
          {
            id: 2,
            title: `Count Today: ${response.data.text.data.signUpCount[0].count_today}`,
            count: `Count Previous Day: ${response.data.text.data.signUpCount[0].count_other_days}`,
            description: "Signed Up Users",
            route: "/staff/signedupUsers",
            icon: <AiOutlineUser />,
          },
          {
            id: 3,
            title: `${response.data.text.data.userTypeCount[0].user_type_label} : ${response.data.text.data.userTypeCount[0].count}`,
            count: `${response.data.text.data.userTypeCount[2].user_type_label} : ${response.data.text.data.userTypeCount[2].count}`,
            description: "Overall Users Stats",
            route: "/staff/signedupUsers",
            icon: <AiOutlineUser />,
          },
          {
            id: 4,
            title: `Current Batch Count: 0  `,
            count: `${response.data.text.data.userTypeCount[2].user_type_label} : ${response.data.text.data.userTypeCount[2].count}`,
            description: "Attendance",
            route: "/staff/signedupUsers",
            icon: <AiOutlineUser />,
          },
        ]);
      })
      .catch((error) => {
        console.error("Error fetching the data: ", error);
      });
  }, []);

  const navigate = useNavigate();

  return (
    <div className="dashboardContext">
      <div className="headerPrimary">
        <h3>DASHBOARD</h3>
        <div className="flex gap-x-5">
          <div
            className="quickAcces"
            onClick={() => {
              navigate("/dir/notify");
            }}
          >
            <div className="p-link layout-topbar-button">
              <i className="pi pi-bell"></i>
            </div>
          </div>
          <div className="quickAcces">
            <div className="p-link layout-topbar-button">
              <i className="pi pi-user"></i>
            </div>
            <h3 className="ml-2 mr-5">User Name</h3>
          </div>
        </div>
      </div>
      <div className="cardTesting">
        <Link
          to="/staff/registeredUsers"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div className="cardOutline card">
            <div className="header">
              <i className="pi pi-user"></i>
              <h3>Form Submitted</h3>
            </div>
            <div className="counts">
              <div className="countOne">
                <h3>{formSubmitted}</h3>
                <h5>Today</h5>
              </div>
              <div className="w-full md:w-2">
                <Divider layout="vertical" className="hidden md:flex"></Divider>
                <Divider
                  layout="horizontal"
                  className="flex md:hidden"
                  align="center"
                ></Divider>
              </div>
              <div className="countOne">
                <h3>6</h3>
                <h5>Previous Day</h5>
              </div>
            </div>
          </div>
        </Link>
        <Link
          to="/staff/signedupUsers"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div className="cardOutline card">
            <div className="header">
              <i className="pi pi-user"></i>
              <h3>Future Clients</h3>
            </div>
            <div className="counts">
              <div className="countOne">
                <h3>{futureClient}</h3>
                <h5>Today</h5>
              </div>
              <div className="w-full md:w-2">
                <Divider layout="vertical" className="hidden md:flex"></Divider>
                <Divider
                  layout="horizontal"
                  className="flex md:hidden"
                  align="center"
                ></Divider>
              </div>
              <div className="countOne">
                <h3>13</h3>
                <h5>Previous Day</h5>
              </div>
            </div>
          </div>
        </Link>
        <Link
          to="/staff/users"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div className="cardOutline card">
            <div className="header">
              <i className="pi pi-user"></i>
              <h3>Overall User Stats</h3>
            </div>
            <div className="counts">
              <div className="countOne">
                <h3>20</h3>
                <h5>Trial</h5>
              </div>
              <div className="w-full md:w-2">
                <Divider layout="vertical" className="hidden md:flex"></Divider>
                <Divider
                  layout="horizontal"
                  className="flex md:hidden"
                  align="center"
                ></Divider>
              </div>
              <div className="countOne">
                <h3>4</h3>
                <h5>Students</h5>
              </div>
            </div>
          </div>
        </Link>

        <div className="cardOutline card">
          <div className="header">
            <i className="pi pi-user"></i>
            <h3>Attendance</h3>
          </div>
          <div className="counts">
            <div className="countOne">
              <h3>--</h3>
              <h5>Total</h5>
            </div>
            <div className="w-full md:w-2">
              <Divider layout="vertical" className="hidden md:flex"></Divider>
              <Divider
                layout="horizontal"
                className="flex md:hidden"
                align="center"
              ></Divider>
            </div>
            <div className="countOne">
              <h3>--</h3>
              <h5>Current Batch</h5>
            </div>
          </div>
        </div>
      </div>

      <div className="overallComponent mt-3" style={{ inlineSize: "100%" }}>
        <div className="dashboardContxt">
          <div
            className="dashboardCont"
            style={{ display: "flex", justifyContent: "space-around" }}
          >
            {/* RECENT SALES & BEST SELLING PRODUCTS */}
            <div className="col-12 xl:col-6 dashboardAnalytics">
              <Link
                to="/staff/registeredUsers"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="card">
                  <h5>Today Form Submitted Clients</h5>
                  <DataTable
                    value={products}
                    rows={5}
                    paginator
                    responsiveLayout="scroll"
                  >
                    <Column
                      field="sno"
                      header="S.No"
                      style={{ inlinesi: "35%" }}
                    />
                    <Column
                      field="name"
                      header="Name"
                      style={{ inlinesi: "35%" }}
                    />
                    <Column
                      field="transTime"
                      header="Registered Date"
                      style={{ inlineSize: "35%" }}
                    />
                  </DataTable>
                </div>
              </Link>

              <div className="card mt-4">
                <div className="flex justify-content-between align-items-center mb-5">
                  <h5>Overall User Status</h5>
                  <div>
                    <Button
                      type="button"
                      icon="pi pi-ellipsis-v"
                      rounded
                      text
                      className="p-button-plain"
                      onClick={(event) => menu1.current?.toggle(event)}
                    />
                    <Menu
                      ref={menu1}
                      popup
                      model={[
                        { label: "Option One", icon: "pi pi-fw pi-plus" },
                        { label: "Option Two", icon: "pi pi-fw pi-minus" },
                      ]}
                    />
                  </div>
                </div>
                <ul className="list-none p-0 m-0">
                  <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                    <div>
                      <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                        Signed Up Users
                      </span>
                      <div className="mt-1 text-600">Count : 20</div>
                    </div>
                    <div className="mt-2 md:mt-0 flex align-items-center">
                      <div
                        className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                        style={{ blockSize: "8px" }}
                      >
                        <div
                          className="bg-orange-500 h-full"
                          style={{ inlineSize: "36.36%" }}
                        />
                      </div>
                      <span className="text-orange-500 ml-3 font-medium">
                        %36.36
                      </span>
                    </div>
                  </li>
                  <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                    <div>
                      <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                        Registered Users
                      </span>
                      <div className="mt-1 text-600">Count : 9</div>
                    </div>
                    <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                      <div
                        className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                        style={{ blockSize: "8px" }}
                      >
                        <div
                          className="bg-cyan-500 h-full"
                          style={{ inlineSize: "16.36%" }}
                        />
                      </div>
                      <span className="text-cyan-500 ml-3 font-medium">
                        %16.16
                      </span>
                    </div>
                  </li>
                  <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                    <div>
                      <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                        Trial
                      </span>
                      <div className="mt-1 text-600">Count : 20</div>
                    </div>
                    <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                      <div
                        className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                        style={{ blockSize: "8px" }}
                      >
                        <div
                          className="bg-pink-500 h-full"
                          style={{ inlineSize: "36.36%" }}
                        />
                      </div>
                      <span className="text-pink-500 ml-3 font-medium">
                        %36.36
                      </span>
                    </div>
                  </li>
                  <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                    <div>
                      <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                        Payment Pending
                      </span>
                      <div className="mt-1 text-600">Count : 2</div>
                    </div>
                    <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                      <div
                        className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                        style={{ blockSize: "8px" }}
                      >
                        <div
                          className="bg-green-500 h-full"
                          style={{ inlineSize: "35%" }}
                        />
                      </div>
                      <span className="text-green-500 ml-3 font-medium">
                        %03.64
                      </span>
                    </div>
                  </li>
                  <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                    <div>
                      <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                        Student
                      </span>
                      <div className="mt-1 text-600">Count : 4</div>
                    </div>
                    <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                      <div
                        className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                        style={{ blockSize: "8px" }}
                      >
                        <div
                          className="bg-green-500 h-full"
                          style={{ inlineSize: "7.27%" }}
                        />
                      </div>
                      <span className="text-green-500 ml-3 font-medium">
                        %07.26
                      </span>
                    </div>
                  </li>
                </ul>
              </div>

              {/* <div className="card mt-4">
                <div className="flex justify-content-between align-items-center mb-5">
                  <h5>Overall Employee Status</h5>
                  <div>
                    <Button
                      type="button"
                      icon="pi pi-ellipsis-v"
                      rounded
                      text
                      className="p-button-plain"
                      onClick={(event) => menu1.current?.toggle(event)}
                    />
                    <Menu
                      ref={menu1}
                      popup
                      model={[
                        { label: "Option One", icon: "pi pi-fw pi-plus" },
                        { label: "Option Two", icon: "pi pi-fw pi-minus" },
                      ]}
                    />
                  </div>
                </div>
                <ul className="list-none p-0 m-0">
                  <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                    <div>
                      <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                        Finance
                      </span>
                      <div className="mt-1 text-600">Count : 1</div>
                    </div>
                    <div className="mt-2 md:mt-0 flex align-items-center">
                      <div
                        className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                        style={{ blockSize: "8px" }}
                      >
                        <div
                          className="bg-orange-500 h-full"
                          style={{ inlineSize: "12.50%" }}
                        />
                      </div>
                      <span className="text-orange-500 ml-3 font-medium">
                        %12.50
                      </span>
                    </div>
                  </li>
                  <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                    <div>
                      <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                        Front Office
                      </span>
                      <div className="mt-1 text-600">Count : 2</div>
                    </div>
                    <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                      <div
                        className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                        style={{ blockSize: "8px" }}
                      >
                        <div
                          className="bg-cyan-500 h-full"
                          style={{ inlineSize: "25.00%" }}
                        />
                      </div>
                      <span className="text-cyan-500 ml-3 font-medium">
                        %25.00
                      </span>
                    </div>
                  </li>
                  <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                    <div>
                      <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                        Instructor
                      </span>
                      <div className="mt-1 text-600">Count : 5</div>
                    </div>
                    <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                      <div
                        className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                        style={{ blockSize: "8px" }}
                      >
                        <div
                          className="bg-pink-500 h-full"
                          style={{ inlineSize: "62.50%" }}
                        />
                      </div>
                      <span className="text-pink-500 ml-3 font-medium">
                        %62.50
                      </span>
                    </div>
                  </li>
                </ul>
              </div> */}
            </div>

            {/* SALES OVERVIEW AND NOTIFICATIONS */}
            <div className="col-12 xl:col-6 dashboardAnalytics">
              <div className="card">
                <h5>October Month Revenue</h5>
                <Chart type="line" data={lineData} options={lineOptions} />
              </div>

              <div className="card mt-4">
                <div className="flex align-items-center justify-content-between mb-4">
                  <h5>Notifications</h5>
                  <div>
                    <Button
                      type="button"
                      icon="pi pi-ellipsis-v"
                      rounded
                      text
                      className="p-button-plain"
                      onClick={(event) => menu2.current?.toggle(event)}
                    />
                    <Menu
                      ref={menu2}
                      popup
                      model={[
                        { label: "Option One", icon: "pi pi-fw pi-plus" },
                        { label: "Option Two", icon: "pi pi-fw pi-minus" },
                      ]}
                    />
                  </div>
                </div>

                <span className="block text-600 font-medium mb-3">TODAY</span>
                <ul className="p-0 mx-0 mt-0 mb-4 list-none">
                  <li className="flex align-items-center py-2 border-bottom-1 surface-border">
                    <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                      <i className="pi pi-dollar text-xl text-blue-500" />
                    </div>
                    <span className="text-900 line-blockSize-3">
                      Revenue Report
                      <span className="text-700">
                        {" "}
                        - Fee Payment{" "}
                        <span className="text-blue-500">
                          10 Verification Pending
                        </span>
                      </span>
                    </span>
                  </li>
                  <li className="flex align-items-center py-2">
                    <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-orange-100 border-circle mr-3 flex-shrink-0">
                      <i className="pi pi-download text-xl text-orange-500" />
                    </div>
                    <span className="text-700 line-blockSize-3">
                      Revenue Report{" "}
                      <span className="text-blue-500 font-medium">
                        DD-MM-YYYY (Today)
                      </span>{" "}
                      has been initiated.
                    </span>
                  </li>
                </ul>

                <span className="block text-600 font-medium mb-3">
                  YESTERDAY
                </span>
                <ul className="p-0 m-0 list-none">
                  <li className="flex align-items-center py-2 border-bottom-1 surface-border">
                    <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                      <i className="pi pi-dollar text-xl text-blue-500" />
                    </div>
                    <span className="text-900 line-blockSize-3">
                      Revenue Report
                      <span className="text-700">
                        {" "}
                        - Fee Payment{" "}
                        <span className="text-blue-500">
                          3 Verification Pending
                        </span>
                      </span>
                    </span>
                  </li>
                  <li className="flex align-items-center py-2">
                    <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-orange-100 border-circle mr-3 flex-shrink-0">
                      <i className="pi pi-download text-xl text-orange-500" />
                    </div>
                    <span className="text-700 line-blockSize-3">
                      Revenue Report{" "}
                      <span className="text-blue-500 font-medium">
                        DD-MM-YYYY (Today)
                      </span>{" "}
                      has been initiated.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverallDashboard;
