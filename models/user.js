const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  membership: {
    type: String,
    enum: ["noaccess", "access", "admin"],
    default: "noaccess",
  },
  created_at: { type: Date, default: Date.now },
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
});

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model("User", userSchema);
