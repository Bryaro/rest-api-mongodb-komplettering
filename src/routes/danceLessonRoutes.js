const express = require("express");
const {
    getAllDanceLessons,
    getAllActiveDanceLessons,
} = require("../controllers/danceLessonController");

const router = express.Router();

router.get("/", getAllDanceLessons);
router.get("/getAllActiveDanceLessons", getAllActiveDanceLessons);

module.exports = router;