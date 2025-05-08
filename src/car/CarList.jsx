import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";



function RenterCarList() {
  const [cars, setCars] = useState([]);
  const [allCars, setAllCars] = useState([]);
  const [showMoreIndex, setShowMoreIndex] = useState(null);
  


  // Filter states
  const [selectedModels, setSelectedModels] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);

  
  const availableImages = [
    "ford_ecosport.jpg",
    "honda_city.jpg",
    "hyundai_creta.avif",
    "kia_seltos.jpeg",
    "maruti_baleno.avif",
    "tata_nexon.jpg",
    "toyota_fortuner.jpg",
    "skoda_slavia.jpeg"
  ];

  // Helper function to get image path
  const getCarImage = (brand, model) => {
    // Build possible filenames based on your actual files
    const variants = [
      //it an array of possible image file by combining carname and model
      `${brand}_${model}.jpg`,
      `${brand}_${model}.jpeg`,
      `${brand}_${model}.avif`
    ].map(name => name.toLowerCase().replace(/\s+/g, '_'));

    // Find the image that exists
    for (let variant of variants) {
      if (availableImages.includes(variant)) {
        return "/" + variant;
      }
    }
    // Fallback to default image if nothing matches
    return "/default.jpg";
  };

  const getAllCars = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/car/getAll");
      setAllCars(response.data);//stores the data fetched from the backed
      setCars(response.data);//stores the currently displayed of the cars
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllCars();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedModels, selectedYears, selectedFuelTypes, selectedPriceRanges]);

  // Handler functions for filters
  const handleModelChange = (model) => {
    setSelectedModels(prev =>
      prev.includes(model) ? prev.filter(m => m !== model) : [...prev, model]
    );
  };

  const handleYearChange = (year) => {
    setSelectedYears(prev =>
      prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]
    );
  };

  const handleFuelTypeChange = (fuelType) => {
    setSelectedFuelTypes(prev =>
      prev.includes(fuelType) ? prev.filter(f => f !== fuelType) : [...prev, fuelType]
    );
  };

  const handlePriceRangeChange = (priceRange) => {
    setSelectedPriceRanges(prev =>
      prev.includes(priceRange) ? prev.filter(p => p !== priceRange) : [...prev, priceRange]
    );
  };

  // Apply all filters
  const applyFilters = () => {
    let filteredCars = [...allCars];//makes copy of the original car list

    if (selectedModels.length > 0) {
      filteredCars = filteredCars.filter(car =>
        selectedModels.includes(car.model)
      );
    }

    if (selectedYears.length > 0) {
      filteredCars = filteredCars.filter(car =>
        selectedYears.includes(car.year.toString())
      );
    }

    if (selectedFuelTypes.length > 0) {
      filteredCars = filteredCars.filter(car =>
        selectedFuelTypes.includes(car.fuelType)
      );
    }

    if (selectedPriceRanges.length > 0) {
      filteredCars = filteredCars.filter(car => {
        const price = car.price;
        return selectedPriceRanges.some(range => {
          if (range === "Less than ₹1000") return price < 1000;
          if (range === "₹1000 - ₹2000") return price >= 1000 && price <= 2000;
          if (range === "Above ₹2000") return price > 2000;
          return false;
        });
      });
    }

    setCars(filteredCars);
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg mb-4 p-3" style={{ backgroundColor: "#1C2631" }}>
        <div className="container-fluid">
          <Link to="#" className="navbar-brand">
            <h3 className="text-white">CarRent</h3>
          </Link>
          <button
            className="navbar-toggler"
            style={{ boxShadow: "none", outline: "none", border: "none" }}
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navmenu"
          >
            <i className="bi bi-list fs-2" style={{ color: "#00B86B" }}></i>
          </button>

          <div className="collapse navbar-collapse" id="navmenu">
            <ul className="navbar-nav d-flex align-items-center gap-2 ms-auto">
              <li className="nav-item">
                <Link to="/becomearenter" className="nav-link text-white text-decoration-none">
                  Become a Renter
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/rental" className="nav-link p-0">
                  <button className="btn text-white fw-bold" style={{ backgroundColor: "#00B86B" }}>
                    RENTAL
                  </button>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/my-bookings" className="nav-link p-0">
                  <button className="btn text-white fw-bold" style={{ backgroundColor: "#0275d8" }}>
                    My Bookings
                  </button>
                </Link>
              </li>
              <Link to="/cancellationlist">
              <button className="btn btn-danger fw-bold">
                Get All Cancellations
              </button>
            </Link>

              <li className="nav-item">
                <Link to="/review" className="nav-link p-0">
                  <button className="btn text-white fw-bold" style={{ backgroundColor: "#0275d8" }}>
                    REVIEW    
                  </button>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/history" className="nav-link p-0">
                  <button className="btn text-white fw-bold" style={{ backgroundColor: "#0275d8" }}>
                    HISTORY
                  </button>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container-fluid">
        <div className="row">
          {/* SIDEBAR FILTER */}
          <aside className="col-md-3 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Filter by</h5>

                {/* Model */}
                <div className="mb-3">
                  <h6 className="form-label">Model</h6>
                  {["creta", "city", "Baleno", "Fortuner","EcoSport","Seltos","Nexon","Slavia"].map((m) => (
                    <div className="form-check" key={m}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`model-${m}`}
                        checked={selectedModels.includes(m)}
                        onChange={() => handleModelChange(m)}
                      />
                      <label className="form-check-label" htmlFor={`model-${m}`}>{m}</label>
                    </div>
                  ))}
                </div>

                {/* Year */}
                <div className="mb-3">
                  <h6 className="form-label">Year</h6>
                  {["2020","2021" ,"2022","2023", "2024","2019"].map((y) => (
                    <div className="form-check" key={y}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`year-${y}`}
                        checked={selectedYears.includes(y)}
                        onChange={() => handleYearChange(y)}
                      />
                      <label className="form-check-label" htmlFor={`year-${y}`}>{y}</label>
                    </div>
                  ))}
                </div>

                {/* Fuel Type */}
                <div className="mb-3">
                  <h6 className="form-label">Fuel Type</h6>
                  {["Petrol", "Diesel", "Electric"].map((f) => (
                    <div className="form-check" key={f}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`fuel-${f}`}
                        checked={selectedFuelTypes.includes(f)}
                        onChange={() => handleFuelTypeChange(f)}
                      />
                      <label className="form-check-label" htmlFor={`fuel-${f}`}>{f}</label>
                    </div>
                  ))}
                </div>

                {/* Price */}
                <div className="mb-3">
                  <h6 className="form-label">Price</h6>
                  {[
                    "Less than ₹1000",
                    "₹1000 - ₹2000",
                    "Above ₹2000",
                  ].map((p, idx) => (
                    <div className="form-check" key={idx}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`price-${idx}`}
                        checked={selectedPriceRanges.includes(p)}
                        onChange={() => handlePriceRangeChange(p)}
                      />
                      <label className="form-check-label" htmlFor={`price-${idx}`}>{p}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <section className="col-md-9">
            <h1 className="fw-500 p-4 text-black" style={{ fontSize: "1.5rem" }}>
              Available Cars
            </h1>

            <div className="row">
              {cars.map((car, index) => (
                <div className="col-md-4 mb-4" key={index}>
                  <div className="card text-center p-3 shadow-lg h-100">
                    <img
                      src={getCarImage(car.brand, car.model)}
                      alt={`${car.brand} ${car.model}`}
                      style={{ width: "100%", height: "180px", objectFit: "cover" }}
                      onError={e => {
                        if (e.target.src !== window.location.origin + "/default.jpg") {
                          e.target.onerror = null;
                          e.target.src = "/default.jpg";
                        }
                      }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="fw-bold">{car.brand} {car.model}</h5>
                      <p className="fw-light mb-1">Year: {car.year}</p>
                      <p className="fw-light mb-1">Fuel: {car.fuelType}</p>
                      <p className="fw-light mb-1">Trans: {car.transmission}</p>
                      <p className="fw-light mb-2">Mileage: {car.mileage} km</p>

                      {showMoreIndex === index && (
                        <>
                          <p className="fw-light mb-1">Make: {car.carMake}</p>
                          <p className="fw-light mb-1">Plate: {car.licensePlateNumber}</p>
                          <p className="fw-light mb-1">Reg#: {car.vehicleRegistrationNumber}</p>
                          <p className="fw-light mb-1">Color: {car.carColor}</p>
                          <p className="fw-light mb-1">Status: {car.status}</p>
                          <p className="fw-light mb-1">Sale Type: {car.carSaleType}</p>
                        </>
                      )}

                      <button
                        className="btn btn-link p-0 mb-2"
                        style={{ fontSize: "0.9rem" }}
                        onClick={() =>
                          setShowMoreIndex(showMoreIndex === index ? null : index)
                        }
                      >
                        {showMoreIndex === index ? "Read less" : "Read more"}
                      </button>

                      <div className="mt-auto">
                        <p><strong>₹{car.price}/day</strong></p>
                        <Link to={`/carbook/${car.carId}`} state={{ carId: car.carId }}>
                          <button className="btn btn-success">
                            Book a Car
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default RenterCarList;
