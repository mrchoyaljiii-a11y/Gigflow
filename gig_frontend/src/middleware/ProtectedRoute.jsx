import React from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { Navigate,useLocation } from 'react-router-dom'
import {showToast} from '../redux/Tost/Tost_slice.js'
const ProtectedRoute = ({children}) => {
  const { islogin,authChecked  } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch()
  if (!authChecked) {
    return (
      <div className="flex h-screen items-center justify-center">
        Checking authentication...
      </div>
    )
  }
  if (!islogin) {
    dispatch(showToast("Please login to access this page"));
     return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children
}

export default ProtectedRoute
