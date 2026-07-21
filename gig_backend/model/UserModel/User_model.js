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
      
      industryType: {
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

    // AUTH

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    phoneNo: {
     countryCode: {
        type: String,
        trim: true,
      },

      number: {
        type: String,
        trim: true,
        minlength: 10,
        maxlength: 10,
        pattern: /^[0-9]{10}$/,
     }
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

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);