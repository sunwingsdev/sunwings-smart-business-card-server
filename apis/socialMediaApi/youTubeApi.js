const express = require("express");
const { ObjectId } = require("mongodb");

const youTubeApi = (usersCollection) => {
  const youTubeRouter = express.Router();

  youTubeRouter.post("/:uid/youtube", async (req, res) => {
    const uid = req.params.uid;
    const newYoutube = req.body;
    const filter = { uid: uid };
    const updateYoutube = {
      $push: {
        youtube: {
          _id: new ObjectId(),
          youtube: newYoutube,
        },
      },
    };
    try {
      const result = await usersCollection.updateOne(filter, updateYoutube);
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: "Failed to update Youtube links." });
    }
  });

  youTubeRouter.delete("/:uid/youtube/:id", async (req, res) => {
    const uid = req.params.uid;
    const id = req.params.id;

    try {
      const filter = { uid: uid, "youtube._id": new ObjectId(id) };
      const update = { $pull: { youtube: { _id: new ObjectId(id) } } };
      const result = await usersCollection.updateOne(filter, update);

      if (result.modifiedCount > 0) {
        res.send({ message: "Youtube link deleted successfully" });
      } else {
        res.status(404).send({ error: "youtube link not found" });
      }
    } catch (error) {
      console.error("Error deleting youtube link", error);
      res.status(500).send({ error: "Internal server error" });
    }
  });

  return youTubeRouter;
};

module.exports = youTubeApi;
