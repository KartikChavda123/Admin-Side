import React, { useEffect, useMemo, useState } from "react";
import {Card, CardContent, TextField, Button, FormControl, InputLabel, Select, MenuItem,} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageIcon from "@mui/icons-material/Image";
// at top with other imports
import CloseIcon from "@mui/icons-material/Close";
import Autocomplete from "@mui/material/Autocomplete";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ApiService } from "../../Sevices/ApiService";
import {  ADD_PRODUCT_API,  GET_CATEGORY_API,  GET_PRODUCT_API,} from "../../Sevices/UrlService";
import ThreeSixtyIcon from "@mui/icons-material/ThreeSixty";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
// at top (add this import)
import SaveIcon from "@mui/icons-material/Save";



const AddProduct = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    productName: "",
    images: [],
    parentImage: null,
    description: "",
    chemicals: [],
    typeNames: [],
    relatedProducts: [],
    industrialApplications: [],
  });

  const previews = useMemo(
    () => form.images.map((f) => URL.createObjectURL(f)),
    [form.images]
  );

  const handleAddProduct = async () => {
    try {
      const fd = new FormData();

      // 🔹 Basic text fields
      fd.append("productName", form.productName.trim());
      fd.append("description", form.description || "");

      if (form.parentImage) {
        fd.append("parentImage", form.parentImage);
      }

      // 🔹 File uploads
      form.images.forEach((file) => {
        fd.append("images", file);
      });

      // 🔹 Multiple arrays — stringify or append individually
      fd.append("chemicals", JSON.stringify(form.chemicals || []));
      fd.append("typeNames", JSON.stringify(form.typeNames || []));
      fd.append(
        "industrialApplications",
        JSON.stringify(form.industrialApplications || [])
      );

      fd.append("relatedProducts", JSON.stringify(form.relatedProducts || []));

      // 🧩 Debug — check what’s actually going into FormData
      console.group("🧾 AddProduct FormData Preview");
      for (const [key, value] of fd.entries()) {
        console.log(
          `${key}:`,
          value instanceof File ? `${value.name} (File)` : value
        );
      }
      console.groupEnd();

      const result = await ApiService.postFileService(ADD_PRODUCT_API, fd);
      console.log("<< AddProduct result", result);
      toast.success("Added Successfully Product!");
      navigate("/listproduct");
    } catch (error) {
      toast.error("Failed to Add Product!");
      console.error("❌ Error adding product:", error);
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    setForm((p) => ({ ...p, images: files }));
  };

  const handleParentImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((p) => ({ ...p, parentImage: file }));
    }
  };
  
  const parentPreview = useMemo(
    () => (form.parentImage ? URL.createObjectURL(form.parentImage) : null),
    [form.parentImage]
  );

  const removeImageAt = (idx) => {
    setForm((p) => ({
      ...p,
      images: p.images.filter((_, i) => i !== idx),
    }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value })); // updates form.category
  };

  const [allProducts, setAllProducts] = useState([]);

  const GetAllDataProduct = async () => {
    try {
      const result = await ApiService.getDataService(GET_PRODUCT_API);
      setAllProducts(result.Products);
      console.log("<<<result", result);

      console.log("Collection Added:", result);
    } catch (error) {
      console.error("Error adding collection:", error);
    }
  };

  useEffect(() => {
    GetAllDataProduct();
  }, []);

  return (
    <div className="pr-5">
      <Card
        variant="outlined"
        className="w-full shadow-lg p-4 m-5 rounded-2xl bg-gray-500 "
      >
        <CardContent>
          <h4 className="text-Jost text-xl font-bold mb-4 text-gray-800">
            Add Product
          </h4>

          <div className="flex flex-col gap-6">
            {/* Product Name */}
            <TextField
              label="Product Name"
              name="productName"
              variant="outlined"
              value={form.productName}
              onChange={handleChange}
              className="flex-1 bg-white rounded-md"
              sx={{
                "& .MuiInputBase-root": {
                  backgroundColor: "white",
                  borderRadius: "10px",
                },
              }}
            />

            <Autocomplete
              multiple
              freeSolo
              options={[]} // admin can type freely
              value={form.typeNames || []}
              onChange={(event, newValue) =>
                setForm({ ...form, typeNames: newValue })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Add Product Types"
                  sx={{
                    "& .MuiInputBase-root": {
                      backgroundColor: "white",
                      borderRadius: "10px",
                    },
                  }}
                  fullWidth
                />
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card
        variant="outlined"
        className="w-full shadow-lg p-4 m-5 rounded-2xl bg-gray-100"
      >
        <CardContent>
          <h4 className="text-Jost text-l font-bold mb-4 text-gray-800">
            Add Description
          </h4>

          <TextField
            label="Description"
            name="description"
            multiline
            rows={4}
            value={form.description}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            className="bg-white rounded-lg"
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: "white",
                borderRadius: "10px",
              },
            }}
          />
        </CardContent>
      </Card>

      <Card
        variant="outlined"
        className="w-full shadow-lg p-4 m-5 rounded-2xl bg-gray-500"
      >
        <CardContent>
          <h4 className="text-Jost text-xl font-bold mb-4 text-gray-800">
            Main Product Image (Parent Image)
          </h4>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Preview */}
            {parentPreview ? (
              <div className="relative w-40 h-40 rounded-lg overflow-hidden border bg-white shadow">
                <img
                  src={parentPreview}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-24 h-24 grid place-items-center rounded-lg border bg-white text-slate-400">
                <ImageIcon />
              </div>
            )}

            {/* Upload Button */}
          </div>
          <label className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer shadow-sm">
            <CloudUploadIcon className="!w-5 !h-5" />
            <span>Upload Main Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleParentImageChange}
              hidden
            />
          </label>

        </CardContent>
      </Card>

      <Card
        variant="outlined"
        className="w-full shadow-lg p-4 m-5 rounded-2xl bg-gray-500 "
      >
        <CardContent>
          <h4 className="text-Jost text-l font-bold mb-4 text-gray-800">
            Color Images
          </h4>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="mt-6">
              <h5 className="text-sm font-semibold text-slate-700 mb-2">
                Product Images
              </h5>

              <div className="flex flex-col sm:flex-row items-start gap-5 border-2 border-dashed border-slate-300 rounded-xl p-4 bg-gradient-to-br from-slate-50 to-white ring-1 ring-slate-200 hover:border-blue-400 hover:ring-blue-200 shadow-sm transition">
                {/* Previews (no main image features) */}
                <div className="flex flex-wrap gap-3">
                  {previews.length ? (
                    previews.map((src, idx) => (
                      <div
                        key={idx}
                        className="relative w-40 h-40 rounded-lg overflow-hidden border border-slate-200 bg-white shadow"
                      >
                        <img
                          src={src}
                          alt={`preview-${idx}`}
                          className="w-full h-full object-cover"
                        />

                        {/* Close / remove button */}
                        <button
                          type="button"
                          onClick={() => removeImageAt(idx)}
                          className="absolute top-1 right-1 grid place-items-center rounded-full bg-white/90 hover:bg-white
                               border border-slate-200 shadow-sm p-1 transition focus:outline-none
                               focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-rose-500"
                          aria-label="Remove image"
                          title="Remove image"
                        >
                          <CloseIcon className="!w-4 !h-4 text-rose-600" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="w-24 h-24 grid place-items-center rounded-lg border border-slate-200 bg-white text-slate-400">
                      <ImageIcon />
                    </div>
                  )}
                </div>

                {/* Uploader (unchanged) */}
              </div>

              <label className="inline-flex mt-7 items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer shadow-sm">
                <CloudUploadIcon className="!w-5 !h-5" />
                <span>Upload Images</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                  hidden
                />
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card
        variant="outlined"
        className="w-full shadow-lg p-6 m-5 rounded-2xl bg-gray-100 space-y-6"
      >
        <div className="flex flex-col gap-6">
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={form.chemicals}
            onChange={(event, newValue) =>
              setForm({ ...form, chemicals: newValue })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Add Chemicals"
                sx={{
                  "& .MuiInputBase-root": {
                    backgroundColor: "white",
                    borderRadius: "10px",
                  },
                }}
                fullWidth
              />
            )}
          />

          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={form.industrialApplications}
            onChange={(event, newValue) =>
              setForm({ ...form, industrialApplications: newValue })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Add Industrial Applications"
                sx={{
                  "& .MuiInputBase-root": {
                    backgroundColor: "white",
                    borderRadius: "10px",
                  },
                }}
                fullWidth
              />
            )}
          />
        </div>
      </Card>

      <Card
        variant="outlined"
        className="w-full shadow-lg p-4 m-5 rounded-2xl bg-gray-500"
      >
        <CardContent>
          <Autocomplete
            multiple
            options={allProducts}
            getOptionLabel={(option) => option.productName}
            onChange={(event, value) => {
              setForm({
                ...form,
                relatedProducts: value.map((v) => v._id), // ✅ store only IDs
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Related Products"
                placeholder="Select related products"
              />
            )}
            className="w-full bg-white rounded-xl shadow-sm my-4"
          />

          {/* Right aligned button */}
          <div className="w-full flex justify-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddProduct}
              startIcon={<SaveIcon />}
              aria-label="Save product"
              className="!bg-blue-600 hover:!bg-blue-700 !text-white !font-semibold
                   !rounded-lg !px-6 !py-2.5
                   shadow-md hover:shadow-lg
                   focus:!ring-2 focus:!ring-blue-500 focus:!ring-offset-2
                   active:!translate-y-px transition"
            >
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProduct;
