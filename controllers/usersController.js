const User = require('../model/User')
const bcrypt = require('bcrypt')

const getAllUsers = async (req, res) => {
  const users = await User.find();
  if (!users) return res.status(204).json({ 'message': 'No users found.' })
  res.json(users);
}

const createNewUser = async (req, res) => {

  if (!req?.body?.username || !req?.body?.password) {
    return res.status(400).json({ 'message': 'Username and password are required.' })
  }
  try {
    // encrypt the password
    const hashedPwd = await bcrypt.hash(req.body.password, 10);
    // create and store the new user
    const result = await User.create({
      "username": req.body.username,
      "password": hashedPwd
    });
    res.status(201).json(result);
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}

const updateUser = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ 'message': 'User ID is required.' })
  }
  const user = await User.findOne({ _id: req.body.id }).exec()
  if (!user) {
    return res.status(204).json({ "message": `No user matches ID ${req.body.id}` });
  }
  if (req.body?.username) user.username = req.body.username;
  if (req.body?.roles) {
    user.roles = req.body.roles
  }
  if (req.body?.password) {
    const hashedPwd = await bcrypt.hash(req.body.password, 10);
    user.password = hashedPwd
  }

  try {
    const result = await user.save()
    res.json(result);
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}

const deleteUser = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ 'message': 'User ID is required.' })
  }
  const user = await User.findOne({ _id: req.body.id }).exec()
  if (!user) {
    return res.status(204).json({ "message": `No user matches ID ${req.body.id}` });
  }
  try {
    const result = await User.deleteOne({ _id: req.body.id })
    res.json(result)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }

}

const getUser = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ 'message': 'User ID is required.' })
  }
  const user = await User.findOne({ _id: req.params.id }).exec()
  if (!user) {
    return res.status(204).json({ "message": `No user matches ID ${req.body.id}` });
  }
  res.json(user);
}

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
  getUser
}