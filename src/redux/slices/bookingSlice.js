import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    booking: null,
    loading: false,
    error: null,
  },
  reducers: {
    fetchBookingStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchBookingSuccess(state, action) {
      state.loading = false;
      state.booking = action.payload;
    },
    fetchBookingFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// Export actions
export const { fetchBookingStart, fetchBookingSuccess, fetchBookingFailure } = bookingSlice.actions;

// Async action 
export const fetchBookingById = (bookingId) => async (dispatch) => {
  dispatch(fetchBookingStart());
  try {
    const response = await axios.get(`http://localhost:8081/api/rental/${bookingId}`);
    dispatch(fetchBookingSuccess(response.data));
  } catch (error) {
    dispatch(fetchBookingFailure(error.message));
  }
};


export default bookingSlice.reducer;
