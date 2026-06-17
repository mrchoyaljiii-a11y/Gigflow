import React from 'react'
import { FaBolt } from "react-icons/fa6";
import { FaArrowRight, FaRegCheckCircle } from "react-icons/fa";
import { BiSolidShoppingBag } from "react-icons/bi";
import { MdPersonSearch } from "react-icons/md";
import { NavLink } from 'react-router-dom';
const First_page = () => {
    return (
        <div>

            {/* header */}
            <header className='sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm'>

                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center py-4">

                    <div className="right flex items-center gap-1">
                        <div className="icon bg-primary text-white p-2 rounded-md">
                            <FaBolt />
                        </div>
                        <h1 className="text-xl font-semibold">GigFlow</h1>
                    </div>

                    {/* middle */}
                    <div className="middle flex gap-6 text-gray-600 font-medium cursor-pointer">
                        <p className='hover:underline hover:text-secondary transition text-sm font-semibold text-[#0d121b]'>Find Freelancers</p>
                        <p className='hover:underline hover:text-secondary transition text-sm font-semibold text-[#0d121b]'>Find Jobs</p>
                        <p className='hover:underline hover:text-secondary transition text-sm font-semibold text-[#0d121b]'>How it works</p>
                    </div>

                    <div className="authentication">
                        <NavLink to={`/login`} >
                            <button className="login bg-transparent text-secondary p-2 rounded-md border-secondary/20 border-2 mr-2 font-medium hover:bg-secondary/5 transition-all cursor-pointer">
                                Login
                            </button>
                        </NavLink>

                        <NavLink to={`/createAccount`} >
                            <button className='bg-secondary text-white p-2 rounded-md hover:scale-[1.02] transition-all font-medium cursor-pointer'>
                                Sign Up
                            </button>
                        </NavLink>
                    </div>

                </div>

            </header>

            {/* main */}

            <main className="max-w-7xl mx-auto px-6">

                {/* hero */}
                <section className="mt-20 flex items-center gap-12 bg-slate-50">
                    <div className="w-1/2">
                        <h1 className="text-6xl font-bold mb-4 whitespace-pre-line leading-tight">
                            Hire Top
                            {"\n"}
                            Freelancers or {"\n"}<span className="text-secondary">Get Hired</span> For
                            {"\n"}
                            Your Skills
                        </h1>


                        <p className="text-gray-600 mb-6">
                            Join GigFlow today to connect the world's best talent with companies
                            of all sizes. A dual-sided marketplace built for growth, security,
                            and global collaboration.

                        </p>

                        <div className="flex gap-4">
                            <button className="bg-secondary text-white px-5 py-3 rounded-md flex items-center gap-2">
                                Post a Job <FaArrowRight />
                            </button>
                            <button className="border border-secondary/20 text-secondary px-5 py-3 rounded-md">
                                Find work
                            </button>
                        </div>
                    </div>

                    <div className="w-1/2 flex justify-end">
                        <img src="/hero_img.png" alt="hero" className="max-w-120 w-full rounded-lg h-120" />
                    </div>
                </section>

                {/* companies */}
                <section className="mt-32 mb-16 border-y border-slate-200 py-12">
                    <h2 className="text-center text-gray-600 mb-8 font-medium uppercase ">
                        Trusted by leading companies worldwide
                    </h2>

                    <div className="flex justify-center items-center gap-12 flex-wrap">
                        <p className='text-2xl font-black text-slate-800'>TECHCORP</p>
                        <p className='text-2xl font-black text-slate-800'>INNOVATEX</p>
                        <p className='text-2xl font-black text-slate-800'>GLOBALTECH</p>
                        <p className='text-2xl font-black text-slate-800'>SYNERGY</p>
                        <p className='text-2xl font-black text-slate-800'>VISIONARY</p>
                    </div>
                </section>

                {/* cards */}
                <section className="py-24 px-6 bg-slate-50 ">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0d121b]  mb-4">Tailored for Your Goals</h2>
                            <p className="text-slate-600  max-w-2xl mx-auto text-lg">Whether you're looking to scale your team or find your next big project, we have the tools you need.</p>
                        </div>

                        {/* card group */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* client card */}

                            <div className="bg-white  p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-8 hover:shadow-xl transition-shadow group">

                                <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                    <span className="material-symbols-outlined text-4xl"><BiSolidShoppingBag /></span>
                                </div>

                                <div>

                                    <h3 className="text-2xl font-bold text-slate-900  mb-4">For Clients</h3>
                                    <p className="text-slate-600  mb-6 leading-relaxed">Find vetted professionals to help grow your business. Control your workflow from end-to-end.</p>
                                    <ul className="space-y-4 mb-8">
                                        <li className="flex items-start gap-3 text-slate-700 ">
                                            <span className="material-symbols-outlined text-primary text-xl"><FaRegCheckCircle /></span>
                                            <span><strong>Post Jobs:</strong> Reach thousands of experts in minutes.</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-slate-700 ">
                                            <span className="material-symbols-outlined text-primary text-xl"><FaRegCheckCircle /></span>
                                            <span><strong>Manage Projects:</strong> Built-in tools for tracking progress.</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-slate-700 ">
                                            <span className="material-symbols-outlined text-primary text-xl"><FaRegCheckCircle /></span>
                                            <span><strong>Secure Payments:</strong> Funds held in escrow until approval.</span>
                                        </li>
                                    </ul>
                                    <button className="w-full py-4 border-2 border-primary text-primary font-bold rounded-xl group-hover:bg-primary group-hover:text-white transition-all">Start Hiring</button>
                                </div>
                            </div>

                            {/* frrlancer card */}

                            <div className="bg-white  p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100  flex flex-col gap-8 hover:shadow-xl transition-shadow group">
                                <div className="size-16 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-4xl"><MdPersonSearch /></span>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4">For Freelancers</h3>
                                    <p className="text-slate-600 400 mb-6 leading-relaxed">Access high-paying roles from innovative companies. Work your way, from anywhere.</p>
                                    <ul className="space-y-4 mb-8">
                                        <li className="flex items-start gap-3 text-slate-700 ">
                                            <span className="material-symbols-outlined text-blue-500 text-xl"><FaRegCheckCircle /></span>
                                            <span><strong>Create Profile:</strong> Showcase your portfolio and reviews.</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-slate-700 ">
                                            <span className="material-symbols-outlined text-blue-500 text-xl"><FaRegCheckCircle /></span>
                                            <span><span><strong>Get Paid Instantly:</strong> No more chasing invoices.</span>
                                            </span></li>
                                        <li className="flex items-start gap-3 text-slate-700 ">
                                            <span className="material-symbols-outlined text-blue-500 text-xl"><FaRegCheckCircle /></span>
                                            <span><strong>Global Opportunities:</strong> Work with teams worldwide.</span>
                                        </li>
                                    </ul>
                                    <button className="w-full py-4 border-2 border-blue-500 text-blue-500 font-bold rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-all">Find Work</button>
                                </div>
                            </div>

                        </div>

                    </div>

                </section>

                {/* how it works */}
                <section className="py-24 px-6 overflow-hidden">

                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-20">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0d121b]  mb-4">How it Works</h2>
                            <div className="w-20 h-1.5 bg-primary mx-auto rounded-full"></div>
                        </div>

                        <div className="relative">

                            <div className="absolute top-8 left-0 w-full h-0.5 bg-slate-200 hidden lg:block -translate-y-1/2 z-0"></div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">

                                {/*  Step 1  */}
                                <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6 group">
                                    <div className="size-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold ring-8 ring-white  shadow-xl transition-transform group-hover:scale-110">
                                        1
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-slate-900  mb-3">Post or Apply</h4>
                                        <p className="text-slate-600 ">Clients post their project requirements, while freelancers search and apply for jobs that match their skills.</p>
                                    </div>
                                </div>

                                {/*  Step 2  */}
                                <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6 group">
                                    <div className="size-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold ring-8 ring-white  shadow-xl transition-transform group-hover:scale-110">
                                        2
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-slate-900  mb-3">Collaborate</h4>
                                        <p className="text-slate-600 ">Use our secure workspace to chat, share files, and track milestones. Everything happens in one place.</p>
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6 group">
                                    <div className="size-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold ring-8 ring-white shadow-xl transition-transform group-hover:scale-110">
                                        3
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-slate-900  mb-3">Secure Payment</h4>
                                        <p className="text-slate-600 ">Funds are released only when milestones are met. Safe for clients, guaranteed for freelancers.</p>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>

                </section>

                {/* ready to start */}
                <section className="py-20 px-6">

                    <div className="max-w-5xl mx-auto bg-secondary rounded-4xl p-12 md:p-20 text-center text-white relative overflow-hidden">

                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 size-96 bg-white/10 rounded-full "></div>

                        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 size-96 bg-blue-400/20 rounded-full "></div>

                        {/* content */}
                        <div className="relative z-10">

                            <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Ready to get started?</h2>

                            <p className="text-white/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto">Join over 2 million professionals and companies already using FreelanceHub to do great work.</p>

                            {/* buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button className="px-10 py-4 bg-white text-primary font-bold rounded-xl text-lg hover:shadow-2xl transition-all">Sign Up Now</button>
                                <button className="px-10 py-4 bg-primary border-2 border-white/30 hover:border-white text-white font-bold rounded-xl text-lg transition-all">Contact Sales</button>
                            </div>

                        </div>

                    </div>
                </section>

            </main>

            {/* footer */}
            <footer className="bg-black text-slate-400 pt-20 pb-10 px-6 w-full">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">

                    <div className="col-span-2 lg:col-span-2">

                        {/* logo */}
                        <div className="right flex items-center gap-1">
                            <div className="icon bg-primary text-white p-2 rounded-md">
                                <FaBolt />
                            </div>
                            <h1 className="text-xl font-semibold text-white">GigFlow</h1>
                        </div>

                        <p className="max-w-xs mb-8">The world's largest marketplace for freelance talent. We make it easy to connect, collaborate, and pay global experts.</p>
                        <div className="flex gap-4">
                            <a className="size-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors" href="#">
                                <span className="material-symbols-outlined">share</span>
                            </a>
                            <a className="size-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors" href="#">
                                <span className="material-symbols-outlined">public</span>
                            </a>
                            <a className="size-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors" href="#">
                                <span className="material-symbols-outlined">alternate_email</span>
                            </a>
                        </div>
                    </div>
                    <div>
                        <h5 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">For Talent</h5>
                        <ul className="space-y-4 text-sm">
                            <li><a className="hover:text-primary transition-colors" href="#">Find Work</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Direct Contracts</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Freelance Services</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Success Stories</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">For Clients</h5>
                        <ul className="space-y-4 text-sm">
                            <li><a className="hover:text-primary transition-colors" href="#">How to Hire</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Talent Scout</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Enterprise Solutions</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Payroll Services</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Resources</h5>
                        <ul className="space-y-4 text-sm">
                            <li><a className="hover:text-primary transition-colors" href="#">Help Center</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Community</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                    <p>© 2024 FreelanceHub Global Inc. All rights reserved.</p>
                    <div className="flex gap-8">
                        <a className="hover:text-white transition-colors" href="#">Cookies</a>
                        <a className="hover:text-white transition-colors" href="#">Sitemap</a>
                        <a className="hover:text-white transition-colors" href="#">Accessibility</a>
                    </div>
                </div>
            </footer>

        </div>
    )
}

export default First_page

