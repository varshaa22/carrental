import axios from "axios";
import { useState } from "react";

function BecomeARenter() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [driversLicenseNumber, setDriversLicenseNumber] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [identityDocument, setIdentityDocument] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents page from reloading on form submit

    if (!fullName || !email || !phoneNumber || !address || !driversLicenseNumber) {
      setMessage("Please fill in all fields.");
      return;
    }

    const userId = localStorage.getItem("userId"); // Get userId from localStorage

    if (!userId) {
      setMessage("User ID not found. Please log in first.");
      return;
    }

    try {
      const customerData = {
        fullName,
        email,
        phoneNumber,
        address,
        driversLicenseNumber,
        user: { userId: userId } // Create an object with userId inside `user` to match backend's expected format
      };

      const response = await axios.post(`http://localhost:8081/api/customer/add/${userId}`, customerData);
      const customerId = response.data.id;

      // Upload files if they exist
      if (profilePhoto) {
        await uploadFile(customerId, profilePhoto, "upload");
      }

      if (identityDocument) {
        await uploadFile(customerId, identityDocument, "identity/upload");
      }

      setMessage("Renter registered successfully!");
    } catch (err) {
      console.error("Error during form submission:", err);
      setMessage("An error occurred while submitting the form.");
    }
  };

  const uploadFile = async (cid, file, endpoint) => {
    const formData = new FormData(); // Create a form object to send file
    formData.append("file", file); // Append the file with key 'file'
    console.log("Uploading file to:", endpoint); // Debug log
    try {
      const response = await axios.post(`http://localhost:8081/api/customer/upload/${endpoint}/${cid}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("File uploaded successfully:", response); // Debug log
    } catch (err) {
      console.error(`Failed to upload file to ${endpoint}:`, err);
      setMessage("File upload failed.");
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <h2 className="text-center mb-4">Become a Renter</h2>
      {message && <div className="alert alert-info text-center">{message}</div>}
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Driver's License Number"
            value={driversLicenseNumber}
            onChange={(e) => setDriversLicenseNumber(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Upload Profile Photo</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setProfilePhoto(e.target.files[0])}
          />
          {/* Preview Profile Photo */}
          {profilePhoto && (
            <div className="mt-3">
              <h5>Profile Photo Preview:</h5>
              <img
                src={URL.createObjectURL(profilePhoto)}
                alt="Profile Preview"
                style={{ maxWidth: "100px", maxHeight: "100px" }}
              />
            </div>
          )}
        </div>
        <div className="col-md-6">
          <label className="form-label">Upload Identity Document</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setIdentityDocument(e.target.files[0])}
          />
          {/* Preview Identity Document */}
          {identityDocument && (
            <div className="mt-3">
              <h5>Identity Document Preview:</h5>
              <img
                src={URL.createObjectURL(identityDocument)}
                alt="Identity Document Preview"
                style={{ maxWidth: "100px", maxHeight: "100px" }}
              />
            </div>
          )}
        </div>
        <div className="col-12 text-center">
          <button type="submit" className="btn btn-primary px-5 py-2">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default BecomeARenter;
