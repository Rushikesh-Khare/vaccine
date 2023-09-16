const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
  
      },
      phone: {
        type: String,
        required: true,
        // min:10,
        // max: 10,
        unique: true
      },
      password: {
        type: String,
        required: true,
        // min: 6,
      },
      age: {
        type: Number,
       required:true
      },
      aadhar: {
        type: String,
        // min: 12,
        // max: 12,
        default: "",
      },
      pincode: {
        type: String,
        required: true,
        
      
      },
      doses: {
        type: Number,
  
        default: 0
      },

      firstDoseDate: {
        type: Date,
      },

      secondDoseDate: {
        type: Date,
      }
    },
    { timestamps: true }



)

const User = mongoose.model('user',userSchema)

module.exports = User