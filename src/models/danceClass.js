const mongoose = require("mongoose");

const danceClassSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    dancestyle: {
        type: String,
    },
    start: {
        type: String,
    },
    ends: {
        type: String,
    },
    time: {
        type: String,
    },
    classDuration: {
        type: Number,
    },
    price: {
        type: Number,
    },
    classLeader: {
        type: Array,
    },
    isActive: {
        type: Boolean,
    },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "participant"}],
    amountOfParticipants: { type: Number, default: 0},
});

module.exports = mongoose.model("danceclass", danceClassSchema);