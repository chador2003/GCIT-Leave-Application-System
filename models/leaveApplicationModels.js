const mongoose = require('mongoose');
const validator = require('validator');

// const fileSchema = new mongoose.Schema({
//     filename: String,
//     path: String, 
// });

const leaveApplicationSchema = new mongoose.Schema({
    leavingDate: {
        type: Date,
        required: true,
    },
    reportingDate: {
        type: Date,
        required: true,
    },
    course: {
        type: String,
        required: true,
    },
    leaveCategory: {
        type: String,
        required: true,
        enum: ['shortTerm', 'longTerm', 'emergency', 'travel'],
    },

    shortTermReason: {
        type: String,
        required: function () {
            return this.leaveCategory === 'shortTerm';
        },
    },

    file: {
        type: String,
        required: function () {
            return ['longTerm', 'travel'].includes(this.leaveCategory);
        },
    },
    
    // longTermFile: {
    //     type: String,
    //     default:"data.pdf"
    // },

    emergencySickPersonName: {
        type: String,
        required: function () {
            return this.leaveCategory === 'emergency';
        },
    },
    // travelFile: {
    //     type: fileSchema,
    //     required: function () {
    //         return this.leaveCategory === 'travel';
    //     },

    // },

    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending', // Set the default status to 'pending'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

// Define the pre-find middleware outside of the schema definition
leaveApplicationSchema.pre(/^find/, function(next){
    this.populate({
      path: 'user',
      select: 'name'
    })
    next()
  })

const LeaveApplication = mongoose.model('LeaveApplication', leaveApplicationSchema);

module.exports = LeaveApplication;
