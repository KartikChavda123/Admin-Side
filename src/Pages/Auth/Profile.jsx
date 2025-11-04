import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  GET_USER_PROFILE_API,
  UPDATE_PROFILE_API,
} from "../../Sevices/UrlService";
import { ApiService } from "../../Sevices/ApiService";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "sonner";
const Profile = () => {
  const [admin, setAdmin] = useState({
    name: "",
    number: "",
    email: "",
    password: "",
    photoUrl: "",
    role: "",
    forgotPassword: "", // temporary for reset only
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    const data = JSON.parse(user);
    handleGetData(data?._id);
  }, []);

  const handleGetData = async (userId) => {
    try {
      const result = await ApiService.getDataServiceById(
        GET_USER_PROFILE_API,
        userId
      );
      setAdmin({
        ...result.user,
        forgotPassword: "", // reset temp field
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleUpdateData = async () => {
    try {
      const payload = {
        name: admin.name,
        number: admin.number,
        email: admin.email,
        photoUrl: admin.photoUrl,
      };

      // Only include password if forgotPassword field is filled
      if (admin.forgotPassword) {
        payload.password = admin.forgotPassword;
      }

      console.log("<<<<payload", payload);

      const result = await ApiService.putDataServiceById(
        UPDATE_PROFILE_API,
        admin._id,
        payload
      );

      console.log("<<<result", result);

      toast.success("Profile updated successfully!");
      // Update state: reset forgotPassword and update password
      setAdmin((prev) => ({
        ...prev,
        password: prev.forgotPassword || prev.password,
        forgotPassword: "",
      }));

      // Optionally update localStorage
      localStorage.setItem("user", JSON.stringify({ ...admin, ...payload }));
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile!");
    }
  };

  return (
    <div className="p-5">
      <Card
        variant="outlined"
        className="w-full shadow-2xl p-6 rounded-4xl bg-gray-50"
      >
        <CardContent>
          <h4 className="text-3xl font-bold mb-6 text-gray-800">
            Admin Details
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <TextField
              placeholder="Enter Name"
              name="name"
              value={admin.name}
              onChange={handleChange}
              fullWidth
              className="bg-white rounded-lg"
            />
            <TextField
              placeholder="Enter Number"
              name="number"
              value={admin.number}
              onChange={handleChange}
              fullWidth
              className="bg-white rounded-lg"
            />
            <TextField
              placeholder="Enter Email"
              name="email"
              value={admin.email}
              onChange={handleChange}
              fullWidth
              className="bg-white rounded-lg"
            />

            <TextField
              placeholder="Enter Photo URL"
              name="photoUrl"
              value={admin.photoUrl}
              onChange={handleChange}
              fullWidth
              className="bg-white rounded-lg"
            />

            <TextField
              placeholder="Current Password"
              name="password"
              type={showCurrentPassword ? "text" : "password"}
              value={admin?.password || ""}
              onChange={handleChange}
              fullWidth
              className="bg-white rounded-lg"
              InputProps={{
                readOnly: true, // readonly
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowCurrentPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              placeholder="Enter New Password"
              name="forgotPassword"
              type={showPassword ? "text" : "password"}
              value={admin.forgotPassword || ""}
              onChange={handleChange}
              fullWidth
              className="bg-white rounded-lg"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              placeholder="Role"
              name="role"
              value={admin.role}
              onChange={handleChange}
              fullWidth
              className="bg-white rounded-lg"
              disabled // usually role is fixed
            />
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              variant="contained"
              color="primary"
              className="rounded-xl px-6 py-2 font-semibold shadow-md hover:shadow-lg transition-all"
              onClick={handleUpdateData}
            >
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
