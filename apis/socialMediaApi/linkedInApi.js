const express = require("express");
const { ObjectId } = require("mongodb");

const linkedInApi = (usersCollection) => {
  const linkedInRouter = express.Router();

  linkedInRouter.post("/:uid/linkedin", async (req, res) => {
    const uid = req.params.uid;
    const newLinkedin = req.body;
    const filter = { uid: uid };
    const updateLinkedin = {
      $push: {
        linkedin: {
          _id: new ObjectId(),
          linkedin: newLinkedin,
        },
      },
    };
    try {
      const result = await usersCollection.updateOne(filter, updateLinkedin);
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: "Failed to update LinkedIn links." });
    }
  });

  linkedInRouter.delete("/:uid/linkedin/:id", async (req, res) => {
    const uid = req.params.uid;
    const id = req.params.id;

    try {
      const filter = { uid: uid, "linkedin._id": new ObjectId(id) };
      const update = { $pull: { linkedin: { _id: new ObjectId(id) } } };
      const result = await usersCollection.updateOne(filter, update);

      if (result.modifiedCount > 0) {
        res.send({ message: "Linkedin link deleted successfully" });
      } else {
        res.status(404).send({ error: "linkedin link not found" });
      }
    } catch (error) {
      console.error("Error deleting linkedin link", error);
      res.status(500).send({ error: "Internal server error" });
    }
  });

  return linkedInRouter;
};

module.exports = linkedInApi;
