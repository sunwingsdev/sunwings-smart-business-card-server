const express = require("express");
const { ObjectId } = require("mongodb");

const facebookApi = (usersCollection) => {
  const facebookRouter = express.Router();

  facebookRouter.post("/:uid/facebook", async (req, res) => {
    const uid = req.params.uid;
    const newFacebook = req.body;
    const filter = { uid: uid };
    const updateFacebook = {
      $push: {
        facebook: {
          _id: new ObjectId(),
          facebook: newFacebook,
        },
      },
    };
    try {
      const result = await usersCollection.updateOne(filter, updateFacebook);
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: "Failed to update Facebook links." });
    }
  });

  facebookRouter.delete("/:uid/facebook/:id", async (req, res) => {
    const uid = req.params.uid;
    const id = req.params.id;

    try {
      const filter = { uid: uid, "facebook._id": new ObjectId(id) };
      const update = { $pull: { facebook: { _id: new ObjectId(id) } } };
      const result = await usersCollection.updateOne(filter, update);

      if (result.modifiedCount > 0) {
        res.send({ message: "Facebook link deleted successfully" });
      } else {
        res.status(404).send({ error: "Facebook link not found" });
      }
    } catch (error) {
      console.error("Error deleting Facebook link", error);
      res.status(500).send({ error: "Internal server error" });
    }
  });

  return facebookRouter;
};

module.exports = facebookApi;
