import mongoose from 'mongoose'

const JobsMonthSchema = new mongoose.Schema({
    date_jobs: {
        type: Date,
        required: true,
    },
    children: [],
    modal_view: {
        type: Boolean,
        default: false
    }
})

export default mongoose.model('JobsMonth', JobsMonthSchema)