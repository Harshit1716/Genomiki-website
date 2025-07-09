import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import { useNavigate, useParams } from "react-router-dom";
import { useMemo, useRef, useState } from "react";
import { store } from "store/store";
import MDButton from "components/MDButton";
import { useDispatch, useSelector } from "react-redux";
import { editFile } from "store/fileUploadSlice";

function ReportDetail() {
  const { reportId } = useParams();
  const { files } = store.getState()?.cases;
  const { user } = store.getState()?.login;

  const dispatch = useDispatch();
  function getDOBFromAge(age) {
    if (!age || isNaN(Number(age))) return "";
    const now = new Date("2025-07-06");
    const birthYear = now.getFullYear() - Number(age);
    // Keep month and day as 01-01 for simplicity
    return `01-01-${birthYear}`;
  }

  // files state
  const geneListInputRef = useRef();
  const patientDataInputRef = useRef();

  const handleRemoveFile = (index, setFiles) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };
  const [patientDataFiles, setPatientDataFiles] = useState([]);

  // Find the record by reportId
  const record = useMemo(() => {
    if (!files || !reportId) return null;
    return files.find((item) => String(item?.sampleID) === String(reportId));
  }, [files, reportId]);

  const [geneListFiles, setGeneListFiles] = useState([]);
  const handleFileChange = (e, setFiles, type) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    let file = files[0];
    if (type === "tsv") {
      if (!file.name.endsWith(".tsv")) {
        alert("Only .tsv file allowed");
        return;
      }
      setFiles([
        {
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          status: "finished",
          progress: 100,
        },
      ]);
      if (record)
        dispatch(editFile({ id: record.id, updatedFields: { tsvFile: file } }));
    } else if (type === "pdf") {
      if (!file.name.endsWith(".pdf")) {
        alert("Only .pdf file allowed");
        return;
      }
      setFiles([
        {
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          status: "finished",
          progress: 100,
        },
      ]);
      if (record)
        dispatch(editFile({ id: record.id, updatedFields: { pdfFile: file } }));
    }

    setTimeout(() => {
      const tsvPresent =
        type === "tsv" ? true : !!(geneListFiles[0] && geneListFiles[0].file);
      const pdfPresent =
        type === "pdf"
          ? true
          : !!(patientDataFiles[0] && patientDataFiles[0].file);
      const status = tsvPresent && pdfPresent ? "completed" : "pending";
      if (record)
        dispatch(editFile({ id: record.id, updatedFields: { status } }));
    }, 0);
  };

  const { isInherigene } = useSelector((state) => state?.login);
  // Editable state for all fields
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    FileName: record?.file_name || "",
    SampleName: record?.SampleName || "",
    PatientName: record?.PatientName || "",
    PatientPhenotype: record?.PatientPhenotype || "",
    Gender: record?.Gender || "",
    Dob: record?.Dob || "",
    Age: record?.Age || "",
    SpecimenType: record?.SpecimenType || "",
    DateOfSequence: record?.DateOfSequence || "",
    SampleSubmissionDate: record?.SampleSubmissionDate || "",
    PlatformUsedForSequencing: record?.PlatformUsedForSequencing || "",
    VariantsToBeIdentified: record?.VariantsToBeIdentified || "",
    PatientLocation: record?.PatientLocation || "",
    ReferredBy: record?.ReferredBy || "",
    ClinicalHistory: record?.ClinicalHistory || "",
    TestInformation: record?.TestInformation || "",
    Assembly: record?.Assembly || "",
    AdditionalInformation: record?.AdditionalInformation || "",
  });

  const navigate = useNavigate();
  const handleNavigateToAnalyse = () => {
    navigate(`/analyse/${reportId}`);
  };

  // Update form state when record changes
  React.useEffect(() => {
    if (record) {
      setForm({
        FileName: record?.file_name || "",
        SampleName: record?.SampleName || "",
        PatientName: record?.user || "",
        PatientPhenotype: record?.phenotype || "",
        Gender: record?.gender || "",
        Dob: getDOBFromAge(record?.age) || "",
        Age: record?.age || "",
        SpecimenType: record?.sapecimenType || "",
        DateOfSequence: record?.DateOfSequencing || "",
        SampleSubmissionDate: record?.SampleSubmissionDate || "",
        PlatformUsedForSequencing: record?.PlatformUsedForSequencing || "",
        VariantsToBeIdentified: record?.VariantsToBeIdentified || "",
        PatientLocation: record?.PatientLocation || "",
        ReferredBy: record?.RefferedBy || "",
        ClinicalHistory: record?.ClinicalHistory || "",
        TestInformation: record?.TestInformation || "",
        Assembly: record?.Assembly || "",
        AdditionalInformation: record?.AdditionalInfo || "",
      });
    }
  }, [record]);

  const handleUpdate = () => {
    if (!record) return;
    dispatch(editFile({ id: record?.id, updatedFields: { ...form } }));
    setEditMode(false);
  };

  const renderField = (label, key, multiline = false) => (
    <Grid item xs={12} sm={6} md={4} lg={6}>
      <MDTypography variant="h6">{label}</MDTypography>
      {editMode ? (
        <MDBox mt={1}>
          <input
            type="text"
            value={form[key]}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid #b2bec3",

              fontSize: 16,
              ...(multiline ? { minHeight: 60 } : {}),
            }}
            {...(multiline ? { as: "textarea", rows: 3 } : {})}
          />
        </MDBox>
      ) : (
        <MDTypography
          color={key == "VariantsToBeIdentified" ? "info" : "black"}
          variant={key == "VariantsToBeIdentified" ? "h6" : "body2"}
        >
          {form[key] || "-"}
        </MDTypography>
      )}
    </Grid>
  );

  // Render a full-width field row (for long text)
  const renderFieldFull = (label, key) => (
    <Grid item xs={12}>
      <MDTypography variant="h6">{label}</MDTypography>
      {editMode ? (
        <MDBox mt={1}>
          <textarea
            value={form[key]}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid #b2bec3",
              fontSize: 16,
              minHeight: 60,
            }}
          />
        </MDBox>
      ) : (
        <MDTypography
          color={key == "TestInformation" ? "info" : "black"}
          variant={key == "TestInformation" ? "h6" : "body2"}
        >
          {form[key] || "-"}
        </MDTypography>
      )}
    </Grid>
  );

  const UploadSection = () => {
    return (
      <Grid mt={4} mr={0} container direction="row" spacing={2}>
        {/* TSV Upload */}
        <Grid item xs={6}>
          <MDTypography variant="h6" mb={2} ml={2}>
            TSV FILE :
          </MDTypography>
          <MDBox
            mb={2}
            p={2}
            sx={{ background: "#f5f7fa", borderRadius: 4, boxShadow: 1 }}
          >
            <MDTypography variant="h6" fontWeight="bold" mb={2} align="center">
              TSV file to be uploaded
            </MDTypography>
            <input
              ref={geneListInputRef}
              type="file"
              accept=".tsv"
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e, setGeneListFiles, "tsv")}
            />
            <MDBox mb={2}>
              {geneListFiles.length > 0 && (
                <MDBox
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  p={1}
                  mb={1}
                  sx={{ background: "#fff", borderRadius: 2, boxShadow: 0.5 }}
                >
                  <MDBox display="flex" alignItems="center" gap={1}>
                    <span style={{ fontSize: 28, marginRight: 8 }}>📄</span>
                    <MDTypography variant="body2" fontWeight="medium">
                      {geneListFiles[0].name}
                    </MDTypography>
                    <MDTypography variant="caption" color="text" ml={1}>
                      {geneListFiles[0].status === "finished"
                        ? "Finished"
                        : "Uploading"}{" "}
                      {Math.round(geneListFiles[0].size / 1024)}Kb
                    </MDTypography>
                  </MDBox>
                  {geneListFiles.length > 0 && (
                    <MDBox
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      p={1}
                      mb={1}
                      sx={{
                        background: "#fff",
                        borderRadius: 2,
                        boxShadow: 0.5,
                      }}
                    >
                      <MDBox display="flex" alignItems="center" gap={1}>
                        <MDTypography variant="caption" color="text" ml={1}>
                          {Math.round(geneListFiles[0].size / 1024)}Kb
                        </MDTypography>
                      </MDBox>
                      <MDBox display="flex" alignItems="center" gap={1}>
                        <MDButton
                          size="small"
                          color="error"
                          variant="text"
                          onClick={() => setGeneListFiles([])}
                        >
                          Remove
                        </MDButton>
                        <MDButton
                          size="small"
                          color="info"
                          variant="outlined"
                          onClick={() => geneListInputRef.current.click()}
                        >
                          Upload Another
                        </MDButton>
                      </MDBox>
                    </MDBox>
                  )}
                </MDBox>
              )}
            </MDBox>
            {geneListFiles.length === 0 && (
              <MDBox
                onClick={() => geneListInputRef.current.click()}
                sx={{
                  border: "2px dashed #b2bec3",
                  borderRadius: 3,
                  background: "#fafdff",
                  textAlign: "center",
                  py: 4,
                  cursor: "pointer",
                  transition: "border-color 0.2s",
                  "&:hover": { borderColor: "#1a73e8" },
                }}
              >
                <MDBox
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <span style={{ fontSize: 36, color: "#b2bec3" }}>☁️</span>
                  <MDTypography
                    variant="body2"
                    fontWeight="medium"
                    color="text"
                    mt={1}
                  >
                    DRAG AND DROP
                  </MDTypography>
                  <MDTypography variant="caption" color="text">
                    or Browse
                  </MDTypography>
                </MDBox>
              </MDBox>
            )}
          </MDBox>
        </Grid>
        {/* PDF Upload */}
        <Grid item xs={6}>
          <MDTypography variant="h6" mb={2} ml={2}>
            PDF FILE :
          </MDTypography>
          <MDBox
            mb={2}
            p={2}
            sx={{ background: "#f5f7fa", borderRadius: 4, boxShadow: 1 }}
          >
            <MDTypography variant="h6" fontWeight="bold" mb={2} align="center">
              Patient data*
            </MDTypography>
            <input
              ref={patientDataInputRef}
              type="file"
              accept=".pdf"
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e, setPatientDataFiles, "pdf")}
            />
            <MDBox mb={2}>
              {patientDataFiles.length > 0 && (
                <MDBox
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  p={1}
                  mb={1}
                  sx={{ background: "#fff", borderRadius: 2, boxShadow: 0.5 }}
                >
                  <MDBox display="flex" alignItems="center" gap={1}>
                    <span style={{ fontSize: 28, marginRight: 8 }}>📄</span>
                    <MDTypography variant="body2" fontWeight="medium">
                      {patientDataFiles[0].name}
                    </MDTypography>
                    <MDTypography variant="caption" color="text" ml={1}>
                      {patientDataFiles[0].status === "finished"
                        ? "Finished"
                        : "Uploading"}{" "}
                      {Math.round(patientDataFiles[0].size / 1024)}Kb
                    </MDTypography>
                  </MDBox>
                  {patientDataFiles.length > 0 && (
                    <MDBox
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      p={1}
                      mb={1}
                      sx={{
                        background: "#fff",
                        borderRadius: 2,
                        boxShadow: 0.5,
                      }}
                    >
                      <MDBox display="flex" alignItems="center" gap={1}>
                        <MDTypography variant="caption" color="text" ml={1}>
                          {Math.round(patientDataFiles[0].size / 1024)}Kb
                        </MDTypography>
                      </MDBox>
                      <MDBox display="flex" alignItems="center" gap={1}>
                        <MDButton
                          size="small"
                          color="error"
                          variant="text"
                          onClick={() => setPatientDataFiles([])}
                        >
                          Remove
                        </MDButton>
                        <MDButton
                          size="small"
                          color="info"
                          variant="outlined"
                          onClick={() => patientDataInputRef.current.click()}
                        >
                          Upload Another
                        </MDButton>
                      </MDBox>
                    </MDBox>
                  )}
                </MDBox>
              )}
            </MDBox>
            {patientDataFiles.length === 0 && (
              <MDBox
                onClick={() => patientDataInputRef.current.click()}
                sx={{
                  border: "2px dashed #b2bec3",
                  borderRadius: 3,
                  background: "#fafdff",
                  textAlign: "center",
                  py: 4,
                  cursor: "pointer",
                  transition: "border-color 0.2s",
                  "&:hover": { borderColor: "#1a73e8" },
                }}
              >
                <MDBox
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <span style={{ fontSize: 36, color: "#b2bec3" }}>☁️</span>
                  <MDTypography
                    variant="body2"
                    fontWeight="medium"
                    color="text"
                    mt={1}
                  >
                    DRAG AND DROP
                  </MDTypography>
                  <MDTypography variant="caption" color="text">
                    or Browse
                  </MDTypography>
                </MDBox>
              </MDBox>
            )}
          </MDBox>
        </Grid>
      </Grid>
    );
  };

  React.useEffect(() => {
    // Prepopulate geneListFiles and patientDataFiles from Redux record
    if (record) {
      if (record.tsvFile && record.tsvFile.name && record.tsvFile.name != "") {
        setGeneListFiles([
          {
            file: record.tsvFile,
            name: record.tsvFile.name,
            size: record.tsvFile.size,
            type: record.tsvFile.type,
            status: "finished",
            progress: 100,
          },
        ]);
      } else {
        setGeneListFiles([]);
      }
      if (record.pdfFile && record.pdfFile.name && record.pdfFile.name != "") {
        setPatientDataFiles([
          {
            file: record.pdfFile,
            name: record.pdfFile.name,
            size: record.pdfFile.size,
            type: record.pdfFile.type,
            status: "finished",
            progress: 100,
          },
        ]);
      } else {
        setPatientDataFiles([]);
      }
    }
  }, [record]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12} md={12} lg={12}>
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
                <MDTypography variant="h5" color="white">
                  {isInherigene
                    ? `Case Details (${record?.VariantsToBeIdentified.split(
                        ","
                      ).join(" , ")})`
                    : `Project Details  (${record?.VariantsToBeIdentified.split(
                        ","
                      ).join(" , ")}) `}
                </MDTypography>
                <MDButton
                  color={"info"}
                  variant="contained"
                  size="small"
                  onClick={() => {
                    handleNavigateToAnalyse();
                  }}
                >
                  Analyse
                </MDButton>
                {user?.role === "admin" && (
                  <MDButton
                    color={editMode ? "success" : "info"}
                    variant="contained"
                    size="small"
                    onClick={() => {
                      if (editMode) handleUpdate();
                      else setEditMode(true);
                    }}
                  >
                    {editMode ? "Save" : "Edit"}
                  </MDButton>
                )}
              </MDBox>
              <MDBox p={3}>
                {record ? (
                  <Grid container spacing={2}>
                    {renderField("Sample Name", "SampleName")}
                    {/* {renderField("Patient Name", "PatientName")} */}

                    {renderFieldFull("Test Information", "TestInformation")}
                    {renderField(
                      "Variants To Be Identified",
                      "VariantsToBeIdentified"
                    )}
                    {renderField(
                      "Platform Used For Sequencing",
                      "PlatformUsedForSequencing"
                    )}
                    {renderField("Assembly", "Assembly")}
                    {renderField("Gender", "Gender")}
                    {isInherigene &&
                      renderField("Patient Phenotype", "PatientPhenotype")}
                    {renderField("Specimen Type", "SpecimenType")}
                    {renderField("Date Of Birth", "Dob")}
                    {renderField("Age", "Age")}
                    {renderField("Date Of Sequencing", "DateOfSequence")}
                    {renderField(
                      "Sample Submission Date",
                      "SampleSubmissionDate"
                    )}
                    {renderField("Patient Location", "PatientLocation")}
                    {renderField("Referred By", "ReferredBy")}
                    {renderFieldFull("Clinical History", "ClinicalHistory")}

                    {renderFieldFull(
                      "Additional Information",
                      "AdditionalInformation"
                    )}
                  </Grid>
                ) : (
                  <MDTypography variant="body1" color="error">
                    No record found for this report.
                  </MDTypography>
                )}
                {user.role == "admin" && <UploadSection />}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default ReportDetail;
