const express = require("express");
const { ObjectId } = require("mongodb");

const personalWebsiteApi = (usersCollection) => {
  const personalWebsiteRouter = express.Router();

  personalWebsiteRouter.post("/:uid/personal-website", async (req, res) => {
    const uid = req.params.uid;
    const newWebsite = req.body;
    const filter = { uid: uid };
    const updateWebsite = {
      $push: {
        website: {
          _id: new ObjectId(),
          website: newWebsite,
        },
      },
    };
    try {
      const result = await usersCollection.updateOne(filter, updateWebsite);
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: "Failed to update snapchat links." });
    }
  });

  personalWebsiteRouter.delete(
    "/:uid/personal-website/:id",
    async (req, res) => {
      const uid = req.params.uid;
      const id = req.params.id;

      try {
        const filter = { uid: uid, "website._id": new ObjectId(id) };
        const update = {
          $pull: { website: { _id: new ObjectId(id) } },
        };
        const result = await usersCollection.updateOne(filter, update);

        if (result.modifiedCount > 0) {
          res.send({ message: "Personal Website link deleted successfully" });
        } else {
          res.status(404).send({ error: "Personal Website link not found" });
        }
      } catch (error) {
        console.error("Error deleting Personal Website link", error);
        res.status(500).send({ error: "Internal server error" });
      }
    }
  );

  return personalWebsiteRouter;
};

module.exports = personalWebsiteApi;
