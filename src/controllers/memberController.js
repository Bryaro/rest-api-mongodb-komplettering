const member = require("../models/member");
const danceLesson = require("../models/danceLesson");
const { NotFoundError, BadRequestError } = require("../utils/errors");
const mongoose = require('mongoose');

const getAllMembers = async (req, res) => {
    try{
        const Members = await member.find();

        if (!member) {
            throw new NotFoundError("Theres no members!")
        }

        res.json(Members);
    }catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message});
    }
};

const addNewMemberToLesson = async (req, res) => {
    try{
        const { memberName, memberEmail, memberLesson, memberRole } = req.body;
        const memberPaymentStatus = "pending";

        let danceLessonId;
        try {
            danceLessonId = await danceLesson.findById(memberLesson);
        } catch (error) {
            // @ts-ignore
            if (error instanceof mongoose.CastError) {
                return res.status(400).json({ message: "Invalid dance Lesson ID provided." });
            }
            throw error;
        }

        if (!memberName || !memberEmail || !memberLesson || !memberRole) {
            return res.status(400).json({ message: "Invalid entry! Empty Entry!"});
        }

        if (memberRole !== "Leader" && memberRole !== "Follower") {
            return res.status(400).json({ message: "Invalid entry! The memberRole needs to be either Leader or Follower!"});
        }

        const numMembersWithRole = await member.countDocuments({ memberLesson: memberLesson, memberRole: memberRole });

        if (memberRole === "Leader" && numMembersWithRole >= 10) {
            return res.status(400).json({ message: "The maximum number of leaders has been reached for this dance Lesson!" });
        }

        if (memberRole === "Follower" && numMembersWithRole >= 10) {
            return res.status(400).json({ message: "The maximum number of followers has been reached for this dance Lesson!" });
        }

        const newMember = await member.create({ memberName, memberEmail, memberPaymentStatus, memberLesson, memberRole});

        danceLessonId.members.push(newMember._id);
        danceLessonId.amountOfMembers += 1;
        await danceLessonId.save();

        res.json(newMember);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message});
    }
};

const updateMember = async (req, res) => {
    try{
        const memberId = req.params.memberId;
        const { memberEmail, memberPaymentStatus} = req.body;
        
        if (!mongoose.Types.ObjectId.isValid(memberId)) {
            return res.status(400).json({ message: "Invalid memberId" });
        }
        
        const memberToUpdate = await member.findById(memberId);

        if (!memberToUpdate) {
            throw new NotFoundError(`Member with ID ${memberId} not found`);
        }

        if (memberEmail) {
            memberToUpdate.memberEmail = memberEmail;
        };

        if (memberPaymentStatus == "pending") {
            memberToUpdate.memberPaymentStatus = memberPaymentStatus;
        } else if (memberPaymentStatus == "paid") {
            memberToUpdate.memberPaymentStatus = memberPaymentStatus;
        } else {
            return res.status(400).json({ message: "Invalid entry! The memberPaymentStatus needs to be either paid or pending!"});
        }

        const updatedMember = await memberToUpdate.save();
        return res.json(updatedMember);
    }catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message});
    }
};

const deleteMemberFromDanceLesson = async (req, res) => {
    const { danceLessonId, memberId } = req.query;
  
    if (!danceLessonId || !memberId) {
      return res
        .status(400)
        .json({
          message:
            "Invalid query parameters! Both danceLessonId and memberId are required!",
        });
    }
  
    try {
      const deletedMember = await member.findOneAndDelete({
        _id: memberId,
        memberLesson: danceLessonId,
      });
  
      if (!deletedMember) {
        return res
          .status(404)
          .json({
            message: `member with id ${memberId} not found in dance Lesson with id ${danceLessonId}`,
          });
      }
  
      const danceLessonToUpdate = await danceLesson.findById(danceLessonId);
  
      if (!danceLessonToUpdate) {
        throw new NotFoundError(`Dance Lesson with id ${danceLessonId} not found`);
      }
  
      danceLessonToUpdate.members = danceLessonToUpdate.members.filter(
        (member) => member.toString() !== memberId
      );
      danceLessonToUpdate.amountOfMembers -= 1;
  
      await danceLessonToUpdate.save();
  
      return res.json({
        message: `Member with id ${memberId} was successfully deleted from dance Lesson with id ${danceLessonId}`,
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
    getAllMembers,
    addNewMemberToLesson,
    updateMember,
    deleteMemberFromDanceLesson,
};