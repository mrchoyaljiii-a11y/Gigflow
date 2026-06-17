import React, { useState } from "react";
import { MdCategory } from "react-icons/md";
import { BsTools } from "react-icons/bs";
import { IoMdTrendingUp, IoIosArrowDown } from "react-icons/io";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";

const Filter = () => {

    const [skill, setSkill] = useState('');
    // console.log("skill =>", skill);
    const [formData, setFormData] = useState({
        categories: [],
        skills: [],
        experience: "Intermediate",
        budget: 20,
    });

    const [show, setShow] = useState(true);

    const categoryList = [
        "All Categories",
        "Development & IT",
        "Design & Creative",
        "Sales & Marketing",
        "Writing & Translation",
        "Legal",
    ];

    const skillsList = ["React", "Node.js", "UI/UX", "Python", "java", "marketing", "writing", "data science", "graphic design", "web development", "app development"];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            setFormData((prev) => ({
                ...prev,
                [name]: checked
                    ? [...prev[name], value]
                    : prev[name].filter((item) => item !== value),
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const toggleSkill = (skill) => {
        console.log("skill =>", skill);
        if (skill.length === 0) return
        setFormData((prev) => ({
            ...prev,
            skills: prev.skills.includes(skill)
                ? prev.skills.filter((s) => s !== skill)
                : [...prev.skills, skill],
        }));
    };

    //  Clear all filters
    const clearAll = () => {
        setFormData({
            categories: [],
            skills: [],
            experience: "Intermediate",
            budget: 20,
        });
    };

    // console.log("from data", formData);

    return (
        <aside className="w-80 border-r border-[#e7ebf3] bg-white hidden md:flex flex-col p-6 gap-8">

            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Filters</h2>
                <button
                    onClick={clearAll}
                    className="text-primary text-xs font-bold uppercase hover:underline"
                >
                    Clear All
                </button>
            </div>

            {/* Category checkbox */}
            <div className="flex flex-col gap-4">
                <div className="flex justify-between">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                        <MdCategory /> Category
                    </h3>
                    <button onClick={() => setShow(!show)}>
                        <IoIosArrowDown
                            size={20}
                            className={`${!show ? "rotate-180" : ""}`}
                        />
                    </button>
                </div>

                {show && (
                    <div className="flex flex-col gap-3">
                        {categoryList.map((c, index) => (
                            <label key={index} className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="categories"
                                    value={c}
                                    checked={formData.categories.includes(c)}
                                    onChange={handleChange}
                                    className="h-5 w-5"
                                />
                                <span className="text-sm">{c}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Skills */}
            <div className="flex flex-col gap-4">
                <h3 className="text-sm font-bold flex items-center gap-2">
                    <BsTools /> Skills
                </h3>

                <div>

                    <div className="relative">
                        <input
                            className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg text-sm"
                            placeholder="Search or click to select skills..."
                            type="text"
                            value={skill}
                            onChange={(e) => setSkill(e.target.value)}
                        />
                        <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                    </div>

                    <button className="border border-primary rounded-lg p-1 text-sm mt-2 hover:bg-primary hover:text-white cursor-pointer"
                        onClick={() => toggleSkill(skill)}
                    >Add Skill</button>

                </div>


                <div className="flex flex-wrap gap-2">
                    {skillsList.map((skill, index) => (
                        <span
                            key={index}
                            onClick={() => toggleSkill(skill)}
                            className={`px-3 py-1 text-xs rounded-full cursor-pointer border
                ${formData.skills.includes(skill)
                                    ? "bg-primary/10 text-primary border-primary"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                        >
                            {skill}
                        </span>
                    ))}
                </div>

                <div className="flex flex-wrap gap-2 border-t-2 ">
                    <p>selected:Skills</p>
                    {formData.skills.map((skill, index) => (
                        <span
                            key={index}
                            onClick={() => toggleSkill(skill)}
                            className={`px-3 py-1 text-xs rounded-full cursor-pointer border
                ${formData.skills.includes(skill)
                                    ? "bg-primary/10 text-primary border-primary"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                        >
                            {skill}
                        </span>
                    ))}
                </div>


            </div>

            {/* Experience */}
            <div className="flex flex-col gap-4">
                <h3 className="text-sm font-bold flex items-center gap-2">
                    <IoMdTrendingUp /> Experience Level
                </h3>

                {["Entry Level", "Intermediate", "Expert"].map((level, index) => (
                    <label key={index} className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="radio"
                            name="experience"
                            value={level}
                            checked={formData.experience === level}
                            onChange={handleChange}
                            className="h-5 w-5"
                        />
                        <span className="text-sm">{level}</span>
                    </label>
                ))}
            </div>

            {/* Budget */}
            <div className="flex flex-col gap-4">
                <div className="flex justify-between">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                        <FaMoneyCheckDollar /> Hourly Rate
                    </h3>
                    <span className="text-xs font-bold text-primary">
                        ${formData.budget}
                    </span>
                </div>

                <input
                    type="range"
                    name="budget"
                    min="5"
                    max="150"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full h-2 cursor-pointer accent-primary"
                />
            </div>
        </aside>
    );
};

export default Filter;
