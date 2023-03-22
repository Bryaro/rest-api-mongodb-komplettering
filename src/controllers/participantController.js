const participant = require("../models/participant");
const danceClass = require("../models/danceClass");
const { NotFoundError, BadRequestError } = require("../utils/errors");
const mongoose = require('mongoose');

const getAllParticipants = async (req, res) => {
    try{
        const Participants = await participant.find();

        if (!participant) {
            throw new NotFoundError("Theres no participants!")
        }

        res.json(Participants);
    }catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message});
    }
};

const addNewParticipantToClass = async (req, res) => {
    try{
        const { participantName, participantEmail, participantClass, participantRole } = req.body;
        const participantPaymentStatus = "pending";

        let danceClassId;
        try {
            danceClassId = await danceClass.findById(participantClass);
        } catch (error) {
            // @ts-ignore
            if (error instanceof mongoose.CastError) {
                return res.status(400).json({ message: "Invalid dance class ID provided." });
            }
            throw error;
        }

        if (!participantName || !participantEmail || !participantClass || !participantRole) {
            return res.status(400).json({ message: "Invalid entry! Empty Entry!"});
        }

        if (participantRole !== "Leader" && participantRole !== "Follower") {
            return res.status(400).json({ message: "Invalid entry! The participantRole needs to be either Leader or Follower!"});
        }

        const numParticipantsWithRole = await participant.countDocuments({ participantClass: participantClass, participantRole: participantRole });

        if (participantRole === "Leader" && numParticipantsWithRole >= 10) {
            return res.status(400).json({ message: "The maximum number of leaders has been reached for this dance class!" });
        }

        if (participantRole === "Follower" && numParticipantsWithRole >= 10) {
            return res.status(400).json({ message: "The maximum number of followers has been reached for this dance class!" });
        }

        const newParticipant = await participant.create({ participantName, participantEmail, participantPaymentStatus, participantClass, participantRole});

        danceClassId.participants.push(newParticipant._id);
        danceClassId.amountOfParticipants += 1;
        await danceClassId.save();

        res.json(newParticipant);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message});
    }
};

const updateParticipant = async (req, res) => {
    try{
        const participantId = req.params.participantId;
        const { participantEmail, participantPaymentStatus} = req.body;
        
        if (!mongoose.Types.ObjectId.isValid(participantId)) {
            return res.status(400).json({ message: "Invalid participantId" });
        }
        
        const participantToUpdate = await participant.findById(participantId);

        if (!participantToUpdate) {
            throw new NotFoundError(`Participant with ID ${participantId} not found`);
        }

        if (participantEmail) {
            participantToUpdate.participantEmail = participantEmail;
        };

        if (participantPaymentStatus == "pending") {
            participantToUpdate.participantPaymentStatus = participantPaymentStatus;
        } else if (participantPaymentStatus == "paid") {
            participantToUpdate.participantPaymentStatus = participantPaymentStatus;
        } else {
            return res.status(400).json({ message: "Invalid entry! The participantPaymentStatus needs to be either paid or pending!"});
        }

        const updatedParticipant = await participantToUpdate.save();
        return res.json(updatedParticipant);
    }catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message});
    }
};

const deleteParticipantFromDanceClass = async (req, res) => {
    const { danceClassId, participantId } = req.query;
  
    if (!danceClassId || !participantId) {
      return res
        .status(400)
        .json({
          message:
            "Invalid query parameters! Both danceClassId and participantId are required!",
        });
    }
  
    try {
      const deletedParticipant = await participant.findOneAndDelete({
        _id: participantId,
        participantClass: danceClassId,
      });
  
      if (!deletedParticipant) {
        return res
          .status(404)
          .json({
            message: `Participant with id ${participantId} not found in dance class with id ${danceClassId}`,
          });
      }
  
      const danceClassToUpdate = await danceClass.findById(danceClassId);
  
      if (!danceClassToUpdate) {
        throw new NotFoundError(`Dance class with id ${danceClassId} not found`);
      }
  
      danceClassToUpdate.participants = danceClassToUpdate.participants.filter(
        (participant) => participant.toString() !== participantId
      );
      danceClassToUpdate.amountOfParticipants -= 1;
  
      await danceClassToUpdate.save();
  
      return res.json({
        message: `Participant with id ${participantId} was successfully deleted from dance class with id ${danceClassId}`,
      });
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundError || error instanceof BadRequestError) {
        return res.status(error).json({ message: error.message });
      }
      return res.status(500).json({ message: error.message });
    }
  };

module.exports = {
    getAllParticipants,
    addNewParticipantToClass,
    updateParticipant,
    deleteParticipantFromDanceClass,
};