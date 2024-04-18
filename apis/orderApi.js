const express = require("express");

const orderApi = (ordersCollection) => {
  const orderRouter = express.Router();

  orderRouter.post("/", async (req, res) => {
    const newOrder = req.body;
    const result = await ordersCollection.insertOne(newOrder);
    res.send(result);
  });

  orderRouter.get("/", async (req, res) => {
    const result = await ordersCollection
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    res.send(result);
  });

  return orderRouter;
};
module.exports = orderApi;
