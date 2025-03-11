import mongoose from 'mongoose';

const { Schema } = mongoose;

const TaskSchema = new Schema({
    
    taskname: {type: String, default: 'task from note'},
    priorty: {type: String, default: 'low' },
    taskdate: {type: Date ,
        default: () => {
            const today = new Date();
            today.setUTCHours(0, 0, 0, 0);
            return today;
        } 
     },
    taskstatus: {type: String,  default: 'todo'},
    taskdescription: {type: String, required: true},
    taskcomments: {type: String,},
    crmuser:{type: Schema.Types.ObjectId, ref: 'User', required: true},

},{timestamps: true});

export default mongoose.models.Task || mongoose.model('Task', TaskSchema);
