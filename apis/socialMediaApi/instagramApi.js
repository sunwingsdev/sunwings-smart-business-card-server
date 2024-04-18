const express = require("express");
const { ObjectId } = require("mongodb");

const instagramApi = (usersCollection) => {
  const instagramRouter = express.Router();

  instagramRouter.post("/:uid/instagram", async (req, res) => {
    const uid = req.params.uid;
    const newInstagram = req.body;
    const filter = { uid: uid };
    const updateInstagram = {
      $push: {
        instagram: {
          _id: new ObjectId(),
          instagram: newInstagram,
        },
      },
    };
    try {
      const result = await usersCollection.updateOne(filter, updateInstagram);
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: "Failed to update Instagram links." });
    }
  });

  instagramRouter.delete("/:uid/instagram/:id", async (req, res) => {
    const uid = req.params.uid;
    const id = req.params.id;

    try {
      const filter = { uid: uid, "instagram._id": new ObjectId(id) };
      const update = { $pull: { instagram: { _id: new ObjectId(id) } } };
      const result = await usersCollection.updateOne(filter, update);

      if (result.modifiedCount > 0) {
        res.send({ message: "Instagram link deleted successfully" });
      } else {
        res.status(404).send({ error: "Instagram link not found" });
      }
    } catch (error) {
      console.error("Error deleting Instagram link", error);
      res.status(500).send({ error: "Internal server error" });
    }
  });

  return instagramRouter;
};

module.exports = instagramApi;
