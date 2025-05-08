import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CancellationList = () => {
  const [cancellations, setCancellations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterBookingId, setFilterBookingId] = useState('');

  useEffect(() => {
    fetchAllCancellations();
  }, []);

  const fetchAllCancellations = () => {
    setLoading(true);
    axios.get('http://localhost:8081/api/cancel/getall')
      .then((response) => {
        setCancellations(response.data);
        setLoading(false);
        setError('');
      })
      .catch((error) => {
        setError('Failed to fetch cancellations');
        setLoading(false);
      });
  };

  const fetchCancellationByBookingId = (id) => {
    if (id.trim() === '') {
      fetchAllCancellations();
      return;
    }
    setLoading(true);
    axios.get(`http://localhost:8081/api/cancel/${id}`)
      .then((response) => {
        setCancellations([response.data]);
        setLoading(false);
        setError('');
      })
      .catch((error) => {
        setError(`No cancellation found for Booking ID: ${id}`);
        setCancellations([]);
        setLoading(false);
      });
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilterBookingId(value);
    fetchCancellationByBookingId(value);
  };

  return (
    <div className="container-fluid py-5" style={{ minHeight: '100vh', background: 'linear-gradient(to right, #f7e4e4, #f9f6f1)' }}>
      <div className="container">
        <h2 className="text-center mb-4 fw-bold text-danger shadow-sm border-bottom pb-2">
           Cancellation List
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
          <p className="text-center text-secondary">Loading cancellations...</p>
        ) : error ? (
          <p className="text-danger text-center">{error}</p>
        ) : cancellations.length === 0 ? (
          <p className="text-center">No cancellations found.</p>
        ) : (
          <div className="card shadow">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-striped table-hover table-bordered text-center mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>Cancellation ID</th>
                      <th>Booking ID</th>
                      <th>Customer ID</th>
                      <th>Reason</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                        {cancellations.map((cancellation) => (
                            <tr key={cancellation.cancellationId}>
                            <td>{cancellation.cancellationId}</td>
                            <td>{cancellation.booking.id}</td>
                            <td>{cancellation.booking.customer.id}</td>
                            <td>{cancellation.reason}</td>
                            <td>{new Date(cancellation.cancelledDate).toLocaleDateString()}</td>
                            
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

export default CancellationList;
