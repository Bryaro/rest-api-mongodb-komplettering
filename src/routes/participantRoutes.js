const express = require("express");
const {
    getAllParticipants,
    addNewParticipantToClass,
    updateParticipant,
    deleteParticipantFromDanceClass,
} = require("../controllers/participantController");

const router = express.Router();

router.get("/", getAllParticipants);
router.post("/addNewParticipantToClass", addNewParticipantToClass);
router.post("/:participantId", updateParticipant);
router.delete("/deleteParticipantFromDanceClass", deleteParticipantFromDanceClass);



module.exports = router;