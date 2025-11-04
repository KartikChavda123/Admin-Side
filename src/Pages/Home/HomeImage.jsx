import React, { useEffect, useState } from "react";
import { Card, CardContent, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toast } from "sonner";
import {
  ADD_IMAGE_HOME,
  BACKEND_URL,
  GET_IMAGE_HOME,
} from "../../Sevices/UrlService";
import { ApiService } from "../../Sevices/ApiService";

const HomeImage = () => {
  const [homeimageUrl, sethomeimageUrl] = useState(null);

  console.log("<<<<<homeimageUrl", homeimageUrl);

  const toAbs = (u) => {
    if (!u) return "";
    if (/^(https?:|blob:|data:)/.test(u)) return u;

    // Clean trailing and leading slashes
    const base = (BACKEND_URL || "").replace(/\/$/, "");
    const path = u.replace(/^\/+/, "");
      
    // ✅ Always insert one single slash
    return `${base}/${path}`;
  };

  console.log("Resolved URL →", toAbs(homeimageUrl));

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 🖼️ Local preview
    const previewUrl = URL.createObjectURL(file);
    sethomeimageUrl(previewUrl);

    // 📤 Upload to server
    const fd = new FormData();
    fd.append("homeimageUrl", file);

    try {
      const res = await ApiService.postFileService(ADD_IMAGE_HOME, fd);
      toast.success("Image uploaded successfully!");
      GetAllData();
    } catch (err) {
      toast.error("Failed to upload image!");
      console.error("Upload error:", err);
    }
  };

  const GetAllData = async () => {
    try {
      const result = await ApiService.getDataService(GET_IMAGE_HOME);
      console.log("<<<result", result);

      const image = result?.ImgData?.[0]?.ImageUrl || null;
      console.log("<<<<IMAGE", image);
      if (image) {
        sethomeimageUrl(image);
        console.log("Image URL set:", image);
      }
    } catch (error) {
      console.error("Error fetching image data:", error);
    }
  };

  useEffect(() => {
    GetAllData();
  }, []);

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-4xl shadow-xl rounded-2xl">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-center mb-6">
            Uploaded Image
          </h2>

          {/* Image Preview */}
          <div className="flex justify-center mb-6">
            {homeimageUrl ? (
              <img
                src={toAbs(homeimageUrl)}
                alt="Uploaded Preview"
                className="rounded-lg shadow-lg w-full max-h-[500px] object-contain border border-gray-200"
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-gray-400">
                No image uploaded yet
              </div>
            )}
          </div>

          {/* Upload Button */}
          <div className="flex justify-center">
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              className="!bg-blue-600 hover:!bg-blue-700 !text-white !font-semibold !px-5 !py-2 !rounded-lg transition"
            >
              Upload Image
              <input
                type="file"
                accept="image/*"
                name="homeimageUrl"
                hidden
                onChange={handleImageUpload}
              />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomeImage;
