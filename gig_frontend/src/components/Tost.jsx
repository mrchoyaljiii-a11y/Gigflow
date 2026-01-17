import React, { useEffect } from 'react'
import { CiSquareRemove } from "react-icons/ci";
import { useDispatch, useSelector } from 'react-redux'
import { hideToast } from '../redux/Tost/Tost_slice.js';
const Tost = () => {

  const { message, show } = useSelector((state) => state.Tostslice
  )

  const dispatch = useDispatch()

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 3000)
      return () => clearTimeout(timer);
    }

  }, [show, dispatch])

  if (!show) return null;

  return (
    <div className="fixed top-5 right-5 z-50 toast
      flex justify-between items-center gap-2
      border py-3 rounded-xl w-80 px-3 bg-white shadow-lg">

      <div className="icon cursor-pointer hover:bg-primary hover:text-white p-2 rounded-md font-bold"
        onClick={() => dispatch(hideToast())}>
        <CiSquareRemove size={25} />
      </div>

      <div className="message">
        <p className='text-lg'>{message}</p>
      </div>
    </div>
  )
}

export default Tost
