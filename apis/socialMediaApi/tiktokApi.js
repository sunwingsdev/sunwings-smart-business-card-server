const express = require("express");
const { ObjectId } = require("mongodb");

const tiktokApi = (usersCollection) => {
  const tiktokRouter = express.Router();

  tiktokRouter.post("/:uid/tiktok", async (req, res) => {
    const uid = req.params.uid;
    const newTiktok = req.body;
    const filter = { uid: uid };
    const updateTiktok = {
      $push: {
        tiktok: {
          _id: new ObjectId(),
          tiktok: newTiktok,
        },
      },
    };
    try {
      const result = await usersCollection.updateOne(filter, updateTiktok);
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: "Failed to update tiktok links." });
    }
  });

  tiktokRouter.delete("/:uid/tiktok/:id", async (req, res) => {
    const uid = req.params.uid;
    const id = req.params.id;

    try {
      const filter = { uid: uid, "tiktok._id": new ObjectId(id) };
      const update = { $pull: { tiktok: { _id: new ObjectId(id) } } };
      const result = await usersCollection.updateOne(filter, update);

      if (result.modifiedCount > 0) {
        res.send({ message: "Tiktok link deleted successfully" });
      } else {
        res.status(404).send({ error: "tiktok link not found" });
      }
    } catch (error) {
      console.error("Error deleting tiktok link", error);
      res.status(500).send({ error: "Internal server error" });
    }
  });

  return tiktokRouter;
};

module.exports = tiktokApi;
