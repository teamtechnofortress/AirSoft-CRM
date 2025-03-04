import mongoose from 'mongoose';

const { Schema } = mongoose;

const TaskSchema = new Schema({
    
    taskname: {type: String, required: true},
    priorty: {type: String, required: true},
    taskdate: {type: Date, required: true,},
    taskstatus: {type: String, required: true},
    taskdescription: {type: String, required: true},
    taskcomments: {type: String, required: true},
    crmuser:{type: Schema.Types.ObjectId, ref: 'User', required: true},

},{timestamps: true});

export default mongoose.models.Task || mongoose.model('Task', TaskSchema);
