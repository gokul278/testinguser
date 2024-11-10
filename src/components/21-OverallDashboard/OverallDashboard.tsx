import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./OverallDashboard.css";
import { Link, useNavigate } from "react-router-dom";

import { Button, DataTable, Chart, Column, Menu } from "primereact";
import { Divider } from "primereact/divider";

import { AiOutlineUser } from "react-icons/ai";

import Axios from "axios";
import { Skeleton } from "primereact/skeleton";
import CryptoJS from "crypto-js";

type DecryptResult = any;

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
  const [formSubmitted, setFormSubmitted] = useState({
    today: 0,
    futureToday: 0,
  });
  const [futureClient, setFutureClient] = useState({
    today: 0,
    futureToday: 0,
  });
  const [overallUserStatus, setOverallUserStatus] = useState({
    userLabel1: "Registered",
    count1: 0,
    percentage1: 0,
    userLabel2: "Trial",
    count2: 0,
    percentage2: 0,
    userLabel3: "Student",
    count3: 0,
    percentage3: 0,
    userLabel4: "Client",
    count4: 0,
    percentage4: 0,
    userLabel5: "Payment Pending",
    count5: 0,
    percentage5: 0,
  });

  const [overallEmployeeStatus, setOverallEmployeeStatus] = useState({
    label1: "Instructor",
    count1: 0,
    percentage1: 0,
    label2: "Finance",
    count2: 0,
    percentage2: 0,
    label3: "Front Office",
    count3: 0,
    percentage3: 0,
  });

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
        const data = decrypt(
          response.data[1],
          response.data[0],
          import.meta.env.VITE_ENCRYPTION_KEY
        );

        console.log("API Response: ", data);

        const recentData = data.data.registerSampleData;
        console.log("recentData", recentData);
        const mappedData = recentData.map((item, index) => ({
          sno: index + 1,
          name: `${item.refStFName} ${item.refStLName}`,
          transTime: item.transTime,
        }));
        setProducts(mappedData);

        setFormSubmitted({
          today: data.data.registerCount[0].count_today,
          futureToday: data.data.registerCount[0].count_other_days,
        });
        setFutureClient({
          today: data.data.signUpCount[0].count_today,
          futureToday: data.data.signUpCount[0].count_other_days,
        });

        const OverallUser = data.data.userTypeCount;

        setOverallUserStatus({
          ...overallUserStatus,
          count1: OverallUser[0].count,
          percentage1: OverallUser[0].percentage,
          count2: OverallUser[1].count,
          percentage2: OverallUser[1].percentage,
          count3: OverallUser[2].count,
          percentage3: OverallUser[2].percentage,
          count4: OverallUser[3].count,
          percentage4: OverallUser[3].percentage,
          count5: OverallUser[4].count,
          percentage5: OverallUser[4].percentage,
        });

        const OverallEmployee = data.data.staffCount;

        setOverallEmployeeStatus({
          ...overallEmployeeStatus,
          count1: OverallEmployee[0].count,
          percentage1: OverallEmployee[0].percentage,
          count2: OverallEmployee[1].count,
          percentage2: OverallEmployee[1].percentage,
          count3: OverallEmployee[2].count,
          percentage3: OverallEmployee[2].percentage,
        });
      })
      .catch((error) => {
        console.error("Error fetching the data: ", error);
      });
  }, []);

  const navigate = useNavigate();

  const [pageLoading, setPageLoading] = useState({
    verifytoken: true,
    pageData: true,
  });

  const [userdata, setuserdata] = useState({
    username: "",
    usernameid: "",
    profileimg: { contentType: "", content: "" },
  });

  const decrypt = (
    encryptedData: string,
    iv: string,
    key: string
  ): DecryptResult => {
    // Create CipherParams with ciphertext
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Hex.parse(encryptedData),
    });

    // Perform decryption
    const decrypted = CryptoJS.AES.decrypt(
      cipherParams,
      CryptoJS.enc.Hex.parse(key),
      {
        iv: CryptoJS.enc.Hex.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

    return JSON.parse(decryptedString);
  };

  useEffect(() => {
    Axios.get(import.meta.env.VITE_API_URL + "/validateTokenData", {
      headers: {
        Authorization: localStorage.getItem("JWTtoken"),
        "Content-Type": "application/json",
      },
    }).then((res) => {
      const data = decrypt(
        res.data[1],
        res.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );

      localStorage.setItem("JWTtoken", "Bearer " + data.token + "");

      setuserdata({
        username:
          "" + data.data[0].refStFName + " " + data.data[0].refStLName + "",
        usernameid: data.data[0].refusertype,
        profileimg: data.profileFile,
      });

      setPageLoading({
        ...pageLoading,
        verifytoken: false,
      });

      console.log("Verify Token  Running --- ");
    });
  }, []);

  return (
    <>
      {pageLoading.verifytoken && pageLoading.pageData ? (
        <>
          <div className="bg-[#f6f5f5]">
            <div className="headerPrimary">
              <h3>DASHBOARD</h3>
              <div className="quickAcces">
                <Skeleton
                  shape="circle"
                  size="3rem"
                  className="mr-2"
                ></Skeleton>
                <h3 className="flex-col flex items-center justify-center text-center ml-2 lg:ml-2 mr-0 lg:mr-5">
                  <Skeleton width="7rem" className="mb-2"></Skeleton>
                  <Skeleton width="7rem" className="mb-2"></Skeleton>
                </h3>
              </div>{" "}
            </div>

            <div className="userProfilePage">
              <Skeleton
                className="lg:m-[30px] shadow-lg"
                width="95%"
                height="80vh"
                borderRadius="16px"
              ></Skeleton>
              <div className="py-1"></div>
            </div>
          </div>
        </>
      ) : (
        <div className="dashboardContext">
          <div className="headerPrimary">
            <h3>DASHBOARD</h3>
            <div className="quickAcces">
              {userdata.profileimg ? (
                <div className="p-link layout-topbar-button">
                  <img
                    id="userprofileimg"
                    className="w-[45px] h-[45px] object-cover rounded-full"
                    src={`data:${userdata.profileimg.contentType};base64,${userdata.profileimg.content}`}
                    alt=""
                  />
                </div>
              ) : (
                <div className="p-link layout-topbar-button">
                  <i className="pi pi-user"></i>
                </div>
              )}
              <h3 className="text-[1rem] text-center ml-2 lg:ml-2 mr-0 lg:mr-5">
                <span>{userdata.username}</span>
                <br />
                <span className="text-[0.8rem] text-[#f95005]">
                  {userdata.usernameid}
                </span>
              </h3>
            </div>{" "}
          </div>
          <div className="cardTesting">
            {localStorage.getItem("refUtId") === "4" ? (
              <Link
                to="/staff/registeredUsers"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="cardOutline card">
                  <div className="header">
                    <i className="pi pi-user-plus"></i>
                    <h3>Formasas Submitted</h3>
                  </div>
                  <div className="counts">
                    <div className="countOne">
                      <h3>{formSubmitted.today}</h3>
                      <h5>Today</h5>
                    </div>
                    <div className="w-full md:w-2">
                      <Divider
                        layout="vertical"
                        className="hidden md:flex"
                      ></Divider>
                      <Divider
                        layout="horizontal"
                        className="flex md:hidden"
                        align="center"
                      ></Divider>
                    </div>
                    <div className="countOne">
                      <h3>{formSubmitted.futureToday}</h3>
                      <h5>Previous Day</h5>
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              <Link
                to="/staff/registeredUsers"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="cardOutline card">
                  <div className="header">
                    <i className="pi pi-user-plus"></i>
                    <h3>Form Submitted</h3>
                  </div>
                  <div className="counts">
                    <div className="countOne">
                      <h3>{formSubmitted.today}</h3>
                      <h5>Today</h5>
                    </div>
                    <div className="w-full md:w-2">
                      <Divider
                        layout="vertical"
                        className="hidden md:flex"
                      ></Divider>
                      <Divider
                        layout="horizontal"
                        className="flex md:hidden"
                        align="center"
                      ></Divider>
                    </div>
                    <div className="countOne">
                      <h3>{formSubmitted.futureToday}</h3>
                      <h5>Previous Day</h5>
                    </div>
                  </div>
                </div>
              </Link>
            )}
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
                    <h3>{futureClient.today}</h3>
                    <h5>Today</h5>
                  </div>
                  <div className="w-full md:w-2">
                    <Divider
                      layout="vertical"
                      className="hidden md:flex"
                    ></Divider>
                    <Divider
                      layout="horizontal"
                      className="flex md:hidden"
                      align="center"
                    ></Divider>
                  </div>
                  <div className="countOne">
                    <h3>{futureClient.futureToday}</h3>
                    <h5>Previous Day</h5>
                  </div>
                </div>
              </div>
            </Link>

            <div className="cardOutline card">
              <div className="header">
                <i className="pi pi-calendar"></i>
                <h3>Attendance</h3>
              </div>
              <div className="counts">
                <div className="countOne">
                  <h3>--</h3>
                  <h5>Total</h5>
                </div>
                <div className="w-full md:w-2">
                  <Divider
                    layout="vertical"
                    className="hidden md:flex"
                  ></Divider>
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

            <Link
              to="/settings"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="cardOutline card">
                <div className="header">
                  <i className="pi pi-receipt"></i>
                  <h3>Offers</h3>
                </div>
                <div className="counts">
                  <div className="countOne">
                    <h3>--</h3>
                    <h5>Trial</h5>
                  </div>
                  <div className="w-full md:w-2">
                    <Divider
                      layout="vertical"
                      className="hidden md:flex"
                    ></Divider>
                    <Divider
                      layout="horizontal"
                      className="flex md:hidden"
                      align="center"
                    ></Divider>
                  </div>
                  <div className="countOne">
                    <h3>--</h3>
                    <h5>Students</h5>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="overallComponent mt-3" style={{ inlineSize: "100%" }}>
            <div className="dashboardContxt">
              <div
                className="dashboardCont"
                style={{ display: "flex", justifyContent: "space-around" }}
              >
                {/* RECENT SALES & BEST SELLING PRODUCTS */}
                <div className="col-12 xl:col-6 dashboardAnalytics">
                  <div className="card mt-2">
                    <div className="flex justify-content-between align-items-center mb-5">
                      <h3 className="text-[#f95005]">Overall User Status</h3>
                      <div>
                        <Button
                          type="button"
                          icon="pi pi-ellipsis-v"
                          rounded
                          text
                          className="p-button-plain"
                          onClick={(event: any) => menu1.current?.toggle(event)}
                        />
                        {/* <Menu
                          ref={menu1}
                          popup
                          model={[
                            { label: "Option One", icon: "pi pi-fw pi-plus" },
                            { label: "Option Two", icon: "pi pi-fw pi-minus" },
                          ]}
                        /> */}
                      </div>
                    </div>
                    <ul className="list-none p-0 m-0">
                      <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                        <div>
                          <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                            {overallUserStatus.userLabel1}
                          </span>
                          <div className="mt-1 text-600">
                            Count : {overallUserStatus.count1}
                          </div>
                        </div>
                        <div className="mt-2 md:mt-0 flex align-items-center">
                          <div
                            className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                            style={{ blockSize: "8px" }}
                          >
                            <div
                              className="bg-orange-500 h-full"
                              style={{
                                inlineSize: overallUserStatus.percentage1 + "%",
                              }}
                            />
                          </div>
                          <span className="text-orange-500 ml-3 font-medium">
                            {overallUserStatus.percentage1} %
                          </span>
                        </div>
                      </li>
                      <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                        <div>
                          <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                            {overallUserStatus.userLabel2}
                          </span>
                          <div className="mt-1 text-600">
                            Count : {overallUserStatus.count2}
                          </div>
                        </div>
                        <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                          <div
                            className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                            style={{ blockSize: "8px" }}
                          >
                            <div
                              className="bg-cyan-500 h-full"
                              style={{
                                inlineSize: overallUserStatus.percentage2 + "%",
                              }}
                            />
                          </div>
                          <span className="text-cyan-500 ml-3 font-medium">
                            {overallUserStatus.percentage2} %
                          </span>
                        </div>
                      </li>
                      <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                        <div>
                          <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                            {overallUserStatus.userLabel3}
                          </span>
                          <div className="mt-1 text-600">
                            Count : {overallUserStatus.count3}
                          </div>
                        </div>
                        <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                          <div
                            className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                            style={{ blockSize: "8px" }}
                          >
                            <div
                              className="bg-pink-500 h-full"
                              style={{
                                inlineSize: overallUserStatus.percentage3 + "%",
                              }}
                            />
                          </div>
                          <span className="text-pink-500 ml-3 font-medium">
                            {overallUserStatus.percentage3} %
                          </span>
                        </div>
                      </li>
                      <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                        <div>
                          <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                            {overallUserStatus.userLabel4}
                          </span>
                          <div className="mt-1 text-600">
                            Count : {overallUserStatus.count4}
                          </div>
                        </div>
                        <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                          <div
                            className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                            style={{ blockSize: "8px" }}
                          >
                            <div
                              className="bg-green-500 h-full"
                              style={{
                                inlineSize: overallUserStatus.percentage4 + "%",
                              }}
                            />
                          </div>
                          <span className="text-green-500 ml-3 font-medium">
                            {overallUserStatus.percentage4} %
                          </span>
                        </div>
                      </li>
                      <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                        <div>
                          <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                            {overallUserStatus.userLabel5}
                          </span>
                          <div className="mt-1 text-600">
                            Count : {overallUserStatus.count5}
                          </div>
                        </div>
                        <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                          <div
                            className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                            style={{ blockSize: "8px" }}
                          >
                            <div
                              className="bg-green-500 h-full"
                              style={{
                                inlineSize: overallUserStatus.percentage5 + "%",
                              }}
                            />
                          </div>
                          <span className="text-green-500 ml-3 font-medium">
                            {overallUserStatus.percentage5} %
                          </span>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-5">
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
                  <div className="card mt-2">
                    <div className="flex justify-content-between align-items-center mb-5">
                      <h3 className="text-[#f95005]">
                        Overall Employee Status
                      </h3>
                      <div>
                        {/* <Button
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
                        /> */}
                      </div>
                    </div>
                    <ul className="list-none p-0 m-0">
                      <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                        <div>
                          <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                            {overallEmployeeStatus.label1}
                          </span>
                          <div className="mt-1 text-600">
                            Count : {overallEmployeeStatus.count1}
                          </div>
                        </div>
                        <div className="mt-2 md:mt-0 flex align-items-center">
                          <div
                            className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                            style={{ blockSize: "8px" }}
                          >
                            <div
                              className="bg-orange-500 h-full"
                              style={{
                                inlineSize:
                                  overallEmployeeStatus.percentage1 + "%",
                              }}
                            />
                          </div>
                          <span className="text-orange-500 ml-3 font-medium">
                            {overallEmployeeStatus.percentage1} %
                          </span>
                        </div>
                      </li>
                      <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                        <div>
                          <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                            {overallEmployeeStatus.label2}
                          </span>
                          <div className="mt-1 text-600">
                            Count : {overallEmployeeStatus.count2}
                          </div>
                        </div>
                        <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                          <div
                            className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                            style={{ blockSize: "8px" }}
                          >
                            <div
                              className="bg-cyan-500 h-full"
                              style={{
                                inlineSize:
                                  overallEmployeeStatus.percentage2 + "%",
                              }}
                            />
                          </div>
                          <span className="text-cyan-500 ml-3 font-medium">
                            {overallEmployeeStatus.percentage2} %
                          </span>
                        </div>
                      </li>
                      <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                        <div>
                          <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                            {overallEmployeeStatus.label3}
                          </span>
                          <div className="mt-1 text-600">
                            Count : {overallEmployeeStatus.count3}
                          </div>
                        </div>
                        <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                          <div
                            className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                            style={{ blockSize: "8px" }}
                          >
                            <div
                              className="bg-pink-500 h-full"
                              style={{
                                inlineSize:
                                  overallEmployeeStatus.percentage3 + "%",
                              }}
                            />
                          </div>
                          <span className="text-pink-500 ml-3 font-medium">
                            {overallEmployeeStatus.percentage3} %
                          </span>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="card">
                    <h5>October Month Revenue</h5>
                    <Chart type="line" data={lineData} options={lineOptions} />
                  </div>

                  <div className="card mt-4">
                    <div className="flex align-items-center justify-content-between mb-4">
                      <h5>Notifications</h5>
                      <div>
                        {/* <Button
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
                        /> */}
                      </div>
                    </div>

                    <span className="block text-600 font-medium mb-3">
                      TODAY
                    </span>
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
      )}
    </>
  );
};

export default OverallDashboard;
