import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CancellationForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const bookingId = location.state?.bookingId || '';
  const today = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD

  const [cancellationData, setCancellationData] = useState({
    booking: bookingId,
    reason: '',
    cancelledDate: today, // these keep track booking id,reason and date
  });

  useEffect(() => {
    if (bookingId) {
      setCancellationData((prev) => ({
        ...prev,
        booking: bookingId,//takes the previous state copy all the property and update booking id with new one
      }));
    }
  }, [bookingId]);

  const handleChange = (e) => {
    const { name, value } = e.target;//specific input element user interact with
    setCancellationData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:8081/api/cancel/add/${bookingId}`,
        {
          reason: cancellationData.reason, // this is the body
        }
      );
      alert('Booking Cancelled Sucessfully');
      const toastEl = document.getElementById('cancelToast');
      const toast = new window.bootstrap.Toast(toastEl);
      toast.show();
      navigate('/my-bookings');
    } catch (error) {
      console.error('Cancellation failed:', error);
      alert('Failed to cancel booking. Please try again.');
    }
  };
  return (
    <div
      className="container-fluid d-flex align-items-center justify-content-center"
      style={{
        minHeight: '100vh',
        backgroundImage: 'url("/cancelbg.avif")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="card shadow-lg" style={{ maxWidth: '700px', width: '100%', opacity: 0.95 }}>
        <div className="card-header bg-secondary text-white p-3">
          <h4 className="m-0 text-center">CANCELLATION MANAGEMENT</h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-bold">Booking ID</label>
                <input
                  type="text"
                  className="form-control"
                  name="booking"
                  value={cancellationData.booking}
                  readOnly
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Cancelled Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="cancelledDate"
                  value={cancellationData.cancelledDate}
                  readOnly
                />
              </div>
              <div className="col-12 d-flex flex-column align-items-center">
                <label className="form-label fw-bold text-center w-100">Reason</label>
                <input
                  type="text"
                  className="form-control text-center"
                  name="reason"
                  value={cancellationData.reason}
                  onChange={handleChange}
                  placeholder="Enter Reason"
                  style={{ maxWidth: '70%' }}
                  required
                />
              </div>
              <div className="col-12 text-center mt-3">
                <button type="submit" className="btn btn-danger px-4">
                  Submit Cancellation
                </button>
              </div>
            </div>
          </form>
          <div
  
            className="toast-container position-fixed top-0 end-0 p-3"
            style={{ zIndex: 1055 }}
          >
            <div
              className="toast align-items-center text-white bg-success border-0"
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
              id="cancelToast"
            >
              <div className="d-flex">
                <div className="toast-body">
                  Booking cancelled successfully.
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white me-2 m-auto"
                  data-bs-dismiss="toast"
                  aria-label="Close"
                ></button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancellationForm;