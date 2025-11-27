// apiService.js

export const ApiService = {
  // POST request
  postDataService: async (url, data) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ Added for cookies/auth
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("POST API Error:", error);
      throw error;
    }
  },

  postFileService: async (url, formData) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        credentials: "include", // ✅ Added
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("POST File API Error:", error);
      throw error;
    }
  },

  putFileService: async (url, formData) => {
    try {
      const response = await fetch(url, {
        method: "PUT",
        credentials: "include", // ✅ Added
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("PUT File API Error:", error);
      throw error;
    }
  },

  // GET request
  getDataService: async (url) => {
    try {
      const response = await fetch(url, {
        credentials: "include", // ✅ Added
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("GET API Error:", error);
      throw error;
    }
  },

  getDataServiceById: async (endpoint, id) => {
    try {
      const url = `${endpoint}/${id}`;

      const response = await fetch(url, {
        credentials: "include", // ✅ Added
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("GET BY ID API Error:", error);
      throw error;
    }
  },

  // PUT request
  putDataService: async (url, data) => {
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ Added
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("PUT API Error:", error);
      throw error;
    }
  },

  putDataServiceById: async (endpoint, id, data) => {
    try {
      const url = `${endpoint}/${id}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ Added
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("PUT BY ID API Error:", error);
      throw error;
    }
  },

  // DELETE request
  deleteDataService: async (url) => {
    try {
      const response = await fetch(url, {
        method: "DELETE",
        credentials: "include", // ✅ Added
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("DELETE API Error:", error);
      throw error;
    }
  },

  deleteDataServiceById: async (endpoint, id) => {
    try {
      console.log("<<<id", id);
      const url = `${endpoint}/${id}`;
      const response = await fetch(url, {
        method: "DELETE",
        credentials: "include", // ✅ Added
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("DELETE API Error:", error);
      throw error;
    }
  },
};