import { Route, Routes ,Navigate} from 'react-router-dom';
//import Booking from './component/booking/Booking';
import RenterCarList from './car/CarList'; 
import CarBooking from "./component/booking/CarBooking";
import GetBooking from './component/booking/GetBooking';
import Cancellation from './component/cancellation/Cancellation';
import Rental from './component/rental/Rental';
import BookingApproval from './manager/BookingApproval';
import RentalHistory from './component/rental/RentalHistory';
import ReviewWithFeedback from './component/review/ReviewWithFeedback';
import BecomeARenter from './component/renter/BecomeARenter';
import Login from './component/Auth/Login';
import SignupPage from './component/Auth/signup';
import CancellationList from './component/cancellation/CancellationList';



function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/" element={<Navigate to="/car-list" />} />
      <Route path="/carlist" element={<Navigate to="/car-list" />} />
      <Route path="/becomearenter" element={<BecomeARenter />} />
      <Route path="/car-list" element={<RenterCarList />} />
      <Route path="/carbook/:id" element={<CarBooking />} />
      <Route path="/booking-form" element={<CarBooking />} />
      <Route path="/my-bookings" element={<GetBooking />} />
      <Route path="cancellation" element={<Cancellation />} />
      <Route path="/cancellationlist" element={<CancellationList />} />
      <Route path="rental" element={<Rental />} />
      <Route path="/history" element={<RentalHistory />} />
      <Route path="/review" element={<ReviewWithFeedback />} />
      <Route path="/bookingApproval" element={<BookingApproval />} />
      
    </Routes>
  );
}
export default App;
