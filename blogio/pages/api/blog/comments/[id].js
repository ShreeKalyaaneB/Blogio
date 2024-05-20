import connectDB from "@/utils/connectDB";
import Blog from "@/models/Blog";
import Comment from "@/models/Comment";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { id } = req.query;
    const { text } = req.body;
    const userId = req.query.userId;

    try {
      await connectDB();

      const blog = await Blog.findById(id);

      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }

      const comment = new Comment({
        user: userId,
        text,
      });

      await comment.save();

      blog.comments.push(comment);

      await blog.save();

      return res
        .status(201)
        .json({ message: "Comment added successfully", comment });
    } catch (error) {
      console.error("Error adding comment:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
