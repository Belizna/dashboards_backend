import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema({
    assignment_date: {
        type: String,
        required: true,
    },
    assignment_name: {
        type: String,
        required: true,
    },
    assignment_status: {
        type: String,
        required: true
    },
    assignment_priority: {
        type: String,
        required: true
    },
    assignment_task: {
        type: String,
        required: true
    },
    assignment_employee: {
        type: String,
        required: true
    },
})

export default mongoose.model('Assignment', AssignmentSchema);