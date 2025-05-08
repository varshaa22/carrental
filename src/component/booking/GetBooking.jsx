import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterBookingId, setFilterBookingId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const fetchAllBookings = () => {
    setLoading(true);
    axios.get('http://localhost:8081/api/book/getAll')
      .then((response) => {
        setBookings(response.data);
        setLoading(false);
        setError('');
      })
      .catch((error) => {
        setError('Failed to fetch bookings');
        console.error(error);
        setLoading(false);
      });
  };

  const fetchBookingById = (id) => {
    if (id.trim() === '') {//checks id is empty or just pace  
      fetchAllBookings();
      return;
    }

    setLoading(true);
    axios.get(`http://localhost:8081/api/book/${id}`)
      .then((response) => {
        setBookings([response.data]); // Wrap single object in array
        setLoading(false);
        setError('');
      })
      .catch((error) => {
        setError(`No booking found with ID: ${id}`);
        setBookings([]);
        setLoading(false);
      });
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;//gets the current value from the input box
    setFilterBookingId(value);//update state and stores the filter value
    fetchBookingById(value);//calls the function to fetch the booking that match the entered id
  };

  const handleCancel = (bookingId) => {
    navigate('/cancellation', { state: { bookingId } });
  };

  return (
    <div
      className="container-fluid py-5"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #d7e1ec, #f1f4f9)',
      }}
    >
      <div className="container">
        <h2 className="text-center mb-4 fw-bold text-primary shadow-sm border-bottom pb-2">
          🚗 Car Rental Booking List
        </h2>

        {/* Filter Input */}
        <div className="mb-4 text-end">
          <input
            type="text"
            className="form-control d-inline-block w-auto"
            placeholder="Filter by Booking ID"
            value={filterBookingId}
            onChange={handleFilterChange}
          />
        </div>

        {loading ? (
          <p className="text-center text-secondary">Loading bookings...</p>
        ) : error ? (
          <p className="text-danger text-center">{error}</p>
        ) : bookings.length === 0 ? (
          <p className="text-center">No bookings found.</p>
        ) : (
          <div className="card shadow">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-striped table-hover table-bordered text-center mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>Booking ID</th>
                      <th>Customer ID</th>
                      <th>Car Model</th>
                      <th>Booking Date</th>
                      <th>Return Date</th>
                      <th>Price/Day</th>
                      <th>Total Cost</th>
                      <th>Initial Fee</th>
                      <th>Drive Mode</th>
                      <th>Status</th>
                      <th>Cancel</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>{booking.id}</td>
                        <td>{booking.customer?.id || "N/A"}</td>
                        <td>{booking.car?.model || "N/A"}</td>
                        <td>{booking.bookingDate}</td>
                        <td>{booking.returnDate}</td>
                        <td>₹{booking.pricePerDay}</td>
                        <td>₹{booking.totalCost}</td>
                        <td>₹{booking.initialFee}</td>
                        <td>{booking.driveMode}</td>
                        <td>
                          <span className={`badge rounded-pill px-3 py-2 ${
                            booking.status?.toLowerCase() === 'cancelled' ? 'bg-danger' :
                            booking.status?.toLowerCase() === 'pending' ? 'bg-primary' :
                            booking.status?.toLowerCase() === 'confirmed' ? 'bg-success' :
                            'bg-secondary'
                          }`}>
                            {booking.status || 'Unknown'}
                          </span>
                        </td>
                        <td>
                          {booking.status !== 'Cancelled' ? (
                            <button
                              className="btn btn-outline-danger btn-sm rounded-pill px-3"
                              onClick={() => handleCancel(booking.id)}
                            >
                              Cancel
                            </button>
                          ) : (
                            <span className="badge rounded-pill bg-danger px-3 py-2">Cancelled</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingList;
