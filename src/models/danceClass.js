const mongoose = require("mongoose");

const danceClassSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    dancestyle: {
        type: String,
        required: true,
    },
    start: {
        type: String,
        required: true,
    },
    ends: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    classDuration: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    classLeader: {
        type: Array,
        required: true,
    },
    isActive: {
        type: Boolean,
        required: true,
    },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "participant"}],
    amountOfParticipants: { type: Number, default: 0},
});

module.exports = mongoose.model("danceclass", danceClassSchema);