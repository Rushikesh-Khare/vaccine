const express = require('express')
const router = express.Router()
const {register,Login,update,deleteUser,getUser,follow,unFollow} = require('../controller/users')
const {createSlot,updateSlot,deleteSlot,likeSlot,getSlot,getTimeLineSlot,getAllSlot} = require('../controller/Slot')
const {hashPass} = require('../middleware/auth')



//user

router.post('/register',hashPass,register)
router.post('/login',Login)
router.route('/:id')
  .get(getUser)
  .put(hashPass, update)
  .delete(deleteUser);

router.put('/:id/follow',follow)
router.put('/:id/unfollow',unFollow)

//Slot

router.post('/createSlot',createSlot)
router.put('/:id/updateSlot',updateSlot)
router.delete('/:id/deleteSlot',deleteSlot)
router.put('/:id/likeSlot',likeSlot)
router.get('/:id/getSlot',getSlot)
router.get('/profile/:username',getAllSlot)
router.get('/timeline/:userId', getTimeLineSlot)




module.exports = router

