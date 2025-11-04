import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { ApiService } from "../../Sevices/ApiService";
import { ADD_CATEGORY_API } from "../../Sevices/UrlService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
const AddCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categorytype, setCategoryType] = useState("");

  const navigate = useNavigate();

  const handleAddCategory = async () => {
    try {
      const data = { categoryName, categorytype };

      const result = await ApiService.postDataService(ADD_CATEGORY_API, data);

      console.log("Category Added:", result);
      toast.success("Added SuccessFully Category!");

      navigate("/listcategory");
    } catch (error) {
      toast.error("Failed to fetch Category!");
      console.error("Error adding Category:", error);
    }
  };

  return (
    <div className="pr-5">
      <Card
        variant="outlined"
        className="w-full shadow-lg p-4 m-5 rounded-2xl bg-gray-500 "
      >
        <CardContent>
          <h4 className="text-2xl font-bold mb-4 text-gray-800">
            Add Categories
          </h4>

          <div className="flex flex-col md:flex-row gap-4">
            <TextField
              label="Application Name"
              variant="outlined"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="flex-1 bg-white rounded-md"
            />

            <TextField
              label="Application Type"
              variant="outlined"
              value={categorytype}
              onChange={(e) => setCategoryType(e.target.value)}
              className="flex-1 bg-white rounded-md"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddCategory}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              Add
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCategory;
