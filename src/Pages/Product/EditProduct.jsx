import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Autocomplete,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";
import ThreeSixtyIcon from "@mui/icons-material/ThreeSixty";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import SaveIcon from "@mui/icons-material/Save";

import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { ApiService } from "../../Sevices/ApiService";
import {
  ADD_PRODUCT_API,
  BACKEND_URL,
  EDIT_PRODUCT_API,
  GET_CATEGORY_API,
  GET_PRODUCT_API,
  GET_PRODUCT_BY_ID_API,
  // UPDATE_PRODUCT_API, // if you have a dedicated endpoint, use this instead of ADD_PRODUCT_API
} from "../../Sevices/UrlService";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    productName: "",
    images: [],
    existingImages: [],
    description: "",
    chemicals: [],
    typeNames: [],
    industrialApplications: [],
    relatedProducts: [], // ✅ store only IDs
    relatedProductObjects: [], // ✅ store populated objects for UI
  });

  const [allProducts, setAllProducts] = useState([]);

  const [parentImage, setParentImage] = useState(null);
  const [parentPreview, setParentPreview] = useState(null);
  const [existingParentImage, setExistingParentImage] = useState("");

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

  const fileInputRef = useRef(null);

  const toAbs = (u) => {
    if (!u) return "";
    if (u.startsWith("http://") || u.startsWith("https://")) return u;
    // Prefer explicit BACKEND_URL if available, else ApiService.baseURL
    const base = BACKEND_URL || ApiService.baseURL || "";
    return `${base}${u.startsWith("/") ? u : "/" + u}`;
  };

  const handleGetData = async () => {
    try {
      const result = await ApiService.getDataServiceById(
        GET_PRODUCT_BY_ID_API,
        id
      );

      const p =
        result?.Products || result?.data?.Products || result?.data || {};

      setForm((prev) => ({
        ...prev,
        productName: p?.productName || "",
        existingImages: Array.isArray(p?.images) ? p.images : [],
        images: [],
        description: p?.description || "",
        chemicals: Array.isArray(p?.chemicals) ? p.chemicals : [],
        typeNames: Array.isArray(p?.typeNames) ? p.typeNames : [],
        industrialApplications: Array.isArray(p?.industrialApplications)
          ? p.industrialApplications
          : [],

        // ✅ NEW: store related product IDs
        relatedProducts: Array.isArray(p?.relatedProducts)
          ? p.relatedProducts.map((rp) =>
              typeof rp === "object" ? rp._id : rp
            )
          : [],

        // ✅ NEW: store full objects for UI
        relatedProductObjects: Array.isArray(p?.relatedProducts)
          ? p.relatedProducts.filter((rp) => typeof rp === "object")
          : [],
      }));
      setExistingParentImage(p?.parentImage || "");
      setParentPreview(p?.parentImage ? toAbs(p.parentImage) : null);

      toast.success("Loaded product");
    } catch (err) {
      console.error("Get product error:", err);
      toast.error("Failed to load product");
    }
  };

  useEffect(() => {
    handleGetData();

    GetAllDataProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFiles = (filesList) => {
    const files = Array.from(filesList || []);
    if (!files.length) return;
    setForm((prev) => ({
      ...prev,
      images: [...(prev.images || []), ...files],
    }));
  };

  const onPickFiles = () => fileInputRef.current?.click();

  const removeNewImageAt = (idx) => {
    setForm((p) => ({ ...p, images: p.images.filter((_, i) => i !== idx) }));
  };

  const handleParentImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setParentImage(file);
    setParentPreview(URL.createObjectURL(file));
  };

  const removeExistingAt = (idx) => {
    setForm((p) => ({
      ...p,
      existingImages: p.existingImages.filter((_, i) => i !== idx),
    }));
  };

  // ---- previews for new images (Object URLs) ----
  const newPreviews = useMemo(
    () => (form?.images || []).map((f) => URL.createObjectURL(f)),
    [form?.images]
  );

  useEffect(() => {
    // revoke on cleanup to avoid memory leaks
    return () => newPreviews.forEach((u) => URL.revokeObjectURL(u));
  }, [newPreviews]);

  const handleEditProduct = async () => {
    try {
      const fd = new FormData();

      // 🧾 Basic text fields
      fd.append("productName", form.productName.trim());
      fd.append("description", form.description || "");

      // 🖼 Existing images control
      fd.append("existingImages", JSON.stringify(form.existingImages || []));

      // 🧪 Stringify array fields
      fd.append("chemicals", JSON.stringify(form.chemicals || []));
      fd.append("typeNames", JSON.stringify(form.typeNames || []));
      fd.append(
        "industrialApplications",
        JSON.stringify(form.industrialApplications || [])
      );

      // ✅ ✅ IMPORTANT — send relatedProducts IDs
      fd.append("relatedProducts", JSON.stringify(form.relatedProducts || []));
      fd.append("existingParentImage", existingParentImage || "");

      if (parentImage) {
        fd.append("parentImage", parentImage);
      }

      // 📂 Add new image files
      (form.images || []).forEach((file) => fd.append("images", file));

      // 🧩 Debug log — check everything before sending
      console.group("🧾 EditProduct FormData Preview");
      for (const [key, value] of fd.entries()) {
        console.log(
          `${key}:`,
          value instanceof File ? `${value.name} (File)` : value
        );
      }
      console.groupEnd();

      // 🚀 Call API
      const result = await ApiService.putFileService(
        `${EDIT_PRODUCT_API}/${id}`,
        fd
      );

      console.log("<< EditProduct result", result);

      // ✅ Refresh product (so Autocomplete updates)
      handleGetData();

      toast.success("Product updated successfully");

      // navigate("/listproduct"); // optional
    } catch (error) {
      console.error("❌ Error updating product:", error);
      toast.error("Failed to update product");
    }
  };

  useEffect(() => {
    if (allProducts.length > 0 && form.relatedProducts.length > 0) {
      const selectedObjects = allProducts.filter((p) =>
        form.relatedProducts.includes(p._id)
      );

      setForm((prev) => ({
        ...prev,
        relatedProductObjects: selectedObjects,
      }));
    }
  }, [allProducts, form.relatedProducts]);

  return (
    <div className="pr-5">
      <Card
        variant="outlined"
        className="w-full shadow-lg p-4 m-5 rounded-2xl bg-gray-50"
      >
        <CardContent>
          <h4 className="text-2xl font-bold mb-4 text-gray-800">
            Edit Product
          </h4>
          <div className="flex flex-col gap-6">
            <TextField
              label="Product Name"
              name="productName"
              value={form.productName}
              onChange={handleChange}
              className="flex-1 bg-white rounded-md"
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
          <h4 className="text-2xl font-bold mb-4 text-gray-800">
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
          />
        </CardContent>
      </Card>
      <Card
        variant="outlined"
        className="w-full shadow-lg p-4 m-5 rounded-2xl bg-gray-500"
      >
        <CardContent>
          <h4 className="text-xl font-bold mb-4 text-gray-800">
            Main Product Image (Parent Image)
          </h4>

          <div className="flex gap-4 items-center">
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

            <label className="cursor-pointer px-4 py-2 rounded-lg bg-white shadow border">
              <CloudUploadIcon /> Upload Parent Image
              <input
                type="file"
                accept="image/*"
                onChange={handleParentImageChange}
                hidden
              />
            </label>
          </div>
        </CardContent>
      </Card>

      <Card
        variant="outlined"
        className="w-full shadow-lg p-4 m-5 rounded-2xl bg-gray-50"
      >
        <CardContent>
          <h4 className="text-Jost text-l font-bold mb-4 text-gray-800">
            Color Images
          </h4>
          {/* EXISTING (server) images */}
          <div className="flex flex-wrap gap-3 mb-4">
            {(form.existingImages || []).map((src, idx) => (
              <div
                key={`ex-${idx}`}
                className="relative w-40 h-40 rounded-lg overflow-hidden border bg-white shadow"
              >
                <img
                  src={toAbs(src)}
                  alt={`existing-${idx}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeExistingAt(idx)}
                  className="absolute top-1 right-1 rounded-full bg-white/90 border p-1"
                  title="Remove image"
                  aria-label={`Remove existing image ${idx + 1}`}
                >
                  <CloseIcon className="!w-4 !h-4 text-rose-600" />
                </button>
              </div>
            ))}
          </div>

          {/* NEW files picker */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => handleFiles(e.target.files)}
          />

          <div className="flex items-center gap-3">
            <Button
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              onClick={onPickFiles}
              className="!normal-case"
            >
              Add Images
            </Button>
            <span className="text-sm text-gray-600">
              JPG, PNG, WebP – multiple allowed
            </span>
          </div>

          {/* NEW file previews */}
          <div className="flex flex-wrap gap-3 mt-4">
            {(newPreviews || []).length ? (
              newPreviews.map((src, idx) => (
                <div
                  key={`new-${idx}`}
                  className="relative w-40 h-40 rounded-lg overflow-hidden border bg-white shadow"
                >
                  {/* IMPORTANT: use the Object URL directly, no BACKEND_URL prefix */}
                  <img
                    src={src}
                    alt={`new-${idx}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImageAt(idx)}
                    className="absolute top-1 right-1 rounded-full bg-white/90 border p-1"
                    title="Remove image"
                    aria-label={`Remove new image ${idx + 1}`}
                  >
                    <CloseIcon className="!w-4 !h-4 text-rose-600" />
                  </button>
                </div>
              ))
            ) : (
              <div className="w-24 h-24 grid place-items-center rounded-lg border bg-white text-slate-400">
                <ImageIcon />
              </div>
            )}
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
            value={form.relatedProductObjects} // ✅ pre-selected related products
            getOptionLabel={(option) => option.productName}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            onChange={(event, value) => {
              setForm({
                ...form,
                relatedProducts: value.map((v) => v._id), // ✅ save IDs
                relatedProductObjects: value, // ✅ save full objects
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
              onClick={handleEditProduct}
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

export default EditProduct;
