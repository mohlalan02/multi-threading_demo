import { ObjectId } from "mongodb";
import {
  findAllUsers,
  findUserById,
  insertUser,
  updateUserById,
  deleteUserById
} from "../services/usersService.js";

function isValidId(id) {
  return ObjectId.isValid(id);
}

export async function getUsers(req, res) {
  const users = await findAllUsers();

  res.json(users);
}

export async function getUserById(req, res) {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  const user = await findUserById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
}

export async function createUser(req, res) {
  const { name, email, role, cellphone } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      message: "Name and email are required"
    });
  }

  const newUser = await insertUser({
    name,
    email,
    role,
    cellphone
  });

  res.status(201).json(newUser);
}

export async function updateUser(req, res) {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  const updatedUser = await updateUserById(req.params.id, req.body);

  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(updatedUser);
}

export async function deleteUser(req, res) {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  const deleted = await deleteUserById(req.params.id);

  if (!deleted) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ message: "User deleted successfully" });
}