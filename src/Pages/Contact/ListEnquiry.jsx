import React, { useEffect, useState } from "react";
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
  Checkbox,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  DELETE_CATEGORY_API,
  DELETE_ENQUIRY,
  DELETE_PRODUCT_API,
  GET_CONTACT,
  GET_PRODUCT_API,
} from "../../Sevices/UrlService";
import { ApiService } from "../../Sevices/ApiService";
import SearchIcon from "@mui/icons-material/Search";
import saveAs from "file-saver";
import * as XLSX from "xlsx";
import { Button } from "@mui/material";
import GetAppIcon from "@mui/icons-material/GetApp";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const ListEnquiry = () => {
  const [form, setForm] = useState([]);

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  console.log("<<<form", form);
  // Sorting function
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Action handlers
  const handleDelete = async (id) => {
    try {
      const result = await ApiService.deleteDataServiceById(
        DELETE_ENQUIRY,
        selectedId
      );
      setOpenDialog(false);
      setSelectedId(null);
      GetAllData();
    } catch (error) {
      console.error("Error adding collection:", error);
    }
  };

  const GetAllData = async () => {
    try {
      const result = await ApiService.getDataService(GET_CONTACT);
      setForm(result?.Enquiry || []);
    } catch (error) {
      console.error("Error adding collection:", error);
    }
  };

  useEffect(() => {
    GetAllData();
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(form);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "form");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "form.xlsx");
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setOpenDialog(true); // open confirmation modal
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
    setSelectedId(null);
  };

  const inRange = (iso) => {
    if (!fromDate && !toDate) return true;
    const t = new Date(iso).getTime();
    const start = fromDate
      ? new Date(fromDate + "T00:00:00").getTime()
      : -Infinity;
    const end = toDate
      ? new Date(toDate + "T23:59:59.999").getTime()
      : Infinity;
    return t >= start && t <= end;
  };

  // q = search text (lowercased)
  const q = (searchQuery || "").toLowerCase();

  // ✅ filter by id/name/email/phone/details
  const filtered = (form || []).filter((r) => {
    const matchesText = [
      r?._id,
      r?.name,
      r?.email,
      r?.phone,
      r?.additionalDetails,
    ].some((v) => (v || "").toLowerCase().includes(q));
    const matchesDate = inRange(r?.createdAt);
    return matchesText && matchesDate;
  });

  // ✅ sort by a field (id/name/email/phone/createdAt)
  const dir = order === "asc" ? 1 : -1;
  const val = (x) => (x || "").toString().toLowerCase();

  const sorted = [...filtered].sort((a, b) => {
    if (orderBy === "createdAt") {
      return dir * (new Date(a?.createdAt) - new Date(b?.createdAt));
    }
    const A =
      orderBy === "id"
        ? val(a?._id)
        : orderBy === "firstName"
        ? val(a?.firstName)
        : orderBy === "lastName"
        ? val(a?.lastName)
        : orderBy === "email"
        ? val(a?.email)
        : orderBy === "phone"
        ? val(a?.phone)
        : ""; // default no-op
    const B =
      orderBy === "id"
        ? val(b?._id)
        : orderBy === "firstName"
        ? val(b?.firstName)
        : orderBy === "lastName"
        ? val(b?.lastName)
        : orderBy === "email"
        ? val(b?.email)
        : orderBy === "phone"
        ? val(b?.phone)
        : "";
    return A < B ? -dir : A > B ? dir : 0;
  });

  // ✅ paginate as before
  const visible = sorted.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const isSelected = (id) => selectedIds.includes(id);

  const toggleOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    const idsOnPage = visible.map((x) => x._id);
    const allSelected = idsOnPage.every((id) => selectedIds.includes(id));
    setSelectedIds((prev) =>
      allSelected
        ? prev.filter((id) => !idsOnPage.includes(id))
        : Array.from(new Set([...prev, ...idsOnPage]))
    );
  };

  const deleteSelected = async () => {
    if (!selectedIds.length) return;
    try {
      await Promise.all(
        selectedIds.map((id) =>
          ApiService.deleteDataServiceById(DELETE_ENQUIRY, id)
        )
      );
      setSelectedIds([]);
      GetAllData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="pr-5">
      <Card
        variant="outlined"
        className="w-full shadow-lg p-4 m-5 rounded-2xl bg-blue-50"
      >
        <CardContent>
          <div className="mb-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-300">
              <h4 className="text-3xl font-extrabold text-gray-900 tracking-wide">
                Enquiry
              </h4>

              <Button
                variant="outlined"
                color="error"
                onClick={deleteSelected}
                sx={{
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                Delete Selected
              </Button>
            </div>

            <div className="flex flex-wrap justify-between items-center mt-4 gap-3">
              <Button
                variant="outlined"
                startIcon={<GetAppIcon />}
                onClick={exportToExcel}
                sx={{
                  backgroundColor: "#f8f8f8",
                  color: "#555",
                  fontWeight: 400,
                  textTransform: "none",
                  fontSize: "0.9rem",
                  borderRadius: "8px",
                  borderColor: "#ddd",
                  boxShadow: "none",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                    borderColor: "#ccc",
                    boxShadow: "none",
                    color: "#333",
                  },
                  "& .MuiSvgIcon-root": {
                    fontSize: "1.1rem",
                    color: "#777",
                  },
                }}
              >
                Export to Excel
              </Button>

              <div className="flex flex-wrap items-end gap-4  p-4 rounded-xl shadow-sm">
                <div className="flex flex-col">
                  <TextField
                    type="date"
                    size="small"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="bg-white rounded-md"
                  />
                </div>
                <label className="flex text-sm font-medium text-gray-700 mb-2">
                  To
                </label>
                <div className="flex flex-col">
                  <TextField
                    type="date"
                    size="small"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="bg-white rounded-md"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white rounded-md px-2 py-1 shadow-sm w-full sm:w-auto">
                <SearchIcon className="text-gray-500" />
                <TextField
                  size="small"
                  placeholder="Search enquiries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <TableContainer>
            <Table
              sx={{
                marginTop: "20px",
                minWidth: 900,
                borderCollapse: "separate",
                borderSpacing: "0 10px",
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      indeterminate={
                        selectedIds.length > 0 &&
                        selectedIds.length < visible.length
                      }
                      checked={
                        visible.length > 0 &&
                        visible.every((r) => selectedIds.includes(r._id))
                      }
                      onChange={toggleAll}
                    />
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "id"}
                      direction={orderBy === "id" ? order : "asc"}
                      onClick={() => handleSort("id")}
                    >
                      ID
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "firstName"}
                      direction={orderBy === "firstName" ? order : "asc"}
                      onClick={() => handleSort("firstName")}
                    >
                      Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "lastName"}
                      direction={orderBy === "lastName" ? order : "asc"}
                      onClick={() => handleSort("lastName")}
                    >
                      Last Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "email"}
                      direction={orderBy === "email" ? order : "asc"}
                      onClick={() => handleSort("email")}
                    >
                      Email
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "phone"}
                      direction={orderBy === "phone" ? order : "asc"}
                      onClick={() => handleSort("phone")}
                    >
                      Phone
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">Details</TableCell>
                  <TableCell align="right">
                    <TableSortLabel
                      active={orderBy === "createdAt"}
                      direction={orderBy === "createdAt" ? order : "asc"}
                      onClick={() => handleSort("createdAt")}
                    >
                      Created
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {visible?.map((enq) => (
                  <TableRow
                    key={enq._id}
                    hover
                    selected={isSelected(enq._id)}
                    sx={{
                      backgroundColor: "#fff",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                      "&:hover": { backgroundColor: "#f9f9f9" },
                    }}
                  >
                    {/* Row checkbox */}
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isSelected(enq._id)}
                        onChange={() => toggleOne(enq._id)}
                      />
                    </TableCell>

                    <TableCell sx={{ width: "17%" }}>{enq._id}</TableCell>
                    <TableCell sx={{ width: "12%" }}>{enq.firstName}</TableCell>
                    <TableCell sx={{ width: "12%" }}>{enq.lastName}</TableCell>
                    <TableCell sx={{ width: "18%" }}>{enq.email}</TableCell>
                    <TableCell sx={{ width: "10%" }}>{enq.phone}</TableCell>
                    <TableCell
                      sx={{
                        width: "30%",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        textAlign: "justify",
                      }}
                    >
                      {enq.message}
                    </TableCell>
                    <TableCell align="right" sx={{ width: "10%" }}>
                      {new Date(enq.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell align="right" sx={{ width: "5%" }}>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(enq._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={form?.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this ?</DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>No</Button>
          <Button color="error" onClick={handleDelete}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ListEnquiry;
