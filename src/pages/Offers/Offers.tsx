import Axios from "axios";
import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";

type DecryptResult = any;

interface WorkSpaceData {
  refOfferId: any;
  description: any;
  minimumval: any;
  offers: any;
  startingDate: any;
  endingDate: any;
}

const Offers: React.FC = () => {
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

  const [branch, setBranch] = useState();
  const [branchOptions, setBranchOptions] = useState([]);

  const [tableData, setTableData] = useState();

  const fetchData = () => {
    Axios.post(
      import.meta.env.VITE_API_URL + "/director/offerStructure",
      {
        refOfferId: null,
      },
      {
        headers: {
          Authorization: localStorage.getItem("JWTtoken"),
          "Content-Type": "application/json",
        },
      }
    ).then((res) => {
      const data = decrypt(
        res.data[1],
        res.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );

      console.log("Offers Data -----------", data);

      const options = data.offerName.map((branch: any) => ({
        label: branch.refOfferName,
        value: branch.refOfferId,
      }));

      setBranchOptions(options);

      setBranch(options[0].value);

      setTableData(data.offersStructure);

      localStorage.setItem("JWTtoken", "Bearer " + data.token + "");
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const branchChange = (e: any) => {
    Axios.post(
      import.meta.env.VITE_API_URL + "/director/offerStructure",
      {
        refOfferId: e,
      },
      {
        headers: {
          Authorization: localStorage.getItem("JWTtoken"),
          "Content-Type": "application/json",
        },
      }
    ).then((res) => {
      const data = decrypt(
        res.data[1],
        res.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );

      console.log(data);

      setTableData(data.offersStructure);

      localStorage.setItem("JWTtoken", "Bearer " + data.token + "");
    });
  };

  const EditBtn = (rowData: any) => {
    return (
      <Button
        label="Edit"
        severity="success"
        onClick={() => {
          setWorkSpace(true);

          setUpdateStructure(true);

          setWorkSpaceData({
            refOfferId: rowData.refOfId,
            description: rowData.refOfferDiscription,
            minimumval: rowData.refMin,
            offers: rowData.refOffer,
            startingDate: rowData.refStartAt,
            endingDate: rowData.refEndAt,
          });
        }}
      />
    );
  };

  const DeleteBtn = (rowData: any) => {
    return (
      <Button
        label="Delete"
        severity="danger"
        onClick={() => {
          deleteFees(rowData.refOfId);
        }}
      />
    );
  };

  const deleteFees = (e: any) => {
    Axios.post(
      import.meta.env.VITE_API_URL + "/director/deleteOfferStructure",
      {
        refOfId: e,
      },
      {
        headers: {
          Authorization: localStorage.getItem("JWTtoken"),
          "Content-Type": "application/json",
        },
      }
    ).then((res) => {
      const data = decrypt(
        res.data[1],
        res.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );

      branchChange(branch);

      localStorage.setItem("JWTtoken", "Bearer " + data.token + "");
    });
  };

  const [workSpace, setWorkSpace] = useState(false);

  const [workSpaceData, setWorkSpaceData] = useState<WorkSpaceData>({
    refOfferId: null,
    description: "",
    minimumval: null,
    offers: null,
    startingDate: "",
    endingDate: "",
  });

  function formatDateToYYYYMMDD(date: any) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const [updateStructure, setUpdateStructure] = useState(false);

  const handleFeesSubmit = (e: any) => {
    e.preventDefault();

    if (updateStructure) {
      Axios.post(
        import.meta.env.VITE_API_URL + "/director/editOfferStructure",
        {
          refOfId: workSpaceData.refOfferId,
          refMin: workSpaceData.minimumval,
          refOffer: workSpaceData.offers,
          refStartAt: formatDateToYYYYMMDD(workSpaceData.startingDate),
          refEndAt: formatDateToYYYYMMDD(workSpaceData.endingDate),
        },
        {
          headers: {
            Authorization: localStorage.getItem("JWTtoken"),
            "Content-Type": "application/json",
          },
        }
      ).then((res) => {
        const data = decrypt(
          res.data[1],
          res.data[0],
          import.meta.env.VITE_ENCRYPTION_KEY
        );

        console.log("Edited Data ----------", data);

        if (data.success) {
          setWorkSpaceData({
            refOfferId: null,
            description: "",
            minimumval: null,
            offers: null,
            startingDate: "",
            endingDate: "",
          });

          setUpdateStructure(false);

          setWorkSpace(false);

          branchChange(branch);
        } else {
          setUpdateStructure(true);
        }

        localStorage.setItem("JWTtoken", "Bearer " + data.token + "");
      });
    } else {
      Axios.post(
        import.meta.env.VITE_API_URL + "/director/addNewOffersStructure",
        {
          refOfferId: branch,
          refMin: workSpaceData.minimumval,
          refOffer: workSpaceData.offers,
          refStartAt: formatDateToYYYYMMDD(workSpaceData.startingDate),
          refEndAt: formatDateToYYYYMMDD(workSpaceData.endingDate),
        },
        {
          headers: {
            Authorization: localStorage.getItem("JWTtoken"),
            "Content-Type": "application/json",
          },
        }
      ).then((res) => {
        const data = decrypt(
          res.data[1],
          res.data[0],
          import.meta.env.VITE_ENCRYPTION_KEY
        );

        console.log(data);

        if (data.success) {
          setWorkSpaceData({
            refOfferId: null,
            description: "",
            minimumval: null,
            offers: null,
            startingDate: "",
            endingDate: "",
          });

          setWorkSpace(false);

          branchChange(branch);
        } else {
          //   setWorkSpaceData({
          //     ...workSpaceData,
          //     refFeId: data.data[0].refFeId,
          //   });
          setUpdateStructure(true);
        }

        localStorage.setItem("JWTtoken", "Bearer " + data.token + "");
      });
    }
  };

  const Status = (rowData: any) => {
    return (
      <>
        {rowData.status === "live" ? (
          <div className="text-green-500 font-bold">Live</div>
        ) : rowData.status === "expire" ? (
          <div className="text-red-600 font-bold">Expired</div>
        ) : (
          <div className="text-yellow-600 font-bold">Yet to Start</div>
        )}
      </>
    );
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <Dropdown
          value={branch}
          onChange={(e: any) => {
            setBranch(e.value);
            branchChange(e.value);
          }}
          options={branchOptions}
          optionLabel="label"
          optionValue="value"
          placeholder="Select a Offer Type"
          className="w-[200px] mt-2 h-[35px]"
          checkmark={true}
          highlightOnSelect={false}
        />

        {workSpace ? null : (
          <Button
            severity="success"
            onClick={() => {
              setWorkSpace(true);
            }}
            label="Add Offer"
          />
        )}
      </div>

      {workSpace ? (
        <>
          <form onSubmit={handleFeesSubmit}>
            <div className="m-2 p-3 rounded shadow-md mt-5 bg-[#f6f5f5]">
              <div className="my-3 text-[25px] font-semibold">
                {updateStructure ? "Update Offers" : "Add Offers"}
              </div>
              <div className="flex justify-between">
                <div className="flex flex-column gap-2 w-[48%]">
                  <label htmlFor="username">Minimum Value</label>
                  <InputNumber
                    value={workSpaceData.minimumval}
                    onChange={(e: any) => {
                      setWorkSpaceData({
                        ...workSpaceData,
                        minimumval: e.value,
                      });
                    }}
                    required
                  />
                </div>
                <div className="flex flex-column gap-2 w-[48%]">
                  <label htmlFor="username">Discount / Offers</label>
                  <InputNumber
                    value={workSpaceData.offers}
                    onChange={(e: any) => {
                      setWorkSpaceData({
                        ...workSpaceData,
                        offers: e.value,
                      });
                    }}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-between mt-3">
                <div className="flex flex-column gap-2 w-[48%]">
                  <label htmlFor="username">Starting Date</label>
                  <Calendar
                    value={
                      workSpaceData.startingDate
                        ? new Date(workSpaceData.startingDate)
                        : null
                    }
                    onChange={(e: any) => {
                      setWorkSpaceData({
                        ...workSpaceData,
                        startingDate: e.value,
                      });
                    }}
                    required
                  />
                </div>
                <div className="flex flex-column gap-2 w-[48%]">
                  <label htmlFor="username">Ending Date</label>
                  <Calendar
                    value={
                      workSpaceData.endingDate
                        ? new Date(workSpaceData.endingDate)
                        : null
                    }
                    onChange={(e: any) => {
                      setWorkSpaceData({
                        ...workSpaceData,
                        endingDate: e.value,
                      });
                    }}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-between mt-3">
                <div className="flex flex-column gap-2 w-[100%]">
                  <label htmlFor="username">Description</label>
                  <InputText
                    value={workSpaceData.description}
                    onChange={(e: any) => {
                      setWorkSpaceData({
                        ...workSpaceData,
                        description: e.value,
                      });
                    }}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4 mb-3">
                {updateStructure ? (
                  <Button severity="warning" type="submit" label="Update" />
                ) : (
                  <Button severity="success" type="submit" label="Save" />
                )}
                &nbsp;&nbsp;
                <Button
                  onClick={() => {
                    setWorkSpace(false);
                    setUpdateStructure(false);
                    setWorkSpaceData({
                      refOfferId: null,
                      description: "",
                      minimumval: null,
                      offers: null,
                      startingDate: "",
                      endingDate: "",
                    });
                  }}
                  label="Close"
                />
              </div>
            </div>
          </form>
        </>
      ) : null}

      <DataTable value={tableData} className="mt-10">
        <Column field="Offer Type" header="Offer Type"></Column>
        <Column field="refCoupon" header="Coupon"></Column>
        <Column field="refMin" header="Minimum Value"></Column>
        <Column field="refOffer" header="Discount / Offers"></Column>
        <Column
          style={{ width: "8rem" }}
          field="refStartAt"
          header="Starting Date"
        ></Column>
        <Column
          style={{ width: "8rem" }}
          field="refEndAt"
          header="Ending Date"
        ></Column>
        <Column field="status" body={Status} header="Status"></Column>
        <Column field="refFeId" body={EditBtn} header="Edit"></Column>
        <Column field="refFeId" body={DeleteBtn} header="Delete"></Column>
      </DataTable>
    </>
  );
};

export default Offers;
