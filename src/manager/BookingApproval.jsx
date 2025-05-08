import { useEffect, useState } from "react";
import axios from "axios";

function BookingApproval() {
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(8);
  const [totalPages, setTotalPages] = useState(0);

  const getAllBookings = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/book/getAll");
      setBookings(response.data.list || response.data);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllBookings();
  }, [page]);

  const handleApprove = async (bookingId) => {
    try {
      await axios.put(`http://localhost:8081/api/book/updatestatus/${bookingId}/CONFIRMED`);
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    } catch (err) {
      console.log(err);
    }
  };

  const handleReject = async (bookingId) => {
    try {
      await axios.put(`http://localhost:8081/api/book/updatestatus/${bookingId}/CANCELLED`);
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    } catch (err) {
      console.log(err);
    }
  };

  const pendingBookings = bookings.filter((b) => b.status === "PENDING");
  const paginated = pendingBookings.slice(page * size, (page + 1) * size);
  const totalPendingPages = Math.ceil(pendingBookings.length / size);

  return (
    <div style={{ minHeight: "100vh" }}>
      <nav className="navbar navbar-expand-lg mb-4 p-3" style={{ backgroundColor: "#1C2631" }}>
        <div className="container">
          <a href="#" className="navbar-brand">
            <h3 className="text-white">CarRent</h3>
          </a>
        </div>
      </nav>

      <div className="container">
        <h1 className="fw-bold text-center p-4 text-black" style={{ fontSize: "1.8rem" }}>
          Booking Approvals
        </h1>

        <div className="row">
          {paginated.length === 0 ? (
            <div className="col-12 text-center">No pending bookings.</div>
          ) : (
            paginated.map((b, index) => (
              <div className="col-md-3 mb-4" key={index}>
                <div className="card text-center p-3 shadow-lg">
                  <h6 className="fw-bold">{b.customer?.name || "N/A"} - {b.car?.model || "N/A"}</h6>
                  <p className="fw-light">Booking: {b.bookingDate} to {b.returnDate}</p>
                  <p className="fw-light">Drive Mode: {b.driveMode}</p>
                  <p className="fw-light">Price/Day: ₹{b.pricePerDay}</p>
                  <p className="fw-light">Total: ₹{b.totalCost}</p>
                  <p className="fw-light">Initial Fee: ₹{b.initialFee}</p>
                  <div className="d-flex gap-2 align-items-center justify-content-center">
                    <button
                      className="btn text-white"
                      style={{ backgroundColor: "#00B86B" }}
                      onClick={() => handleApprove(b.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleReject(b.id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}

export default BookingApproval;