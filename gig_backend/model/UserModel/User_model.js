const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },

    lastName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },

    userName: {
        type: String,
        trim: true,
        lowercase: true
    },
    country: {
        type: String,
        trim: true,
        lowercase: true
    },
    state: {
        type: String,
        trim: true,
        lowercase: true
    },
    languages: {
        type: [],
    },
    clientType: {
        type: String,
        trim: true,
        lowercase: true
    },
    company: {
        type: String,
        trim: true,
        lowercase: true
    },
    // websitelink: {
    //     type: String,
    //     trim: true,
    // },
    // linkedInLink: {
    //     type: String,
    //     trim: true,
    // },
    Links:{
        type: [],
        default: []
    },
    hiringCategories: {
        type: [String],
        trim: true,
        lowercase: true
    },
    professionalTitle: {
        type: String,
        trim: true,
        lowercase: true
    },
    professionalCategory: {
        type: String,
        trim: true,
        lowercase: true
    },
    experienceLevel: {
        type: String,
        trim: true,
        lowercase: true
    },
    hourlyRate: {
        type: Number,
    },
    // freelancerLink: {
    //     type: String,
    //     trim: true,
    //     lowercase: true
    // },
    freelanerSkills: {
        type: [String],
        trim: true,
        lowercase: true
    },
    ProfessionalSummary: {
        type: String,
        lowercase: true
    },
    workExperience: {
        type: []
    },
    education: {
        type: []
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },

    password: { type: String, required: true, trim: true },

    profileImage: {
        url: { type: String },
        public_id: { type: String },
    },

    // !portFolio projects data structure
    portfolioProjects: [
        {
            project_title: {
                type: String,
                trim: true,
                lowercase: true,
                required: true,
            },

            role_in_portfolio_project: {
                type: String,
                trim: true,
                lowercase: true,
            },

            portfolio_project_description: {
                type: String,
                trim: true,
                lowercase: true,
                required: true,
            },

            skills_and_deliverables_of_portfolio_project: {
                type: [String],
                required: true,
            },

            Portfolio_images: [
                {
                    public_id: {
                        type: String,
                    },

                    secure_url: {
                        type: String,
                    },
                },
            ],

            portfolio_created_at: {
                type: Date,
                default: Date.now,
            },
        },
    ],

}, { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);