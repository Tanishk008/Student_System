const mongoose = require('mongoose');

const grievanceSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { 
        type: String, 
        enum: ['Academic', 'Hostel', 'Transport', 'Other'], 
        required: true 
    },
    date: { type: Date, default: Date.now },
    status: { 
        type: String, 
        enum: ['Pending', 'Resolved'], 
        default: 'Pending' 
    }
});

module.exports = mongoose.model('Grievance', grievanceSchema);
