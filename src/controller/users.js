const User = require('../model/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')
dotenv.config()

async function register(req,res){
   try {
    const {name,phone, age, password, aadhar, pincode} = req.body
   
   console.log(phone.length);
   if(phone.length  !== 10) {
      return res.status(400).send("phone length should be 10");
   }
   const userPhone = await User.findOne({phone: phone})
     if(userPhone){
        return res.status(400).send("phone is already exist")
     }
   if(aadhar.length !== 12) {
      return res.status(400).send("phone length should be 10");
   }

   if(pincode.length !== 6) {
      return res.status(400).send("phone length should be 10");
   }

   const user = await User.create(req.body)

   res.status(200).send("user is created")
   } catch (error) {
    res.status(500).send({msg : error.message})
   }

}

async function Login(req,res){
    try {
     const {phone,password} = req.body
     if(phone.length  !== 10) {
      return res.status(400).send("phone length should be 10");
     }
     const user = await User.findOne({phone: phone})
     if(!user){
        return res.status(400).send("there is no user with that phone")
     }
     const hash = await bcrypt.compare(password,user.password)

     if(hash){
       const token = jwt.sign({userId : user._id},process.env.secret_key)
       res.setHeader('X-api-key',token)
       res.status(200).send({status : true, data : token ,message : "user is logged in"})
     }
     
    } catch (error) {
     res.status(500).send({msg : error.message})
    }
 
 }

 //crud

 

 //update user
 
 async function update(req,res){
   try {
   if(req.body.userId===req.params.id || req.body.isAdmin){
         if(req.body.password){
            try {
               const hashedPass = await bcrypt.hash(req.body.password,8)
               req.body.password = hashedPass
            } catch (error) {
             return  res.status(500).send({msg : error.message})
            }
         }

         try {
            const user = await User.findByIdAndUpdate(req.params.id,{$set : req.body},{new:true})
            // console.log(user)
            res.status(200).send({status : true,message : "user is updated"})
         } catch (error) {
            return  res.status(500).send({msg : error.message})
         }
   }else{
      return res.status(400).send("you can only update your account!")
   }
    
   } catch (error) {
    return res.status(500).send({msg : error.message})
   }

}

 //delete user

 async function deleteUser(req,res){
   try {
   if(req.body.userId===req.params.id || req.body.isAdmin){
         if(req.body.userId){
         try {
            const user = await User.deleteOne({_id : req.params.id})
            res.status(200).send({status : true,message : "user is deleted"})
         } catch (error) {
            return  res.status(500).send({msg : error.message})
         }
      }
   }else{
      return res.status(400).send("you can only delete your account!")
   }
    
   } catch (error) {
    return res.status(500).send({msg : error.message})
   }

}

 //get user
 async function getUser(req,res){
   try {
      const username = await User.findOne({username : req.params.id}) || await User.findById(req.params.id)
   //   const user = await User.findById(req.params.id)
   //   if(!user){
   //    return res.status(400).send("there is no user with that email")
   // }
   // const { password,updateAt, ...other} = username._doc
   // console.log(other)
   res.status(200).json({data : username,msg : "ok"})

    
   } catch (error) {
    return res.status(500).send({msg : error.message})
   }

}


 //follow user
 async function follow(req,res){
   try{
      if(req.body.userId !== req.params.id){
          try {
            const user = await User.findById(req.params.id)
            const current = await User.findById(req.body.userId)
            if(!user.followers.includes(req.body.userId)){
               await user.updateOne({$push : {followers : req.body.userId}})
               await current.updateOne({$push : {followings : req.params.id}})
               return res.status(200).send("user has been followed")
            }
            else{
               return res.status(400).send("you already follow the user")
            }
          } catch (error) {
            
          }
      }
      else{

      }
   }
   catch (error) {
    return res.status(500).send({msg : error.message})
   }

}


 //unfollow user

 async function unFollow(req,res){
   try{
      if(req.body.userId !== req.params.id){
          try {
            const user = await User.findById(req.params.id)
            const current = await User.findById(req.body.userId)
            if(user.followers.includes(req.body.userId)){
               await user.updateOne({$pull : {followers : req.body.userId}})
               await current.updateOne({$pull : {followings : req.params.id}})
               return res.status(200).send("user has been unfollowed")
            }
            else{
               return res.status(400).send("you already unfollow the user")
            }
          } catch (error) {
            
          }
      }
      else{
         return res.status(400).send("id are same")
      }
   }
   catch (error) {
    return res.status(500).send({msg : error.message})
   }

}

module.exports = {register,Login,update,deleteUser,getUser,follow,unFollow}