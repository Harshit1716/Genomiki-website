import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import ExcelLikeTable from "./TableData";

import MDButton from "components/MDButton";
import { useSelector } from "react-redux";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const CLASSIFICATION_COLORS = {
  pathogenic: "#ff0000",
  likelypathogenic: "#ff6666",
  uncertainsignificance: "#cc6600",
  likelybenign: "#47d147",
  benign: "#009900",
  unknown: "#8884d8", // fallback color
};

function normalizeClassification(str) {
  return (str || "unknown").replace(/[_\s]/g, "").toLowerCase();
}

function AnalyticsPage() {
  const { reportId } = useParams();
  const { files } = useSelector((state) => state.cases);
  const [sampleData, setSampleData] = useState([]);
  useEffect(() => {
    const getFiles = () => {
      const currentRecord = files.filter(
        (item) => item?.sampleID == reportId
      )[0];
      setSampleData(currentRecord.tableData);
    };
    getFiles();
  }, [files]);

  const classificationData = useMemo(() => {
    const map = {};
    sampleData.forEach((item) => {
      const key = normalizeClassification(item["Genomiki ACMG"]);
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, [sampleData]);

  const zygosityData = useMemo(() => {
    const map = {};
    sampleData.forEach((item) => {
      const key = item["Gene Name"] || "Unknown";
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [sampleData]);

  const depthData = useMemo(() => {
    return sampleData.map((item, index) => ({
      name: `Gene: ${item["Gene Name"] + 1}`,
      depth: parseInt(item.Depth) || 0,
    }));
  }, [sampleData]);

  const [selectedItems, setSelecedItems] = useState([]);
  const handleSelection = (data) => {
    console.log(data);
    setSelecedItems(data);
  };
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
              Analyse - {reportId}
            </MDTypography>
            <MDButton
              color={"info"}
              variant="contained"
              size="small"
              onClick={() => {
                if (selectedItems.length == 0) {
                  alert("Please select rows for interpretation");
                } else {
                  window.location.href = `/interpretation/${reportId}`;
                }
              }}
            >
              Interpretation
            </MDButton>
          </MDBox>

          <MDBox p={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <MDBox p={2}>
                    <MDTypography variant="h6">
                      Variant Classification
                    </MDTypography>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={classificationData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count">
                          {classificationData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                CLASSIFICATION_COLORS[
                                  normalizeClassification(entry.name)
                                ] || CLASSIFICATION_COLORS["unknown"]
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </MDBox>
                </Card>
              </Grid>

              {/* Zygosity */}
              <Grid item xs={12} md={6}>
                <Card>
                  <MDBox p={2}>
                    <MDTypography variant="h7">Gene Names</MDTypography>
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Pie
                          data={zygosityData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={90}
                          label
                        >
                          {zygosityData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </MDBox>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <MDBox p={2}>
                  <MDTypography variant="h6">Detailed Data</MDTypography>
                  <ExcelLikeTable
                    data={sampleData}
                    handleSelection={handleSelection}
                  />
                </MDBox>
              </Grid>
            </Grid>
          </MDBox>
        </Card>
      </MDBox>
    </DashboardLayout>
  );
}

export default AnalyticsPage;
