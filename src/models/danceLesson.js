const mongoose = require("mongoose");

const danceLessonSchema = new mongoose.Schema({
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
    lessonDuration: {
        type: Number,
    },
    price: {
        type: Number,
    },
    lessonLeader: {
        type: Array,
    },
    isActive: {
        type: Boolean,
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "member"}],
    amountOfMembers: { type: Number, default: 0},
});

module.exports = mongoose.model("dancelesson", danceLessonSchema);