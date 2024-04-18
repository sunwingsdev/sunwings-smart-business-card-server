const express = require("express");
const { ObjectId } = require("mongodb");

const whatsAppApi = (usersCollection) => {
  const whatsAppRouter = express.Router();

  whatsAppRouter.post("/:uid/whatsapp", async (req, res) => {
    const uid = req.params.uid;
    const newWhatsApp = req.body;
    const filter = { uid: uid };
    const updateWhatsApp = {
      $push: {
        whatsapp: {
          _id: new ObjectId(),
          whatsapp: newWhatsApp,
        },
      },
    };
    try {
      const result = await usersCollection.updateOne(filter, updateWhatsApp);
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: "Failed to update whatsApp links." });
    }
  });

  whatsAppRouter.delete("/:uid/whatsapp/:id", async (req, res) => {
    const uid = req.params.uid;
    const id = req.params.id;

    try {
      const filter = { uid: uid, "whatsapp._id": new ObjectId(id) };
      const update = { $pull: { whatsapp: { _id: new ObjectId(id) } } };
      const result = await usersCollection.updateOne(filter, update);

      if (result.modifiedCount > 0) {
        res.send({ message: "WhatsApp link deleted successfully" });
      } else {
        res.status(404).send({ error: "whatsApp link not found" });
      }
    } catch (error) {
      console.error("Error deleting whatsApp link", error);
      res.status(500).send({ error: "Internal server error" });
    }
  });

  return whatsAppRouter;
};

module.exports = whatsAppApi;
