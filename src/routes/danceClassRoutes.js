const express = require("express");
const {
    getAllDanceClasses,
    getAllActiveDanceClasses,
} = require("../controllers/danceClassController");

const router = express.Router();

router.get("/", getAllDanceClasses);
router.get("/getAllActiveDanceClasses", getAllActiveDanceClasses);

module.exports = router;