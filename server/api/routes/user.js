const express = require('express')
const router = express.Router()
const userModel = require('../../models/user')

// 获取所有的user
router.get('/user', (req, res, next) => {
  userModel.find({}, (error, user) => {
    error ? res.json(error) : res.json(user)
  })
})

// 获取某个user
router.get('/user/:id', (req, res, next) => {
  userModel.find({ _id: req.params.id }, (error, user) => {
    error ? res.json(error) : res.json(user)
  })
})

// 添加user
router.post('/user', (req, res, next) => {
  const userInfo = req.body.addUserInfo
  userModel.create({
    name: userInfo.name,
    avatar: userInfo.avatar,
    age: userInfo.age,
    homeAddress: userInfo.homeAddress,
    telNo: userInfo.telNo
  }, (error, user) => {
    error ? res.json(error) : res.json(user)
  })
})

// 删除user
router.delete('/user/:id', (req, res, next) => {
  userModel.remove({ _id: req.params.id }, (error) => {
    error ? res.json(error) : res.json({message: 'success'})
  })
})

// 修改user

router.put('/user/:id', (req, res, next) => {
  const userInfo = req.body.editUserInfo
  userModel.findOneAndUpdate({ _id: req.params.id }, {
    $set: {
      name: userInfo.name,
      avatar: userInfo.avatar,
      age: userInfo.age,
      homeAddress: userInfo.homeAddress,
      telNo: userInfo.telNo
    }
  }, (error) => {
    error ? res.json(error) : res.json({message: 'success'})
  })
})

// 查找user
router.get('/users/:uname', (req, res, next) => {
  userModel.find({ name: req.params.uname }, (error, user) => {
    error ? res.json(error) : res.json(user)
  })
})

module.exports = router
