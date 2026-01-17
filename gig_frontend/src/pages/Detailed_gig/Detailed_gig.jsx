import React, { use, useState } from "react";
import { IoIosRocket } from "react-icons/io";
import { HiBadgeCheck } from "react-icons/hi";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import {AddBid} from '../../redux/Bid/Bid_slice.js'

const Detailed_gig = () => {

    const [Show, setShow] = useState(false);
   
    const { id } = useParams();

    const { jobs, searchGig, filterdGig, loading, error } = useSelector((state) => state.job);

    const dispatch = useDispatch();

    const { register, handleSubmit, formState: { errors } ,reset} = useForm();

    const filtergig = jobs.filter((gig) => gig._id === id);

    // console.log("detailed gig:", filtergig);

    const onSubmit = async (data) => {
        const updatedData = { ...data, gigId: id };
        const response = await dispatch(AddBid(updatedData)).unwrap();
        reset();
    };

    return (
        <>
            {
                filtergig.map((gig) => {

                    const { _id, Freelancer_type, projectTitle, clientName, category, Timeline, description, minBudget, maxBudget, tags, createdAt } = gig;

                    return (
                        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8"
                        key={_id}>

                            {/*  LEFT CONTENT  */}
                            <div className="lg:col-span-2 space-y-6">

                                {/* Header */}
                                <div className="bg-white rounded-2xl p-6 shadow">
                                    <h1 className="text-2xl font-bold text-slate-800">
                                        {projectTitle}
                                    </h1>
                                    <div className="flex gap-4 mt-2 text-sm text-slate-500">
                                        <span className="bg-blue-100 rounded-lg p-1 text-primary">Category: {category}</span>
                                        <span className="bg-blue-100 rounded-lg p-1 text-primary">• Posted on {createdAt.split('T')[0]}</span>
                                    </div>
                                </div>

                                {/* Budget & Timeline */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-5 rounded-xl shadow">
                                        <p className="text-sm text-slate-500">Budget</p>
                                        <p className="text-xl font-semibold text-primary mt-1">{`$${minBudget} - $${maxBudget}`}</p>
                                    </div>
                                    <div className="bg-white p-5 rounded-xl shadow">
                                        <p className="text-sm text-slate-500">Timeline</p>
                                        <p className="text-xl font-semibold mt-1">{Timeline}</p>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="bg-white p-6 rounded-2xl shadow">
                                    <h2 className="text-lg font-semibold mb-3">Gig Description</h2>

                                    <p
                                        className={`text-slate-600 leading-relaxed overflow-hidden transition-all duration-500 ease-in-out
      ${Show ? "max-h-20 opacity-80" : "max-h-250 opacity-100"}
    `}
                                    >
                                        {description}
                                    </p>

                                    <button
                                        className="mt-2 text-primary font-semibold hover:underline"
                                        onClick={() => setShow((prev) => !prev)}
                                    >
                                        {Show ? "Show More..." : "Show Less..."}
                                    </button>
                                </div>


                                {/* Client Info */}
                                <div className="bg-white p-6 rounded-2xl shadow space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-lg font-semibold">About Client</h2>
                                        <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                            <HiBadgeCheck size={20} /> Verified
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-slate-200 rounded-full" />
                                        <div>
                                            <h3 className="font-semibold">{clientName}</h3>
                                            <p className="text-sm text-slate-500">
                                                ⭐ 4.8 (120 reviews)
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT SIDEBAR (BID FORM)  */}
                            <div className="sticky top-24 h-fit bg-white rounded-2xl shadow overflow-hidden">

                                <div className="p-6 border-b">
                                    <h2 className="text-lg font-semibold">Place Your Bid</h2>
                                    <p className="text-sm text-slate-500 mt-1">
                                        Apply for this project now
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">

                                    {/* Bid */}
                                    <div>
                                        <label className="text-sm font-medium">Your Bid Amount</label>
                                        <input
                                            type="number"
                                            {...register("bid", { required: "Bid is required" })}
                                            placeholder="Enter your bid"
                                            className="mt-2 w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary outline-none"
                                        />
                                        {errors.bid && (
                                            <p className="text-sm text-red-500 mt-1">{errors.bid.message}</p>
                                        )}
                                    </div>

                                    {/* Timeline */}
                                    <div>
                                        <label className="text-sm font-medium">Delivery Timeline</label>
                                        <input
                                            type="text"
                                            {...register("timeline", { required: "Timeline is required" })}
                                            placeholder="E.g. 3 days, 2 weeks"
                                            className="mt-2 w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary outline-none"
                                        />
                                        {errors.timeline && (
                                            <p className="text-sm text-red-500 mt-1">{errors.timeline.message}</p>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="text-sm font-medium">Proposal Message</label>
                                        <textarea
                                            rows={4}
                                            {...register("description", {
                                                required: "Description is required",
                                                maxLength: 5000,
                                            })}
                                            placeholder="Explain why you're a good fit..."
                                            className="mt-2 w-full px-4 py-3 rounded-xl border resize-none focus:ring-2 focus:ring-primary outline-none"
                                        />
                                        {errors.description && (
                                            <p className="text-sm text-red-500 mt-1">
                                                {errors.description.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition"
                                    >
                                        Submit Proposal <IoIosRocket size={20} />
                                    </button>

                                </form>
                            </div>
                        </div>
                    )
                })

            }
        </>
    );
};

export default Detailed_gig;




// <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

//             {/*  LEFT CONTENT  */}
//             <div className="lg:col-span-2 space-y-6">

//                 {/* Header */}
//                 <div className="bg-white rounded-2xl p-6 shadow">
//                     <h1 className="text-2xl font-bold text-slate-800">
//                         Build a modern React dashboard with Tailwind
//                     </h1>
//                     <div className="flex gap-4 mt-2 text-sm text-slate-500">
//                         <span>Category: Web Development</span>
//                         <span>• Posted 2 days ago</span>
//                     </div>
//                 </div>

//                 {/* Budget & Timeline */}
//                 <div className="grid grid-cols-2 gap-4">
//                     <div className="bg-white p-5 rounded-xl shadow">
//                         <p className="text-sm text-slate-500">Budget</p>
//                         <p className="text-xl font-semibold text-primary mt-1">₹15,000</p>
//                     </div>
//                     <div className="bg-white p-5 rounded-xl shadow">
//                         <p className="text-sm text-slate-500">Timeline</p>
//                         <p className="text-xl font-semibold mt-1">7 Days</p>
//                     </div>
//                 </div>

//                 {/* Description */}
//                 <div className="bg-white p-6 rounded-2xl shadow">
//                     <h2 className="text-lg font-semibold mb-3">Gig Description</h2>
//                     <p className="text-slate-600 leading-relaxed">
//                         Looking for an experienced React developer to build a responsive
//                         dashboard using Tailwind CSS. Clean UI, reusable components, and
//                         performance optimization required.
//                     </p>
//                 </div>

//                 {/* Client Info */}
//                 <div className="bg-white p-6 rounded-2xl shadow space-y-4">
//                     <div className="flex justify-between items-center">
//                         <h2 className="text-lg font-semibold">About Client</h2>
//                         <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
//                             <HiBadgeCheck /> Verified
//                         </span>
//                     </div>

//                     <div className="flex items-center gap-4">
//                         <div className="w-14 h-14 bg-slate-200 rounded-full" />
//                         <div>
//                             <h3 className="font-semibold">John Doe</h3>
//                             <p className="text-sm text-slate-500">
//                                 ⭐ 4.8 (120 reviews)
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* RIGHT SIDEBAR (BID FORM)  */}
//             <div className="sticky top-24 h-fit bg-white rounded-2xl shadow overflow-hidden">

//                 <div className="p-6 border-b">
//                     <h2 className="text-lg font-semibold">Place Your Bid</h2>
//                     <p className="text-sm text-slate-500 mt-1">
//                         Apply for this project now
//                     </p>
//                 </div>

//                 <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">

//                     {/* Bid */}
//                     <div>
//                         <label className="text-sm font-medium">Your Bid Amount</label>
//                         <input
//                             type="number"
//                             {...register("bid", { required: "Bid is required" })}
//                             placeholder="Enter your bid"
//                             className="mt-2 w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary outline-none"
//                         />
//                         {errors.bid && (
//                             <p className="text-sm text-red-500 mt-1">{errors.bid.message}</p>
//                         )}
//                     </div>

//                     {/* Timeline */}
//                     <div>
//                         <label className="text-sm font-medium">Delivery Timeline</label>
//                         <input
//                             type="text"
//                             {...register("timeline", { required: "Timeline is required" })}
//                             placeholder="E.g. 3 days, 2 weeks"
//                             className="mt-2 w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary outline-none"
//                         />
//                         {errors.timeline && (
//                             <p className="text-sm text-red-500 mt-1">{errors.timeline.message}</p>
//                         )}
//                     </div>

//                     {/* Description */}
//                     <div>
//                         <label className="text-sm font-medium">Proposal Message</label>
//                         <textarea
//                             rows={4}
//                             {...register("description", {
//                                 required: "Description is required",
//                                 maxLength: 5000,
//                             })}
//                             placeholder="Explain why you're a good fit..."
//                             className="mt-2 w-full px-4 py-3 rounded-xl border resize-none focus:ring-2 focus:ring-primary outline-none"
//                         />
//                         {errors.description && (
//                             <p className="text-sm text-red-500 mt-1">
//                                 {errors.description.message}
//                             </p>
//                         )}
//                     </div>

//                     {/* Submit */}
//                     <button
//                         type="submit"
//                         className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition"
//                     >
//                         Submit Proposal <IoIosRocket size={20} />
//                     </button>

//                 </form>
//             </div>
//         </div>
