import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Card, CardContent } from "@mui/material";
import { columns } from "./data/inherigence";
import { useSelector } from "react-redux";
import { columnData } from "./data/sheetData";

export default function ExcelLikeTable({ handleSelection, data }) {
  const { isInherigene } = useSelector((state) => state.login);
  const DataRows = data;
  const Datacoloums = isInherigene ? columns : columnData;
  return (
    <Card sx={{ height: 800, width: "100%", p: 2 }}>
      <CardContent sx={{ height: 800, width: "100%", p: 2 }}>
        <DataGrid
          rows={DataRows}
          columns={Datacoloums}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
          disableSelectionOnClick
          components={{ Toolbar: GridToolbar }}
          onSelectionModelChange={(data) => {
            console.log(data, handleSelection);
            if (handleSelection) {
              handleSelection(data);
            }
          }}
        />
      </CardContent>
    </Card>
  );
}
