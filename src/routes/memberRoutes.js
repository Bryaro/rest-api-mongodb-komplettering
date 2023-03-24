const express = require("express");
const {
    getAllMembers,
    addNewMemberToLesson,
    updateMember,
    deleteMemberFromDanceLesson,
} = require("../controllers/memberController");

const router = express.Router();

router.get("/", getAllMembers);
router.post("/addNewMemberToLesson", addNewMemberToLesson);
router.post("/:memberId", updateMember);
router.delete("/deleteMemberFromDanceLesson", deleteMemberFromDanceLesson);



module.exports = router;