const { User, Thought } = require('../models');

module.exports = {
  // Get all thoughts
//   Thought or Thoughts?
  getThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  // Get a thought
  getSingleThought(req, res) {

    Thought.findOne({ _id: req.params.thoughtId })

      .select('-__v')
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Create a thought
  createThought(req, res) {
    Thought.create(req.body)
        .then((thought) => {
            return User.findOneAndUpdate(
                { username: req.body.username },
                { $addToSet: { thoughts: thought._id } },
                { new: true }
            )
        })
        .then((thoughts) => res.status(200).json(thoughts))
        .catch((err) => res.status(500).json(err));
},
  // Delete a thought
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) =>
      ! thought
      ? res.status(404).json({ message: 'No thought with that ID' })
      : User.findOneAndUpdate(
          { thoughts: req.params.thoughtId },
          { $pull: { thoughts: req.params.thoughtId } },
          { new: true }
      )
)
.then(() => res.json({ message: 'Your thought has been deleted!' }))
.catch((err) => res.status(500).json(err));
},

  // Update a thought
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with this id!' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },


// Reactions

addReaction(req, res) {
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
    )
        .then((thought) =>
            !thought
                ? res.status(404).json({ message: 'No thought witih that id' })
                : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
}, 

deleteReaction(req, res) {
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.body.reactionId } } },
        { runValidators: true, new: true }
    )
        .then((thought) =>
            !thought
                ? res.status(404).json({ message: 'No thought with that id' })
                : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
}
}
