import express from "express";
import { ObjectId } from "mongodb";
import { getUsersCollection } from "../db.js";

const router = express.Router();

function isValidId(id) {
  return ObjectId.isValid(id);
}

router.get("/", async (req, res) => {
  const users = getUsersCollection();

  const result = await users.find().toArray();

  res.json(result);
});

router.get("/:id", async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  const users = getUsersCollection();

  const user = await users.findOne({
    _id: new ObjectId(req.params.id)
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

router.post("/", async (req, res) => {
  const { name, email, role, cellphone } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      message: "Name and email are required"
    });
  }

  const users = getUsersCollection();

  const newUser = {
    name,
    email,
    role,
    cellphone,
    createdAt: new Date().toISOString()
  };

  const result = await users.insertOne(newUser);

  res.status(201).json({
    _id: result.insertedId,
    ...newUser
  });
});

router.patch("/:id", async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  const updateFields = {};

  if (req.body.name !== undefined) updateFields.name = req.body.name;
  if (req.body.email !== undefined) updateFields.email = req.body.email;
  if (req.body.role !== undefined) updateFields.role = req.body.role;
  if (req.body.cellphone !== undefined) updateFields.cellphone = req.body.cellphone;

  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({
      message: "No fields provided to update"
    });
  }

  updateFields.updatedAt = new Date().toISOString();

  const users = getUsersCollection();

  const updatedUser = await users.findOneAndUpdate(
    { _id: new ObjectId(req.params.id) },
    { $set: updateFields },
    { returnDocument: "after" }
  );

  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(updatedUser);
});

router.delete("/:id", async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  const users = getUsersCollection();

  const result = await users.deleteOne({
    _id: new ObjectId(req.params.id)
  });

  if (result.deletedCount === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    message: "User deleted successfully"
  });
});

export default router;