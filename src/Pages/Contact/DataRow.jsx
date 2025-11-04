import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  IconButton,
  TextField,
  Button,
  Collapse,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import GetAppIcon from "@mui/icons-material/GetApp";
import * as XLSX from "xlsx";
import saveAs from "file-saver";
import { useNavigate } from "react-router-dom";

import { ApiService } from "../../Sevices/ApiService";
import { GET_CONTACT, DELETE_ENQUIRY } from "../../Sevices/UrlService";

export const DataRow = ({ row, onEdit, onAskDelete }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow hover>
        <TableCell width={56}>
          <IconButton size="small" onClick={() => setOpen((v) => !v)}>
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{row?.firstName || row?.lastName}</TableCell>
        <TableCell>{row?.email}</TableCell>
        <TableCell>{row?.phone}</TableCell>
        <TableCell>{row?.message}</TableCell>

        <TableCell align="right">
          <IconButton color="primary" onClick={() => onEdit(row?._id)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => onAskDelete(row?._id)}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>

     
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2, bgcolor: "rgba(0,0,0,0.03)", borderRadius: 2 }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Additional Details</div>
                  <div className="font-medium">{row?.additionalDetails || "—"}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">ID</div>
                  <div className="font-mono break-all">{row?._id}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Created At</div>
                  <div>{new Date(row?.createdAt).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Updated At</div>
                  <div>{new Date(row?.updatedAt).toLocaleString()}</div>
                </div>
              </div>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};