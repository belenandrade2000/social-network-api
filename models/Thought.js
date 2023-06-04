const { Schema, model, Types } = require('mongoose');
const moment = require('moment');


// Schema to create Thought model
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 280,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtVal) => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')
    },
    username: {
        type: String,
        required: true, 
    },
    reactions: [reactionSchema],
    
  },

  {
    toJSON: {
      getters: true,
      virtuals: true,
    },
  }
);
thoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
})

const Thought = model('thought', thoughtSchema);

module.exports = Thought;

const reactionSchema = new Schema(
    {
    
    reactionId: {
        type: Schema.Types.ObjectId,
        default: ()=> new Types.ObjectId()
    },
    reactionBody: {
        type: String,
        required: true,
        maxlength: 280
    },
    username: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtVal) => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')
    }
    },
    {
    toJSON: {
        getters: true
    } 
    }
);