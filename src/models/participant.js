const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
    participantName: {
        type: String,
        required: true,
    },
    participantEmail: {
        type: String,
        required: true,
    },
    participantPaymentStatus: {
        type: String,
        required: true,
    },
    participantClass: {
        type: String,
        required: true,
    },
    participantRole: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("participant", participantSchema);