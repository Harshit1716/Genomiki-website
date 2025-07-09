import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Card, CardContent } from "@mui/material";
import { interpretationColumns, InterpretationData } from "./data/sheetData";

export default function ExcelLikeTable({ data }) {
  console.log(data);
  const rowdata = data;
  // console.log(data);
  return (
    <Card sx={{ height: 800, width: "100%", p: 2 }}>
      <CardContent sx={{ height: 800, width: "100%", p: 2 }}>
        <DataGrid
          rows={[...rowdata]}
          columns={interpretationColumns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
          disableSelectionOnClick
          density="comfortable"
          components={{ Toolbar: GridToolbar }}
        />
      </CardContent>
    </Card>
  );
}
