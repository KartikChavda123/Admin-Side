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
  DELETE_PRODUCT_API,
  GET_PRODUCT_API,
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

const ListProduct = () => {
  const [form, setForm] = useState([]);

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  console.log("<<<<<selectedId", selectedId);

  const navigate = useNavigate();

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
      console.log("<<<id", id);
      const result = await ApiService.deleteDataServiceById(
        DELETE_PRODUCT_API,
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
    navigate(`/editproduct/${id}`);
  };

  const GetAllData = async () => {
    try {
      const result = await ApiService.getDataService(GET_PRODUCT_API);
      setForm(result?.Products);
      console.log("<<<result", result);

      console.log("Collection Added:", result);
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

  const filteredProducts = form?.filter((product) => {
    const matchesId = product._id
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Check all categories for name or type match
    const matchesCategory = product.categories?.some((cat) => {
      return (
        cat?.categoryName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat?.categoryType?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

    return matchesId || matchesCategory;
  });

  const sortedProducts = filteredProducts?.slice().sort((a, b) => {
    if (orderBy === "id") {
      return order === "asc"
        ? a._id.localeCompare(b._id)
        : b._id.localeCompare(a._id);
    } else if (orderBy === "name") {
      const nameA = a.categories[0]?.categoryName || "";
      const nameB = b.categories[0]?.categoryName || "";
      return order === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    } else if (orderBy === "type") {
      const typeA = a.categories[0]?.categoryType || "";
      const typeB = b.categories[0]?.categoryType || "";
      return order === "asc"
        ? typeA.localeCompare(typeB)
        : typeB.localeCompare(typeA);
    } else {
      return 0; // no sorting if orderBy is invalid
    }
  });

  return (
    <div className="pr-5">
      <Card
        variant="outlined"
        className="w-full shadow-lg p-4 m-5 rounded-2xl bg-blue-50"
      >
        <CardContent>
          <div className="flex items-center justify-between pb-3 border-b border-gray-300">
            <h4 className="text-3xl font-extrabold text-gray-900 tracking-wide">
              Enquiry
            </h4>
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

            <div className="flex flex-wrap justify-between items-center mt-4 gap-3">
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
                      Product Name
                    </TableSortLabel>
                  </TableCell>

                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedProducts
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((collection) => (
                    <TableRow key={collection._id}>
                      <TableCell>{collection?._id}</TableCell>

                      <TableCell>{collection?.productName}</TableCell>

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

export default ListProduct;
