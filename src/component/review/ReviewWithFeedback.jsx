import React, { useState } from 'react';
import axios from 'axios';

const ReviewFeedbackForm = () => {
  const [form, setForm] = useState({
    rentalId: '',
    carId: '',
    customerId: '',
    review: '',
    rating: ''
  });
  const [message, setMessage] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    
    const payload = {
      review: form.review.trim(),
      rating: Number(form.rating)
    };

    try {
      const response = await axios.post(
        `http://localhost:8081/api/review/add/${form.rentalId}/${form.carId}/${form.customerId}`,
        payload
      );
      setMessage('Review submitted successfully!');
      setForm({
        rentalId: '',
        carId: '',
        customerId: '',
        review: '',
        rating: ''
      });
    } catch (error) {
      setMessage('Failed to submit review. Please check your IDs and try again.');
    }
  };

  //styling
  const backgroundStyle = {
    backgroundImage: "url('/reviewbg.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px"
  };

  return (
    <div style={backgroundStyle}>
      <div className="container">
        <div className="card shadow-lg bg-light bg-opacity-75">
          <div className="card-header bg-primary text-white p-3 mx-auto text-center" style={{ width: 'fit-content', borderRadius: '8px' }}>
            <h3 className="m-0">REVIEW FEEDBACK</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label fw-bold">Rental ID</label>
                  <input
                    type="text"
                    className="form-control"
                    name="rentalId"
                    value={form.rentalId}
                    onChange={handleChange}
                    placeholder="Enter Rental ID"
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Car ID</label>
                  <input
                    type="text"
                    className="form-control"
                    name="carId"
                    value={form.carId}
                    onChange={handleChange}
                    placeholder="Enter Car ID"
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Customer ID</label>
                  <input
                    type="text"
                    className="form-control"
                    name="customerId"
                    value={form.customerId}
                    onChange={handleChange}
                    placeholder="Enter Customer ID"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Rating (1-5)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="rating"
                    value={form.rating}
                    onChange={handleChange}
                    min="1"
                    max="5"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Review</label>
                  <textarea
                    className="form-control"
                    name="review"
                    rows="3"
                    value={form.review}
                    onChange={handleChange}
                    placeholder="Write your feedback here..."
                    required
                  />
                </div>
                <div className="col-12 mt-4 text-center">
                  <button type="submit" className="btn btn-success btn-sm">
                    Submit Review
                  </button>
                </div>
              </div>
            </form>
            {message && (
              <div className="alert alert-info mt-4 text-center">{message}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewFeedbackForm;
