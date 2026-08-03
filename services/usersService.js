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

  const email = userData.email.toLowerCase();

  const newUser = {
    ...userData,
    email,
    createdAt: new Date().toISOString()
  };

  const result = await users.findOneAndUpdate(
    { email },
    {
      $setOnInsert: newUser
    },
    {
      upsert: true,
      returnDocument: "after",
      includeResultMetadata: true
    }
  );

  const user = result.value;
  const wasCreated = Boolean(result.lastErrorObject?.upserted);

  if (wasCreated) {
    await publishEvent("UserCreated", {
      eventId: `UserCreated-${user._id.toString()}`,
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    });
  }

  return {
    user,
    wasCreated
  };
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