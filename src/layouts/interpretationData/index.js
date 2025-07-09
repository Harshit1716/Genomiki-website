import React, { useEffect, useMemo, useState } from "react";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Card from "@mui/material/Card";

import ExcelLikeTable from "./TableData";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import { Grid } from "@mui/material";

import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { InterpretationData } from "./data/sheetData";
import MDButton from "components/MDButton";
import InheriGeneInterpretation from "../../assets/pdfs/InheriGeneInterpretation.pdf";
import onquerInterpretation from "../../assets/pdfs/onquerInterpretation.pdf";

function InterpretationPage() {
  const { files } = useSelector((state) => state.cases);
  const { reportId } = useParams();

  const [sampleData, setSampleData] = useState([]);

  useEffect(() => {
    const getFiles = () => {
      const currentRecord = files.filter(
        (item) => item?.sampleID == reportId
      )[0];
      console.log(currentRecord?.interpretationData, currentRecord?.sampleID);
      setSampleData(currentRecord?.interpretationData);
    };
    getFiles();
  }, [files]);

  const getInterPretationObjet = () => {
    const data = {};
    sampleData?.map((item) => {
      data[item?.["Gene Name"]] = item?.Interpretation;
    });

    return data;
  };
  const { isInherigene } = useSelector((state) => state.login);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Card>
          <MDBox
            mx={2}
            mt={-3}
            py={3}
            px={2}
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="info"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <MDTypography variant="h6" color="white">
              Interpretation
            </MDTypography>
            <MDButton
              color={"info"}
              variant="contained"
              size="small"
              onClick={() => {
                if (!isInherigene) {
                  const link = document.createElement("a");
                  link.href = onquerInterpretation;
                  link.download = "onquerInterpretation.pdf";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                } else {
                  const link = document.createElement("a");
                  link.href = InheriGeneInterpretation;
                  link.download = "InheriGeneInterpretation.pdf";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }
              }}
            >
              Download Report
            </MDButton>
          </MDBox>
          <Card
            sx={{
              position: "relative",
              m: 3,
              px: 2,
            }}
          >
            <Grid container spacing={1}>
              <Grid item xs={12} md={12} xl={12} sx={{ display: "flex" }}>
                <ProfileInfoCard
                  title="interpretation Detail"
                  description={getInterPretationObjet}
                  info={{
                    ...getInterPretationObjet(),
                  }}
                  social={[]}
                  action={{ route: "", tooltip: "Edit Profile" }}
                  shadow={false}
                />
              </Grid>
            </Grid>
          </Card>
          <MDBox pt={3} style={{ width: "100%", height: "100%" }}>
            <div
              className="ag-theme-alpine"
              style={{ width: "100%", height: "100%" }}
            >
              <ExcelLikeTable data={sampleData} />
            </div>
          </MDBox>
        </Card>
      </MDBox>
    </DashboardLayout>
  );
}

export default InterpretationPage;
