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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  DELETE_CATEGORY_API,
  GET_CATEGORY_API,
} from "../../Sevices/UrlService";
import { ApiService } from "../../Sevices/ApiService";
import { useNavigate } from "react-router-dom";
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

const ListCategory = () => {
  const [category, setCategory] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const navigate = useNavigate();


  // Sorting function
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  // 🔎 Filter collections by search
  const filteredCollections = category?.filter(
    (item) =>
      item?.categoryName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item?.categoryType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item?._id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort filtered collections
  const sortedApplications = filteredCollections?.slice().sort((a, b) => {
    if (orderBy === "id") {
      return order === "asc"
        ? a._id.localeCompare(b._id)
        : b._id.localeCompare(a._id);
    } else if (orderBy === "name") {
      return order === "asc"
        ? a.categoryName.localeCompare(b.categoryName)
        : b.categoryName.localeCompare(a.categoryName);
    } else if (orderBy === "type") {
      return order === "asc"
        ? a.categoryType.localeCompare(b.categoryType)
        : b.categoryType.localeCompare(a.categoryType);
    }
  });
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
      console.log("<<<id", id);
      const result = await ApiService.deleteDataServiceById(
        DELETE_CATEGORY_API,
        selectedId
      );

      console.log("Collection Added:", result);
      setOpenDialog(false);
      setSelectedId(null);
      GetAllData();
    } catch (error) {
      console.error("Error adding collection:", error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/editcategory/${id}`);
  };

  const GetAllData = async () => {
    try {
      const result = await ApiService.getDataService(GET_CATEGORY_API);
      console.log("<<<result", result);
      setCategory(result?.category);
      console.log("Collection Added:", result);
    } catch (error) {
      console.error("Error adding collection:", error);
    }
  };

  useEffect(() => {
    GetAllData();
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(category);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "category");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Category.xlsx");
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setOpenDialog(true); // open confirmation modal
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
    setSelectedId(null);
  };

  return (
    <div className="pr-5">
      <Card
        variant="outlined"
        className="w-full shadow-lg p-4 m-5 rounded-2xl bg-blue-50"
      >
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex justify-between items-center mb-6">
              {/* Title */}
              <h4 className="text-3xl font-extrabold text-gray-900 tracking-wide">
                List Category
              </h4>

              {/* Export Button */}
              <Button
                variant="contained"
                color="success"
                startIcon={<GetAppIcon />}
                onClick={exportToExcel}
                sx={{
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: "bold",
                  px: 3,
                  py: 1.2,
                  boxShadow: 3,
                  ml: 3, // <-- gap between title & button if they wrap
                  ":hover": {
                    backgroundColor: "#2e7d32",
                    boxShadow: 6,
                  },
                }}
              >
                Export to Excel
              </Button>
            </div>

            <div className="flex items-center gap-2 bg-white rounded-md px-2 py-1 shadow-sm">
              <SearchIcon className="text-gray-500" />
              <TextField
                size="small"
                placeholder="Search collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "id"} // highlight when sorting by ID
                      direction={orderBy === "id" ? order : "asc"} // current sort direction
                      onClick={() => handleSort("id")} // toggle sorting
                    >
                      ID
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "name"}
                      direction={orderBy === "name" ? order : "asc"}
                      onClick={() => handleSort("name")}
                    >
                      Category Name
                    </TableSortLabel>
                  </TableCell>

                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "name"}
                      direction={orderBy === "name" ? order : "asc"}
                      onClick={() => handleSort("name")}
                    >
                      Category Type
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedApplications
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((collection) => (
                    <TableRow key={collection._id}>
                      <TableCell>{collection?._id}</TableCell>

                      <TableCell>{collection?.categoryName}</TableCell>
                      <TableCell>{collection?.categorytype}</TableCell>

                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(collection?._id)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteClick(collection._id)}
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
            count={category?.length}
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
        <DialogContent>
          Are you sure you want to delete this category?
        </DialogContent>
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

export default ListCategory;
