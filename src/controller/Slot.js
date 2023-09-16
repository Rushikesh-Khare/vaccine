const Slot = require('../model/Slot');
const User = require('../model/User')
const { findById } = require('../model/User');


//create Slot 
  
async function createSlot(req,res){
    //date ,time 
    // date ---> time  
    // const newSlot = new Slot(req.body)
    try {
        const {name, time, day} = req.body;
        const dayObj = await timeSlot.findOne({day: day1});
        if(dayObj.timeSlot.includes(time)) {
            return res.status(400).send("slot is already booked");
        }
        
        const findUser = await User.findOne({name: name});
        if(findUser.doses === 2) {
            return res.status(400).send("already vacisinated")
        }
        // findUser.doses = findUser.doses + 1;
        const saveUser = await User.updateOne({doses: findUser.doses + 1});
        const newSlot = new Slot(req.body);
        const timeSlotUpdate = await timeSlot.updateOne({$push : {timeSlot : req.body.time}, $push : {slots : findUser._id},} );

        // $push : {followers : req.body.userId}
    } catch (error) {
        
    }
}


//update Slot

async function updateSlot(req, res) {
    try {
        const Slot = await Slot.findById(req.params.id);
        if (Slot.userId === req.body.userId) {
            await Slot.updateOne({ $set: req.body });
            res.status(200).send("Slot has been updated");
        } else {
            res.status(400).send("You cannot update someone else's Slot");
        }
    } catch (error) {
        res.status(500).send({ msg: error.message });
    }
}

//delete Slot

async function deleteSlot(req, res) {
    try {
        const Slot = await Slot.findById(req.params.id);
        if (Slot.userId === req.body.userId) {
            await Slot.deleteOne();
            res.status(200).send("Slot has been deleted");
        } else {
            res.status(400).send('You cannot delete someone else\'s Slot');
        }
    } catch (error) {
        res.status(500).send({ msg: error.message });
    }
}

//get Slot

async function getSlot(req,res){
    try {
        const Slot = await Slot.findById(req.params.id)
        res.status(200).send(Slot)
    } catch (error) {
        res.status(500).send({ msg: error.message });
    }
}

//like Slot

async function likeSlot(req,res){
    try {
        const Slot = await Slot.findById(req.params.id)
        if(!Slot.likes.includes(req.body.userId)){
            await Slot.updateOne({ $push : {likes : req.body.userId} }); 
            res.status(200).send({msg : "the Slot has been liked"}) 
        }
        else{
            await Slot.updateOne({ $pull : {likes : req.body.userId} }); 
        }  res.status(200).send({msg : "the Slot has been disliked"})
    } catch (error) {
        res.status(500).send({ msg: error.message });
    }
}

//get all Slot

async function getAllSlot(req,res){
  
        try {
          const user = await User.findOne({ username: req.params.username });
          const Slots = await Slot.find({ userId: user._id });
          res.status(200).json(Slots);
        } catch (err) {
          res.status(500).json(err);
        }
    
}

//get timeline Slot

async function getTimeLineSlot(req,res){
     try {
        const currentUser = await User.findById(req.params.userId)
        const userSlots = await Slot.find({userId : currentUser._id})
        const friendSlots = await Promise.all(
            currentUser.followings.map((friendId) => {
               return Slot.find({userId : friendId });
            })
        )
        res.json(userSlots.concat(...friendSlots))
     } catch (error) {
        res.status(500).send({ msg: error.message });
     }
}


module.exports = {createSlot,updateSlot,deleteSlot,likeSlot,getSlot,getTimeLineSlot,getAllSlot}