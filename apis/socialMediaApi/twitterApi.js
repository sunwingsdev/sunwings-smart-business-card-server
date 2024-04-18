const express = require("express");
const { ObjectId } = require("mongodb");

const twitterApi = (usersCollection) => {
  const twitterRouter = express.Router();

  twitterRouter.post("/:uid/twitter", async (req, res) => {
    const uid = req.params.uid;
    const newTwitter = req.body;
    const filter = { uid: uid };
    const updateTwitter = {
      $push: {
        twitter: {
          _id: new ObjectId(),
          twitter: newTwitter,
        },
      },
    };
    try {
      const result = await usersCollection.updateOne(filter, updateTwitter);
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: "Failed to update twitter links." });
    }
  });

  twitterRouter.delete("/:uid/twitter/:id", async (req, res) => {
    const uid = req.params.uid;
    const id = req.params.id;

    try {
      const filter = { uid: uid, "twitter._id": new ObjectId(id) };
      const update = { $pull: { twitter: { _id: new ObjectId(id) } } };
      const result = await usersCollection.updateOne(filter, update);

      if (result.modifiedCount > 0) {
        res.send({ message: "Twitter link deleted successfully" });
      } else {
        res.status(404).send({ error: "twitter link not found" });
      }
    } catch (error) {
      console.error("Error deleting twitter link", error);
      res.status(500).send({ error: "Internal server error" });
    }
  });

  return twitterRouter;
};

module.exports = twitterApi;
