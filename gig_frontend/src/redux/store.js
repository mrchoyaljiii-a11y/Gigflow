import { configureStore } from '@reduxjs/toolkit'
import jobReducer from './slices/job_slice'
import AuthReducer from './Auth/Auth'
import TostSlice from './Tost/Tost_slice'
import BidSlice from './Bid/Bid_slice'
export const store = configureStore({
  reducer: {
   job: jobReducer,
   auth: AuthReducer,
   Tostslice : TostSlice,
   BidSlice:BidSlice
  },
})


