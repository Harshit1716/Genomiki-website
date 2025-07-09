import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import { store } from "store/store";
import onquerInterpretation from "../../../assets/pdfs/onquerInterpretation.pdf";
import InheriGeneInterpretation from "../../../assets/pdfs/InheriGeneInterpretation.pdf";

export default function data(reportId) {
  const { files } = store.getState()?.cases;
  const { isInherigene } = store.getState()?.login;

  const getFiles = () => {
    const currentRecord = files.filter((item) => item?.sampleID == reportId);
    const newData = files.filter(
      (item) => item?.project_name == currentRecord?.[0]?.project_name
    );
    return newData;
  };

  getFiles();
  const Title = ({ name, item, onClick, isLink }) => (
    <MDBox
      onClick={onClick}
      display="flex"
      alignItems="center"
      lineHeight={1}
      style={{ cursor: "pointer" }}
    >
      <MDTypography
        display="block"
        color={isLink ? "info" : "text"}
        variant="button"
        fontWeight="medium"
      >
        {name}
      </MDTypography>
    </MDBox>
  );

  const Job = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography
        display="block"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );

  const handleDownloadFile = () => {
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
  };
  return {
    columns: [
      { Header: "id", accessor: "id", align: "left" },
      {
        Header: "Sample Name",
        accessor: "sampleName",
        width: "20%",
        align: "left",
      },
      { Header: "File Size", accessor: "fileSize", align: "center" },
      { Header: "Date", accessor: "date", align: "center" },
      { Header: "Time", accessor: "time", align: "center" },
      { Header: "Annotation", accessor: "annotation", align: "center" },
      { Header: "Report", accessor: "report", align: "center" },
      { Header: "status", accessor: "status", align: "center" },
    ],

    rows: [
      ...(getFiles() ?? []).map((item, index) => {
        const reportId = item?.sampleID;
        console.log(item, "asdjln");
        return {
          id: <Title name={index + 1 + ""} />,
          sampleName: (
            <Title
              name={item?.SampleName}
              onClick={() => {
                const event = new CustomEvent("navigate-to-item-detail", {
                  detail: { reportId },
                });
                window.dispatchEvent(event);
              }}
            />
          ),
          fileSize: item?.fileSize || "-",
          date: item?.createdAt || "-",
          time: item?.TimeAt || "-",
          annotation: (
            <Title
              name={"Analyse"}
              isLink={true}
              onClick={() => {
                // Navigate directly to /analyse/:reportId
                window.location.href = `/analyse/${reportId}`;
              }}
            />
          ),
          report: item?.adminReport ? (
            <a
              onClick={handleDownloadFile}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <DownloadIcon
                color="info"
                fontSize="small"
                style={{ verticalAlign: "middle" }}
              />
              Download
            </a>
          ) : (
            "-"
          ),
          status: (
            <MDBox>
              <MDBadge
                badgeContent={item?.status || "-"}
                color={item?.status === "Completed" ? "success" : "warning"}
                variant="gradient"
                size="sm"
              />
            </MDBox>
          ),
          action: (
            <DeleteIcon
              onClick={() => {}}
              color="warning"
              style={{ height: 24, width: 24 }}
            />
          ),
        };
      }),
    ],
  };
}
