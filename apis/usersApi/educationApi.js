const express = require("express");
const { ObjectId } = require("mongodb");

const educationApi = (usersCollection) => {
  const educationRouter = express.Router();

  educationRouter.post("/:uid/education", async (req, res) => {
    const uid = req.params.uid;
    const { degree, institution, duration, passingYear } = req.body;
    const filter = { uid: uid };
    const updateEducation = {
      $push: {
        education: {
          _id: new ObjectId(),
          degree: degree,
          institution: institution,
          duration: duration,
          passingYear: passingYear,
        },
      },
    };
    try {
      const result = await usersCollection.updateOne(filter, updateEducation);
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: "Failed to update education." });
    }
  });

  educationRouter.delete("/:uid/education/:id", async (req, res) => {
    const uid = req.params.uid;
    const id = req.params.id;

    try {
      const filter = { uid: uid, "education._id": new ObjectId(id) };
      const update = { $pull: { education: { _id: new ObjectId(id) } } };
      const result = await usersCollection.updateOne(filter, update);

      if (result.modifiedCount > 0) {
        res.send({ message: "Education deleted successfully" });
      } else {
        res.status(404).send({ error: "education not found" });
      }
    } catch (error) {
      console.error("Error deleting education", error);
      res.status(500).send({ error: "Internal server error" });
    }
  });

  return educationRouter;
};

module.exports = educationApi;
