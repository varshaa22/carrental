import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RentalHistory = () => {
  const [rentalHistories, setRentalHistories] = useState([]);
  const [newHistory, setNewHistory] = useState({
    rental: { rentalId: '' },
    customer: { customerId: '', user: { userId: '' } },
    completedDate: ''
  });

  useEffect(() => {
    fetchHistories();
  }, []);

  const fetchHistories = async () => {
    try {
      const res = await axios.get('http://localhost:8081/api/history/getall');
      setRentalHistories(res.data);
    } catch (err) {
      console.error('Error fetching rental history', err);
    }
  };

  const handleAdd = async () => {
    try {
      const payload = {
        rental: { rentalId: Number(newHistory.rental.rentalId) },
        customer: {
          customerId: Number(newHistory.customer.customerId),
          user: { userId: Number(newHistory.customer.user.userId) }
        },
        completedDate: newHistory.completedDate
      };

      console.log('Sending payload:', payload);
      await axios.post('http://localhost:8081/api/history/add', payload);
      fetchHistories();
      setNewHistory({
        rental: { rentalId: '' },
        customer: { customerId: '', user: { userId: '' } },
        completedDate: ''
      });
    } catch (err) {
      console.error('Error adding rental history', err);
      if (err.response) {
        alert('Error: ' + (err.response.data.detail || 'Check your input!'));
        console.log('Response data:', err.response.data);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/api/history/${id}`);
      fetchHistories();
    } catch (err) {
      console.error('Error deleting rental history', err);
    }
  };

  return (
    <div className="container py-4 bg-dark text-white rounded">
      <h2 className="text-center mb-4 text-info">Rental History</h2>

      <div className="card bg-secondary text-white p-3 shadow mb-4">
        <div className="row g-3">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control bg-dark text-white border-info"
              placeholder="Rental ID"
              value={newHistory.rental.rentalId}
              onChange={e =>
                setNewHistory({ ...newHistory, rental: { rentalId: e.target.value } })
              }
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control bg-dark text-white border-info"
              placeholder="Customer ID"
              value={newHistory.customer.customerId}
              onChange={e =>
                setNewHistory({
                  ...newHistory,
                  customer: { ...newHistory.customer, customerId: e.target.value }
                })
              }
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control bg-dark text-white border-info"
              placeholder="User ID"
              value={newHistory.customer.user.userId}
              onChange={e =>
                setNewHistory({
                  ...newHistory,
                  customer: {
                    ...newHistory.customer,
                    user: { userId: e.target.value }
                  }
                })
              }
            />
          </div>
          <div className="col-md-2">
            <input
              type="date"
              className="form-control bg-dark text-white border-info"
              value={newHistory.completedDate}
              onChange={e =>
                setNewHistory({ ...newHistory, completedDate: e.target.value })
              }
            />
          </div>
          <div className="col-md-1 d-grid">
            <button className="btn btn-success" onClick={handleAdd}>
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-dark table-bordered table-hover align-middle">
          <thead className="table-info text-center">
            <tr>
              <th>ID</th>
              <th>Rental ID</th>
              <th>Customer ID</th>
              <th>Completed Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rentalHistories.map((history, idx) => (
              <tr key={history.rentalId || idx}>
                <td className="text-center">{history.rentalId}</td>
                <td className="text-center">{history.rental?.rentalId}</td>
                <td className="text-center">{history.customer?.id}</td>
                <td className="text-center">{history.completedDate}</td>
                <td className="text-center">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(history.rentalId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {rentalHistories.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No rental history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RentalHistory;
