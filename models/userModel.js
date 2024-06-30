const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: [true, "Role is Required"],
      enum: ["admin", "organization", "donar", "hospital"],
    },
    name: {
      type: String,
      required: function () {
        if (this.role === "user" || this.role === "admin") {
          return true;
        }
        return false;
      },
    },
    organizationName: {
      type: String,
      required: function () {
        if (this.role === "organization") {
          return true;
        }
        return false;
      },
    },
    hospitalName: {
      type: String,
      required: function () {
        if (this.role === "hospital") {
          return true;
        }
        return false;
      },
    },

    email: {
      type: String,
      require: [true, "Email is Required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
    },
    website: {
      type: String,
    },
    address: {
      type: String,
      required: [true, "Address is Required"],
    },
    phone: {
      type: String,
      required: [true, "Phone Number is Required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
