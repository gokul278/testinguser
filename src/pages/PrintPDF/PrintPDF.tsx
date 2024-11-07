import React, { useState } from "react";
import {
  Document,
  Page,
  Text,
  View,
  PDFViewer,
  Image,
  Font,
} from "@react-pdf/renderer";
import logo from "../../assets/Images/Logo/logo.png";
import PoppinsBold from "../../assets/Font/Poppins-Bold.ttf";
import PoppinsSemiBold from "../../assets/Font/Poppins-SemiBold.ttf";

// Register the font with specified weights
Font.register({
  family: "Poppins",
  fonts: [
    { src: PoppinsBold, fontWeight: "bold" },
    { src: PoppinsSemiBold, fontWeight: 600 }, // Corrected font weight
  ],
});

const PrintPDF: React.FC = () => {
  const [userData, setUserData] = useState({
    id: "UBY10099",
    name: "GOKUL M",
    mail: "gokulhk278@gmail.com",
    phonenumber: "9842653413",
    branchno: "12",
  });

  return (
    <div>
      <PDFViewer style={{ width: "95%", height: "90vh" }} showToolbar={false}>
        <Document>
          <Page size="A4">
            <View style={{ paddingTop: "10px", paddingLeft:"20px", paddingRight:"20px" }}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid #f84f04",
                  paddingBottom: "5px",
                }}
              >
                <Image src={logo} style={{ width: "125px", height: "auto" }} />
                <View>
                  <Text
                    style={{
                      fontSize: "20px",
                      fontFamily: "Poppins",
                      fontWeight: "bold",
                      color: "#f95005",
                    }}
                  >
                    Ublis Yoga India Private Limited
                  </Text>
                  <Text
                    style={{
                      fontSize: "12px",
                      marginTop: "3px",
                      textAlign: "right",
                    }}
                  >
                    No :28, Second Floor, Madambakkam Main Road,
                  </Text>
                  <Text
                    style={{
                      fontSize: "12px",
                      marginTop: "3px",
                      textAlign: "right",
                    }}
                  >
                    Opp. to Jains Sudharshana Apartment Gandhi nagar,
                  </Text>
                  <Text
                    style={{
                      fontSize: "12px",
                      marginTop: "3px",
                      textAlign: "right",
                    }}
                  >
                    Rajakilpakkam, Chennai, Tamil Nadu-600073, India
                  </Text>
                  <Text
                    style={{
                      fontSize: "12px",
                      marginTop: "5px",
                      textAlign: "right",
                      fontFamily: "Poppins",
                      fontWeight: 600,
                    }}
                  >
                    GSTIN 33AACCU8675J1ZV
                  </Text>
                  <Text
                    style={{
                      fontSize: "12px",
                      marginTop: "3px",
                      textAlign: "right",
                      fontFamily: "Poppins",
                      fontWeight: 600,
                    }}
                  >
                    Email: ublisyogafunds@gmail.com
                  </Text>
                </View>
              </View>

              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  alignItems: "center",
                  marginTop: "10px",
                  fontFamily: "Poppins",
                  fontWeight: 600, // Apply 600 for semi-bold
                }}
              >
                <Text style={{ fontSize: "25px" }}>Tax Invoice</Text>
              </View>

              <View
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: "10px",
                }}
              >
                <View
                  style={{
                    width: "65%",
                    border: "2px solid #f95005",
                    borderRadius: "4px",
                    padding: "6px",
                  }}
                >
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text
                      style={{
                        width: "40%",
                        fontSize: "13px",
                        fontFamily: "Poppins",
                        fontWeight: "bold",
                        color: "#f95005",
                      }}
                    >
                      Customer ID
                    </Text>
                    <Text style={{ width: "60%", fontSize: "13px" }}>
                      : {userData.id}
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginTop: "5px",
                    }}
                  >
                    <Text
                      style={{
                        width: "40%",
                        fontSize: "13px",
                        fontFamily: "Poppins",
                        fontWeight: "bold",
                        color: "#f95005",
                      }}
                    >
                      Name
                    </Text>
                    <Text style={{ width: "60%", fontSize: "13px" }}>
                      : {userData.name}
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginTop: "5px",
                    }}
                  >
                    <Text
                      style={{
                        width: "40%",
                        fontSize: "13px",
                        fontFamily: "Poppins",
                        fontWeight: "bold",
                        color: "#f95005",
                      }}
                    >
                      Phone Number
                    </Text>
                    <Text style={{ width: "60%", fontSize: "13px" }}>
                      : {userData.phonenumber}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    width: "30%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        width: "40%",
                        fontSize: "13px",
                        fontFamily: "Poppins",
                        fontWeight: "bold",
                        color: "#f95005",
                      }}
                    >
                      Date:
                    </Text>
                    <Text
                      style={{
                        width: "40%",
                        fontSize: "13px",
                      }}
                    >
                      19-09-2024
                    </Text>
                  </View>
                </View>
              </View>

              <View
                style={{
                  width: "100%",
                  marginTop: "20px",
                  marginBottom: "20px",
                  border: "2px solid #f95005",
                  borderRadius: "4px",
                }}
              >
                <View
                  style={{
                    width: "100%",
                    backgroundColor: "#fff",
                    display: "flex",
                    flexDirection: "row",
                    borderBottom: "1px solid #f95005",
                  }}
                >
                  <Text
                    style={{
                      width: "10%",
                      height: "40px",
                      fontSize: "12px",
                      fontFamily: "Poppins",
                      color: "#f95005",
                      textAlign: "center",
                      borderRight: "1px solid #f95005",
                    }}
                  >
                    Order &nbsp; ID
                  </Text>
                  <View
                    style={{
                      width: "20%",
                      height: "40px",
                      fontSize: "12px",
                      fontFamily: "Poppins",
                      color: "#f95005",
                      borderRight: "1px solid #f95005",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>Description</Text>
                  </View>
                  <View
                    style={{
                      width: "20%",
                      height: "40px",
                      fontSize: "12px",
                      fontFamily: "Poppins",
                      color: "#f95005",
                      borderRight: "1px solid #f95005",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>Date</Text>
                  </View>
                  <View
                    style={{
                      width: "20%",
                      height: "40px",
                      fontSize: "12px",
                      fontFamily: "Poppins",
                      color: "#f95005",
                      borderRight: "1px solid #f95005",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>Fee</Text>
                  </View>
                  <View
                    style={{
                      width: "20%",
                      height: "40px",
                      fontSize: "12px",
                      fontFamily: "Poppins",
                      color: "#f95005",
                      textAlign: "center",
                      borderRight: "1px solid #f95005",
                    }}
                  >
                    <Text
                      style={{
                        width: "100%",
                        height: "20px",
                        fontSize: "12px",
                        fontFamily: "Poppins",
                        color: "#f95005",
                        textAlign: "center",
                        borderBottom: "1px solid #f95005",
                      }}
                    >
                      CGST
                    </Text>
                    <View
                      style={{
                        width: "100%",
                        height: "20px",
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <Text
                        style={{
                          width: "50%",
                          fontSize: "12px",
                          fontFamily: "Poppins",
                          color: "#f95005",
                          textAlign: "center",
                          borderRight: "1px solid #f95005",
                        }}
                      >
                        %
                      </Text>
                      <Text
                        style={{
                          width: "50%",
                          fontSize: "12px",
                          fontFamily: "Poppins",
                          color: "#f95005",
                          textAlign: "center",
                        }}
                      >
                        Amt
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      width: "20%",
                      height: "40px",
                      fontSize: "12px",
                      fontFamily: "Poppins",
                      color: "#f95005",
                      textAlign: "center",
                    }}
                  >
                    <Text
                      style={{
                        width: "100%",
                        height: "20px",
                        fontSize: "12px",
                        fontFamily: "Poppins",
                        color: "#f95005",
                        textAlign: "center",
                        borderBottom: "1px solid #f95005",
                      }}
                    >
                      SGST
                    </Text>
                    <View
                      style={{
                        width: "100%",
                        height: "20px",
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <Text
                        style={{
                          width: "50%",
                          fontSize: "12px",
                          fontFamily: "Poppins",
                          color: "#f95005",
                          textAlign: "center",
                          borderRight: "1px solid #f95005",
                        }}
                      >
                        %
                      </Text>
                      <Text
                        style={{
                          width: "50%",
                          fontSize: "12px",
                          fontFamily: "Poppins",
                          color: "#f95005",
                          textAlign: "center",
                        }}
                      >
                        Amt
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    width: "100%",
                    backgroundColor: "#fff",
                    display: "flex",
                    flexDirection: "row",
                    borderBottom: "1px solid #f95005",
                  }}
                >
                  <View
                    style={{
                      width: "10%",
                      height: "60px",
                      fontSize: "12px",
                      color: "#000",
                      textAlign: "center",
                      borderRight: "1px solid #f95005",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>1001</Text>
                  </View>

                  <View
                    style={{
                      width: "20%",
                      height: "60px",
                      fontSize: "12px",
                      color: "#000",
                      textAlign: "center",
                      borderRight: "1px solid #f95005",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>Customized Sessions 8 Classes Fees</Text>
                  </View>

                  <View
                    style={{
                      width: "20%",
                      height: "60px",
                      fontSize: "12px",
                      color: "#000",
                      textAlign: "center",
                      borderRight: "1px solid #f95005",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>01-11-2024 to 30-12-2024</Text>
                  </View>

                  <View
                    style={{
                      width: "20%",
                      height: "60px",
                      fontSize: "12px",
                      color: "#000",
                      textAlign: "center",
                      borderRight: "1px solid #f95005",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>800</Text>
                  </View>

                  <View
                    style={{
                      width: "20%",
                      height: "60px",
                      fontSize: "12px",
                      color: "#000",
                      textAlign: "center",
                      borderRight: "1px solid #f95005",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    <View
                      style={{
                        width: "50%",
                        height: "60px",
                        borderRight: "1px solid #f95005 ",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text>9%</Text>
                    </View>
                    <View
                      style={{
                        width: "50%",
                        height: "60px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text>72.00</Text>
                    </View>
                  </View>

                  <View
                    style={{
                      width: "20%",
                      height: "60px",
                      fontSize: "12px",
                      color: "#000",
                      textAlign: "center",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    <View
                      style={{
                        width: "50%",
                        height: "60px",
                        borderRight: "1px solid #f95005 ",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text>9%</Text>
                    </View>
                    <View
                      style={{
                        width: "50%",
                        height: "60px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text>72.00</Text>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    width: "100%",
                    backgroundColor: "#fff",
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{ width: "55%", borderRight: "1px solid #f95005" }}
                  >
                    {" "}
                  </Text>
                  <View style={{ width: "43%" }}>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "flex-end",
                        textAlign: "right",
                        fontSize: "11px",
                        marginTop: "10px",
                      }}
                    >
                      <Text style={{ width: "50%" }}>Sub Total</Text>
                      <Text style={{ width: "50%" }}>800.00</Text>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "flex-end",
                        textAlign: "right",
                        fontSize: "11px",
                        marginTop: "5px",
                      }}
                    >
                      <Text style={{ width: "50%" }}>Offer</Text>
                      <Text style={{ width: "50%" }}>-</Text>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "flex-end",
                        textAlign: "right",
                        fontSize: "11px",
                        marginTop: "4px",
                      }}
                    >
                      <Text style={{ width: "50%" }}>Offer Discount</Text>
                      <Text style={{ width: "50%" }}>-</Text>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "flex-end",
                        textAlign: "right",
                        fontSize: "11px",
                        marginTop: "4px",
                      }}
                    >
                      <Text style={{ width: "50%" }}>CGST9(%)</Text>
                      <Text style={{ width: "50%" }}>72.00</Text>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "flex-end",
                        textAlign: "right",
                        fontSize: "11px",
                        marginTop: "4px",
                      }}
                    >
                      <Text style={{ width: "50%" }}>SGST9(%)</Text>
                      <Text style={{ width: "50%" }}>72.00</Text>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "flex-end",
                        textAlign: "right",
                        fontSize: "11px",
                        marginTop: "4px",
                        fontFamily: "Poppins",
                      }}
                    >
                      <Text style={{ width: "50%" }}>Total</Text>
                      <Text style={{ width: "50%" }}>Rs.944.00</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View>
                <Text style={{ fontSize: "16px", fontFamily: "Poppins" }}>
                  Terms & Conditions
                </Text>
                <Text
                  style={{
                    fontSize: "13px",
                    marginTop: "10px",
                    textAlign: "justify",
                  }}
                >
                  User has to be complete their sessions on the subscribed month
                  itself, the sessions cannot be compensate or carry forward to
                  the next month.
                </Text>

                <Text
                  style={{
                    fontSize: "13px",
                    marginTop: "10px",
                    textAlign: "justify",
                  }}
                >
                  All subscription sessions purchased by User are
                  non-refundable, non exchangeable, non- saleable and non-
                  transferrable. User wishes to disconitinue with its
                  subscription, User will not receive the refund.
                </Text>
              </View>

              <View>
                <Text
                  style={{
                    fontSize: "11px",
                    fontFamily: "Poppins",
                    textAlign: "center",
                    marginTop: "20px",
                  }}
                >
                  This is computer generated invoice no signature required
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: "#f95005",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  width: "110%",
                  marginLeft: "-30px",
                  marginTop:"107px"
                }}
              >
                <Text
                  style={{
                    fontSize: "12px",
                    textAlign: "center",
                    fontFamily: "Poppins",
                    color: "#fff",
                    fontWeight: 600,
                  }}
                >
                  {" "}
                  Copyright © UCCASH Tourism - {new Date().getFullYear()}. All
                  Rights Reserved.
                </Text>
              </View>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </div>
  );
};

export default PrintPDF;
