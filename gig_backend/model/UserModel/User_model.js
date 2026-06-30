const mongoose = require("mongoose");

//!these model is only used for client data

const UserSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    country: {
      type: String,
      trim: true,
      lowercase: true,
    },

    state: {
      type: String,
      trim: true,
      lowercase: true,
    },

    languages: {
      type: [],
      default: [],
    },

    // CLIENT

    clientType: {
      type: String,
      trim: true,
      lowercase: true,
    },

    clientRole: {
      type: String,
      trim: true,
      lowercase: true,
    },

    clientSummary: {
      type: String,
      trim: true,
    },

    company: {
      name: {
        type: String,
        trim: true,
      },

      companySize: {
        type: String,
        trim: true,
      },

      companySummary: {
        type: String,
        trim: true,
      },
    },

    Links: {
      websiteLink: {
        type: String,
        trim: true,
      },

      linkedInLink: {
        type: String,
        trim: true,
      },
    },

    hiringCategories: {
      type: [String],
      default: [],
    },

    // FREELANCER

    professionalTitle: {
      type: String,
      trim: true,
      lowercase: true,
    },

    professionalCategory: {
      type: String,
      trim: true,
      lowercase: true,
    },

    experienceLevel: {
      type: String,
      trim: true,
      lowercase: true,
    },

    freelanerSkills: {
      type: [String],
      default: [],
    },

    freelancerSummary: {
      type: String,
      trim: true,
    },

    hourlyRate: {
      type: Number,
      default: 0,
    },

    workExperience: {
      type: [
        {
          company: String,
          role: String,
          startDate: Date,
          endDate: Date,
          description: String,
        },
      ],
      default: [],
    },

    education: {
      type: [
        {
          school: String,
          degree: String,
          fieldOfStudy: String,
          startDate: Date,
          endDate: Date,
        },
      ],
      default: [],
    },

    // AUTH

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    PhoneNo: {
      type: Number,
      min: 10,
      max: 10,
    },

    password: {
      type: String,
      required: true,
      trim: true,
    },

    profileImage: {
      url: String,
      public_id: String,
    },

    // PORTFOLIO for freelancer

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
          default: [],
        },

        Portfolio_images: [
          {
            public_id: String,
            secure_url: String,
          },
        ],

        portfolio_created_at: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);