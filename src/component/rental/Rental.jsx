import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookingById } from "../../redux/slices/bookingSlice";
import axios from 'axios';

const LATE_FEE_PER_DAY = 1500;

// Utility to convert dd-MM-yyyy to yyyy-MM-dd
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const [day, month, year] = dateString.split('-');
  return `${year}-${month}-${day}`;
};

const RentalForm = () => {
  const dispatch = useDispatch();
  const { booking } = useSelector((state) => state.booking);

  const [rentalData, setRentalData] = useState({
    car: '',
    customer: '',
    booking: '',
    remainingCost: '',
    startDate: '',
    expectedReturnDate: '',
    actualReturnDate: '',
    lateFee: '',
    status: 'RUNNING'
  });

  // Fetch booking when booking ID changes
  useEffect(() => {
    if (rentalData.booking) {
      dispatch(fetchBookingById(rentalData.booking));
    }
  }, [rentalData.booking, dispatch]);

  // Auto-fill form and calculate remaining cost when booking is fetched
  useEffect(() => {
    if (booking) {
      console.log("Booking Data:", booking);
  
      const totalCost = parseFloat(booking.totalCost || 0);
      const initialFee = parseFloat(booking.initialFee || 0);
      const remainingCost = (totalCost - initialFee).toFixed(2);
  
      setRentalData((prev) => ({
        ...prev,
        car: booking.car?.carId || '',
        customer: booking.customer?.id || '',
        remainingCost,
        startDate: formatDateForInput(booking.bookingDate) || '',
        expectedReturnDate: formatDateForInput(booking.returnDate) || '',
        actualReturnDate: '',
        lateFee: '',
        status: 'RUNNING'
      }));
    }
  }, [booking]);
  

  // Calculate late fee
  useEffect(() => {
    if (
      rentalData.actualReturnDate &&
      rentalData.expectedReturnDate &&
      new Date(rentalData.actualReturnDate) > new Date(rentalData.expectedReturnDate)
    ) {
      const daysLate = Math.ceil(
        (new Date(rentalData.actualReturnDate) - new Date(rentalData.expectedReturnDate)) /
        (1000 * 60 * 60 * 24)
      );
      setRentalData((prev) => ({
        ...prev,
        lateFee: daysLate * LATE_FEE_PER_DAY,
      }));
    } else {
      setRentalData((prev) => ({
        ...prev,
        lateFee: 0,
      }));
    }
  }, [rentalData.actualReturnDate, rentalData.expectedReturnDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRentalData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      car: { carId: rentalData.car },
      customer: { id: rentalData.customer },
      booking: { id: rentalData.booking },
      startDate: rentalData.startDate,
      expectedReturnDate: rentalData.expectedReturnDate,
      actualReturnDate: rentalData.actualReturnDate,
      lateFee: rentalData.lateFee,
      status: "RETURNED"
    };

    try {
      const response = await axios.post('http://localhost:8081/api/rental/add', payload);
      console.log("Rental created successfully:", response.data);
      alert("Rental added successfully!");

      // Reset form after submission
      setRentalData({
        car: '',
        customer: '',
        booking: '',
        remainingCost: '',
        startDate: '',
        expectedReturnDate: '',
        actualReturnDate: '',
        lateFee: '',
        status: 'RUNNING'
      });
    } catch (error) {
      console.error("Error creating rental:", error);
      alert("Failed to add rental. Check the console for more info.");
    }
  };

  const backgroundStyle = {
    backgroundImage: "url('/rentalbg.jpg')",
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
          <div className="card-header bg-secondary text-white p-3 mx-auto text-center" style={{ width: 'fit-content', borderRadius: '8px' }}>
            <h3 className="m-0">RENTAL MANAGEMENT</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold">Booking Reference</label>
                  <input
                    type="text"
                    className="form-control"
                    name="booking"
                    value={rentalData.booking}
                    onChange={handleChange}
                    placeholder="Enter Booking ID"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold">Car ID</label>
                  <input
                    type="text"
                    className="form-control"
                    name="car"
                    value={rentalData.car}
                    readOnly
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold">Customer ID</label>
                  <input
                    type="text"
                    className="form-control"
                    name="customer"
                    value={rentalData.customer}
                    readOnly
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold">Remaining Cost</label>
                  <input
                    type="text"
                    className="form-control"
                    name="remainingCost"
                    value={rentalData.remainingCost}
                    readOnly
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-bold">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="startDate"
                    value={rentalData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-bold">Expected Return</label>
                  <input
                    type="date"
                    className="form-control"
                    name="expectedReturnDate"
                    value={rentalData.expectedReturnDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-bold">Actual Return</label>
                  <input
                    type="date"
                    className="form-control"
                    name="actualReturnDate"
                    value={rentalData.actualReturnDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold">Late Fee</label>
                  <input
                    type="text"
                    className="form-control"
                    name="lateFee"
                    value={rentalData.lateFee}
                    readOnly
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold">Status</label>
                  <input
                    type="text"
                    className="form-control"
                    name="status"
                    value={rentalData.status}
                    readOnly
                  />
                </div>

                <div className="col-12 mt-4 text-center">
                  <button type="submit" className="btn btn-success btn-sm">
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalForm;