const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
    memberName: {
        type: String,
        required: true,
    },
    memberEmail: {
        type: String,
        required: true,
    },
    memberPaymentStatus: {
        type: String,
        required: true,
    },
    memberClass: {
        type: String,
        required: true,
    },
    memberRole: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("member", memberSchema);