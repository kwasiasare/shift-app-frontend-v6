import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";

const ShiftTable = ({ shifts, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper} style={{ marginTop: "20px" }}>
      <Table>
        <TableHead>
          <TableRow style={{ backgroundColor: "#004d40" }}>
            {" "}
            {/* Dark sea-blue header */}
            <TableCell style={{ fontWeight: "bold", color: "#ffffff" }}>
              Shift ID
            </TableCell>
            <TableCell style={{ fontWeight: "bold", color: "#ffffff" }}>
              Location
            </TableCell>
            <TableCell style={{ fontWeight: "bold", color: "#ffffff" }}>
              Date
            </TableCell>
            <TableCell style={{ fontWeight: "bold", color: "#ffffff" }}>
              Start Time
            </TableCell>
            <TableCell style={{ fontWeight: "bold", color: "#ffffff" }}>
              End Time
            </TableCell>
            <TableCell style={{ fontWeight: "bold", color: "#ffffff" }}>
              Map Staff
            </TableCell>
            <TableCell style={{ fontWeight: "bold", color: "#ffffff" }}>
              Gender
            </TableCell>
            <TableCell style={{ fontWeight: "bold", color: "#ffffff" }}>
              Original Message
            </TableCell>
            <TableCell style={{ fontWeight: "bold", color: "#ffffff" }}>
              Date Received
            </TableCell>
            <TableCell style={{ fontWeight: "bold", color: "#ffffff" }}>
              Time Received
            </TableCell>
            <TableCell style={{ fontWeight: "bold", color: "#ffffff" }}>
              Coordinator
            </TableCell>
            <TableCell style={{ fontWeight: "bold", color: "#ffffff" }}>
              Assigned To
            </TableCell>
            <TableCell style={{ fontWeight: "bold", color: "#ffffff" }}>
              Status
            </TableCell>
            <TableCell style={{ fontWeight: "bold", color: "#ffffff" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {shifts.map((shift, index) => {
              const shiftId = index + 1;
           return (
            <TableRow key={shift._id}>
            <TableCell>{shiftId}</TableCell>
            <TableCell>{shift.location}</TableCell>
            <TableCell>{moment(shift.date).format("YYYY-MM-DD")}</TableCell>
            <TableCell>{shift.start_time}</TableCell>
            <TableCell>{shift.end_time}</TableCell>
            <TableCell>{shift.map_staff}</TableCell>
            <TableCell>{shift.gender}</TableCell>
            <TableCell>{shift.message}</TableCell>
            <TableCell>{moment(shift.createdAt).format("L")}</TableCell>
            <TableCell>{moment(shift.date).format("LT")}</TableCell>
            <TableCell>{shift.coordinator}</TableCell>
            <TableCell>{shift.assigned}</TableCell>
            <TableCell>{shift.status}</TableCell>
            <TableCell>
              <IconButton onClick={() => onEdit(shift._id)} color="primary">
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={() => onDelete(shift._id)}
                color="secondary"
              >
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
           )
})}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ShiftTable;
