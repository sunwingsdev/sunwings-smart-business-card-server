const express = require("express");
const { ObjectId } = require("mongodb");

const jobExperienceApi = (usersCollection) => {
  const jobExperienceRouter = express.Router();

  jobExperienceRouter.post("/:uid/job-experience", async (req, res) => {
    const uid = req.params.uid;
    const { companyName, designation, experience, startDate, endDate } =
      req.body;
    const filter = { uid: uid };
    const updateJobExperience = {
      $push: {
        jobExperience: {
          _id: new ObjectId(),
          companyName: companyName,
          designation: designation,
          experience: experience,
          startDate: startDate,
          endDate: endDate,
        },
      },
    };
    try {
      const result = await usersCollection.updateOne(
        filter,
        updateJobExperience
      );
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: "Failed to update job experience." });
    }
  });

  jobExperienceRouter.delete("/:uid/job-experience/:id", async (req, res) => {
    const uid = req.params.uid;
    const id = req.params.id;

    try {
      const filter = { uid: uid, "jobExperience._id": new ObjectId(id) };
      const update = { $pull: { jobExperience: { _id: new ObjectId(id) } } };
      const result = await usersCollection.updateOne(filter, update);

      if (result.modifiedCount > 0) {
        res.send({ message: "Job Experience deleted successfully" });
      } else {
        res.status(404).send({ error: "Job Experience not found" });
      }
    } catch (error) {
      console.error("Error deleting Job Experience", error);
      res.status(500).send({ error: "Internal server error" });
    }
  });

  return jobExperienceRouter;
};

module.exports = jobExperienceApi;
