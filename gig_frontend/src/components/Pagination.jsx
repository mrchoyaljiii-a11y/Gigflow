import React, { use, useState } from 'react'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const Pagination = ({ totalPages, page, setPage }) => {
   
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
        <div className="flex items-center justify-center mt-10 gap-2 pb-12">

            {/* left btn */}

            <button className={`size-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-primary hover:text-primary transition-all ${page <= 1 ? "opacity-50 cursor-not-allowed" : "opacity-50 cursor-pointer"}`}
                disabled={page <= 1}
                onClick={() => setPage(pre => pre - 1)}
            >
                <span className="material-symbols-outlined"><MdKeyboardArrowLeft /></span>
            </button>

            {/* page numbers */}
            {
                pageNumbers.slice(page - 1, page + 2).map((number) => {
                    return (
                        <button className={`size-10 flex items-center justify-center rounded-lg ${page === number ? "bg-primary text-white" : "bg-white text-gary-600 hover:border-primary hover:text-primary transition-all"}  font-bold border border-gray-200 cursor-pointer`}
                            onClick={() => setPage(number)}>{number}</button>
                    )
                })
            }
            <div className='text-xl font-semibold'>...</div>
            <button className={`size-10 flex items-center justify-center rounded-lg ${page === pageNumbers.length ? "bg-primary text-white" : "bg-white text-gary-600 hover:border-primary hover:text-primary transition-all"}  font-bold border border-gray-200 cursor-pointer`}
                onClick={() => setPage(number)}>{pageNumbers.length}</button>

            {/* right btn */}
            <button className={`size-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-primary hover:text-primary transition-all cursor-pointer ${page >= pageNumbers.length ? "hidden cursor-not-allowed" : "opacity-50 cursor-pointer"}`}
                onClick={() => setPage(pre => pre + 1)}
                disabled={page >= pageNumbers.length}>
                <span className="material-symbols-outlined">{<MdKeyboardArrowRight />}</span>
            </button>
        </div>
    )
}

export default Pagination
