const participant = require("../models/participant");
const danceClass = require("../models/danceClass");
const { NotFoundError, BadRequestError } = require("../utils/errors");

const getAllDanceClasses = async (req, res) => {
    try{
        const danceClasses = await danceClass.find();

        if (!danceClasses) {
            throw new NotFoundError("Theres no dance classes!")
        }

        res.json(danceClasses);
    }catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message});
    }
};

const getAllActiveDanceClasses = async (req, res) => {
    try{
        const activeDanceClasses = await danceClass.find({ isActive: true });
    
        if (!activeDanceClasses.length) {
        throw new NotFoundError("There are no active dance classes!");
        }
        
        res.json(activeDanceClasses);
    }catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message});
    }
};

module.exports = {
    getAllDanceClasses,
    getAllActiveDanceClasses,
};