const member = require("../models/member");
const danceLesson = require("../models/danceLesson");
const { NotFoundError, BadRequestError } = require("../utils/errors");

const getAllDanceLessons = async (req, res) => {
    try{
        const danceLessons = await danceLesson.find();

        if (!danceLessons) {
            throw new NotFoundError("Theres no dance lessons!")
        }

        res.json(danceLessons);
    }catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message});
    }
};

const getAllActiveDanceLessons = async (req, res) => {
    try{
        const activeDanceLessons = await danceLesson.find({ isActive: true });
    
        if (!activeDanceLessons.length) {
        throw new NotFoundError("There are no active dance lessons!");
        }
        
        res.json(activeDanceLessons);
    }catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message});
    }
};

module.exports = {
    getAllDanceLessons,
    getAllActiveDanceLessons,
};