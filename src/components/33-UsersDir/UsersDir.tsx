import React, { useEffect, useState } from "react";
import "./UsersDir.css";

import { Divider } from "primereact/divider";

import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import UserDirData from "../../pages/Datatable/UserDirData";
import Axios from "axios";
import { Skeleton } from "primereact/skeleton";
import CryptoJS from "crypto-js";

interface City {
  name: string;
  code: string;
}

type DecryptResult = any;

const UsersDir: React.FC = () => {
  const [selectedCities, setSelectedCities] = useState<City | null>(null);
  const cities: City[] = [
    { name: "All", code: "LDN" },
    { name: "Trial", code: "NY" },
    { name: "Student", code: "RM" },
    { name: "Payment Pending", code: "IST" },
  ];

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
        usernameid: data.data[0].refUserName,
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
              <h3>USER DETAILS</h3>
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
        <div className="usersTable">
          <div className="headerPrimary">
            <h3>USER DETAILS</h3>
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
      )}
    </>
  );
};

export default UsersDir;
