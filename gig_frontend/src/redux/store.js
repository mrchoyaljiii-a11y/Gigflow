import { configureStore } from '@reduxjs/toolkit'
import jobReducer from './slices/job_slice'
import AuthReducer from './Auth/Auth'
import TostSlice from './Tost/Tost_slice'
import BidSlice from './Bid/Bid_slice.js'
import hired_slice from './hired_freelancer/hired_freelancer.js'
import userSlice from './getUser/User.js'
import Notification_actions_slice from './Notification_actions/Notifications_actions.js'
import freelancerPortfolioSlice from './freelancer_extra_info/Freelancer_extra_info.js'
import ShowToastSlice from './ShowTost/ShowToastSlice.js'
export const store = configureStore({
  reducer: {
    job: jobReducer,
    auth: AuthReducer,
    Tostslice: TostSlice,
    BidSlice: BidSlice,
    hired_slice: hired_slice,
    userSlice: userSlice,
    Notification_actions_slice: Notification_actions_slice,
    freelancerPortfolioSlice: freelancerPortfolioSlice,
    Showtoast:ShowToastSlice
  },
});


