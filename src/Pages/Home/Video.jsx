import React, { useEffect, useState } from "react";
import { Card, CardContent, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toast } from "sonner";
import { ADD_VIDEO, BACKEND_URL, GET_VIDEO } from "../../Sevices/UrlService";
import { ApiService } from "../../Sevices/ApiService";

const Video = () => {
  const [videoUrl, setVideoUrl] = useState(null);

  console.log("<<<<<videoUrl", videoUrl);

  const toAbs = (u) => {
    if (!u) return "";
    if (
      u.startsWith("http://") ||
      u.startsWith("https://") ||
      u.startsWith("blob:") ||
      u.startsWith("data:")
    )
      return u;
    const base = BACKEND_URL || ""; // e.g. "http://localhost:8008"
    const needsSlash = !(base.endsWith("/") || u.startsWith("/"));
    return `${base}${needsSlash ? "/" : ""}${u.replace(/^\/+/, "")}`;
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // local preview
    const previewUrl = URL.createObjectURL(file);
    setVideoUrl(previewUrl);

    // upload to server
    const fd = new FormData();
    fd.append("mainvideo", file);

    try {
      const res = await ApiService.postFileService(ADD_VIDEO, fd);
      toast.success("Video uploaded successfully!");
      GetAllData();
      console.log("Upload response:", res);
    } catch (err) {
      toast.error("Failed to upload video!");
      console.error("Upload error:", err);
    }
  };

  const GetAllData = async () => {
    try {
      const result = await ApiService.getDataService(GET_VIDEO);

      console.log("<<<result", result);

      const video = result?.VideoData?.[0]?.videoUrl || null;
      console.log("<<<<VIDEO", video);
      if (video) {
        setVideoUrl(video);
        console.log("Video URL set:", video);
      }
    } catch (error) {
      console.error("Error adding collection:", error);
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
            Uploaded Video
          </h2>

          <div className="flex justify-center mb-6">
            {videoUrl ? (
              <video
                src={`${BACKEND_URL}${videoUrl}`}
                controls
                className="rounded-lg shadow-lg w-full max-h-[500px] object-cover"
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-gray-400">
                No video uploaded yet
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              className="!bg-blue-600 hover:!bg-blue-700 !text-white !font-semibold !px-5 !py-2 !rounded-lg transition"
            >
              Upload Video
              <input
                type="file"
                accept="video/*"
                name="mainvideo"
                hidden
                onChange={handleVideoUpload}
              />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Video;
