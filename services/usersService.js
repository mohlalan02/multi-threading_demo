import { ObjectId } from "mongodb";
import { getUsersCollection } from "../db.js";

import { publishEvent } from "../events/eventPublisher.js";

export async function findAllUsers() {
  const users = getUsersCollection();

  return users.find().toArray();
}

export async function findUserById(id) {
  const users = getUsersCollection();

  return users.findOne({
    _id: new ObjectId(id)
  });
}

export async function insertUser(userData) {
  const users = getUsersCollection();

  const newUser = {
    ...userData,
    createdAt: new Date().toISOString()
  };

  const result = await users.insertOne(newUser);

  const createdUser = {
    _id: result.insertedId,
    ...newUser
  };

  await publishEvent("UserCreated", {
    userId: createdUser._id.toString(),
    name: createdUser.name,
    email: createdUser.email,
    role: createdUser.role
  });

  return createdUser;
}

export async function updateUserById(id, userData) {
  const users = getUsersCollection();

  const updateFields = {};

  if (userData.name !== undefined) updateFields.name = userData.name;
  if (userData.email !== undefined) updateFields.email = userData.email;
  if (userData.role !== undefined) updateFields.role = userData.role;
  if (userData.cellphone !== undefined) updateFields.cellphone = userData.cellphone;

  if (Object.keys(updateFields).length === 0) {
    return null;
  }

  updateFields.updatedAt = new Date().toISOString();

  return users.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateFields },
    { returnDocument: "after" }
  );
}

export async function deleteUserById(id) {
  const users = getUsersCollection();

  const result = await users.deleteOne({
    _id: new ObjectId(id)
  });

  return result.deletedCount > 0;
}