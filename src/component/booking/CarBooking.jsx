import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

function CarBooking() {
  const location = useLocation();
  const passedCarId = location.state?.carId;//it helps to get car id from carlist page

  // State declarations
  const [cars, setCars] = useState([]);
  const [userId, setUserId] = useState("");
  const [carId, setCarId] = useState(passedCarId || "");
  const [bookingDate, setBookingDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [pricePerDay, setPricePerDay] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [initialFee, setInitialFee] = useState(0);
  const [driveMode, setDriveMode] = useState("SELF");
  const [bookingStatus, setBookingStatus] = useState("Pending");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  //Fetch available cars
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/car/getAll");
        setCars(response.data);
      } catch (err) {
        setError("Failed to load car data");
        console.error(err);
      }
    };
    fetchCars();
  }, []);

  // Cost calculation logic
  useEffect(() => {
    const selectedCar = cars.find(c => c.carId == carId);//looks throught the car array to find which id match

    if (selectedCar && bookingDate && returnDate) {
      setPricePerDay(selectedCar.price);//if all the field selected it does cost calculation

      //converts the booking and return date text into actual javascript date object  

      const start = new Date(bookingDate);
      const end = new Date(returnDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));//rounds up to make sure u always charge for atleast one full day

      const calculatedTotal = days > 0 ? days * selectedCar.price : 0;
      setTotalCost(calculatedTotal);
      setInitialFee(calculatedTotal * 0.2);
    } else {
      setPricePerDay(0);
      setTotalCost(0);
      setInitialFee(0);
    }
  }, [carId, bookingDate, returnDate, cars]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    if (!userId || !carId || !bookingDate || !returnDate) {
      setError("All fields are required");
      return;
    }

    if (totalCost <= 0) {
      setError("Invalid booking duration");
      return;
    }

    const bookingObj = {
      customer: { id: userId },
      car: { carId: carId },
      bookingDate,
      returnDate,
      pricePerDay,
      totalCost,
      initialFee,
      driveMode,
      bookingStatus: "PENDING",
    };

    try {
      await axios.post("http://localhost:8081/api/book/create", bookingObj);
      setMsg("Booking successful!");
    } catch (err) {
      setError("Booking failed. Please try again.");
      console.error(err);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/carbook.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "30px",
      }}
    >
      <div
        className="card p-4"
        style={{
          width: "600px",
          backgroundColor: "rgba(253, 232, 232, 0.6)",
          backdropFilter: "blur(8px)",
          borderRadius: "15px",
          boxShadow: "0 0 25px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div className="card-header bg-primary text-white text-center fs-4 fw-bold">
          Book a Car
        </div>

        <div className="card-body">
          {msg && <div className="alert alert-success">{msg}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Customer ID:</label>
              <input
                className="form-control"
                value={userId}
                onChange={e => setUserId(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label>Selected Car:</label>
              <input
                className="form-control"
                value={cars.find(c => c.carId == carId)?.model || "Loading..."}
                readOnly
              />
            </div>

            <div className="mb-3">
              <label>Booking Date:</label>
              <input
                type="date"
                className="form-control"
                value={bookingDate}
                onChange={e => setBookingDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div className="mb-3">
              <label>Return Date:</label>
              <input
                type="date"
                className="form-control"
                value={returnDate}
                onChange={e => setReturnDate(e.target.value)}
                min={bookingDate || new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div className="mb-3">
              <label>Price Per Day:</label>
              <input className="form-control" value={pricePerDay} readOnly />
            </div>

            <div className="mb-3">
              <label>Total Cost:</label>
              <input className="form-control" value={totalCost.toFixed(2)} readOnly />
            </div>

            <div className="mb-3">
              <label>Initial Fee (20%):</label>
              <input className="form-control" value={initialFee.toFixed(2)} readOnly />
            </div>

            <div className="mb-3">
              <label>Drive Mode:</label>
              <select
                className="form-control"
                value={driveMode}
                onChange={e => setDriveMode(e.target.value)}
              >
                <option value="SELF">SELF</option>
                <option value="WITH_DRIVER">WITH DRIVER</option>
              </select>
            </div>

            <div className="mb-3">
              <label>Booking Status:</label>
              <select
                className="form-control"
                value={bookingStatus}
                onChange={e => setBookingStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Submit Booking
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CarBooking;