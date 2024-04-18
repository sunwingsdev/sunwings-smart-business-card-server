const express = require("express");
const { ObjectId } = require("mongodb");

const snapChatApi = (usersCollection) => {
  const snapChatRouter = express.Router();

  snapChatRouter.post("/:uid/snapchat", async (req, res) => {
    const uid = req.params.uid;
    const newSnapchat = req.body;
    const filter = { uid: uid };
    const updateSnapchat = {
      $push: {
        snapchat: {
          _id: new ObjectId(),
          snapchat: newSnapchat,
        },
      },
    };
    try {
      const result = await usersCollection.updateOne(filter, updateSnapchat);
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: "Failed to update snapchat links." });
    }
  });

  snapChatRouter.delete("/:uid/snapchat/:id", async (req, res) => {
    const uid = req.params.uid;
    const id = req.params.id;

    try {
      const filter = { uid: uid, "snapchat._id": new ObjectId(id) };
      const update = { $pull: { snapchat: { _id: new ObjectId(id) } } };
      const result = await usersCollection.updateOne(filter, update);

      if (result.modifiedCount > 0) {
        res.send({ message: "Snapchat link deleted successfully" });
      } else {
        res.status(404).send({ error: "snapchat link not found" });
      }
    } catch (error) {
      console.error("Error deleting snapchat link", error);
      res.status(500).send({ error: "Internal server error" });
    }
  });

  return snapChatRouter;
};

module.exports = snapChatApi;
