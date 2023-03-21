const mongoose = require("mongoose")
const Schema = mongoose.Schema

const passportLocalMongoose = require("passport-local-mongoose")

const Session = new Schema({
  refreshToken: {
    type: String,
    default: "",
  },
})

const User = new Schema({
  firstName: {
    type: String,
    default: "",
  },
  lastName: {
    type: String,
    default: "",
  },
  authStrategy: {
    type: String,
    default: "local",
  },
  points: {
    type: Number,
    default: 50,
  },
  companyName: {
    type: String,
    default: "",
  },
  refreshToken: {
    type: [Session],
  },
  pitchDeck: {
    title: {
      type: String,
      default: "",
    },
    pdf: {
      type: String,
      default: "",
    },
    images: {
      type: Array,
      default: []
    }
  }
})

//Remove refreshToken from the response
User.set("toJSON", {
  transform: function (doc, ret, options) {
    delete ret.refreshToken
    // delete ret._id
    delete ret.__v
    delete ret.authStrategy
    return ret
  },
})

User.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", User)
