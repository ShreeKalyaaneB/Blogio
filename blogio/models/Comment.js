import mongoose, { Schema, models } from "mongoose";
const commentSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Comment = models.Comment || mongoose.model("Comment", commentSchema);
export default Comment;
