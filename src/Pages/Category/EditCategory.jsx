import React, { useEffect, useState } from "react";
import { Button, Card, CardContent, TextField } from "@mui/material";
import { ApiService } from "../../Sevices/ApiService";
import { useNavigate, useParams } from "react-router-dom";
import {
  EDIT_CATEGORY_API,
  GET_CATEGORY_BY_ID_API,
} from "../../Sevices/UrlService";
import { toast } from "sonner";



const EditCategory = () => {
  const { id } = useParams();

  const [category, setCategory] = useState("");

  const navigate = useNavigate();
  console.log("<<<randomFace", category);
  const handleGetData = async () => {
    try {
      const result = await ApiService.getDataServiceById(
        GET_CATEGORY_BY_ID_API,
        id
      );
      setCategory(result?.category || "");
    } catch (error) {
      console.error("Error adding collection:", error);
    }
  };

  useEffect(() => {
    handleGetData();
  }, []);

  const handleUpdateData = async () => {
    try {
      const result = await ApiService.putDataServiceById(
        EDIT_CATEGORY_API,
        id,
        {
          categoryName: category?.categoryName,
          categorytype: category?.categorytype,
        }
      );

      console.log("<<<<<<result", result);
      navigate("/listcategory");
      toast.success("Edit SuccessFully collection!");
    } catch (error) {
      toast.error("Error collection!");
      console.error("Error adding collection:", error);
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
            Update Category
          </h4>

          <div className="flex flex-col md:flex-row gap-4">
            <TextField
              label="Category Name"
              variant="outlined"
              value={category?.categoryName || ""}
              onChange={(e) =>
                setCategory({ ...category, categoryName: e.target.value })
              }
            />

            <TextField
              label="Category Type"
              variant="outlined"
              value={category?.categorytype || ""}
              onChange={(e) =>
                setCategory({ ...category, categorytype: e.target.value })
              }
            />

            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateData}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              Update
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditCategory;
