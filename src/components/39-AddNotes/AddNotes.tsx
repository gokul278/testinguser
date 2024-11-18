import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Skeleton } from "primereact/skeleton";
import CryptoJS from "crypto-js";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { InputText } from "primereact/inputtext";

type DecryptResult = any;

const AddNotes: React.FC = () => {
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

  const [addNotes, setAddNotes] = useState(false);

  useEffect(() => {
    Axios.get(import.meta.env.VITE_API_URL + "/validateTokenData", {
      headers: {
        Authorization: localStorage.getItem("JWTtoken"),
        "Content-Type": "application/json",
      },
    }).then((res: any) => {
      const data = decrypt(
        res.data[1],
        res.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );

      localStorage.setItem("JWTtoken", "Bearer " + data.token + "");

      console.log(data);

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
              <h3>ADD & APPROVE NOTES</h3>
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
            <h3>ADD & APPROVE NOTES</h3>
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
              <div className="w-[100%] flex justify-between">
                <Button label="Approve List" />
                <Button
                  severity="success"
                  label="Add Notes"
                  onClick={() => {
                    setAddNotes(true);
                  }}
                />
              </div>
            </div>
          </div>

          <Sidebar
            visible={addNotes}
            position="right"
            onHide={() => setAddNotes(false)}
            style={{ width: "50%" }}
          >
            <h2>Add Yoga Notes</h2>
            <div className="w-[100%] flex">
              <div className="w-[100%] m-2 p-3 rounded shadow-md mt-5 bg-[#f6f5f5]">
                <div className="flex justify-between">
                  <div className="flex flex-column gap-2 w-[100%]">
                    <label htmlFor="username">Yoga Name</label>
                    <InputText required />
                  </div>
                </div>
                <div className="flex justify-between mt-3">
                  <div className="flex flex-column gap-2 w-[100%]">
                    <label htmlFor="username">Description</label>
                    <InputText required />
                  </div>
                </div>
                <div className="flex justify-between mt-3">
                  <div className="flex flex-column gap-2 w-[48%]">
                    <label htmlFor="username">Category</label>
                    <InputText required />
                  </div>
                  <div className="flex flex-column gap-2 w-[48%]">
                    <label htmlFor="username">Severity</label>
                    <InputText required />
                  </div>
                </div>
                <div className="flex justify-end mt-4 mb-3">
                  &nbsp;&nbsp;
                  <Button label="Close" />
                </div>
              </div>
            </div>
          </Sidebar>
        </div>
      )}
    </>
  );
};

export default AddNotes;
