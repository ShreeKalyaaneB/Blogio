import connectDB from "@/utils/connectDB";
import Blog from "@/models/Blog";
import Comment from "@/models/Comment";
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { id } = req.query;

    try {
      await connectDB();

      const blog = await Blog.findById(id);

      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }

      const comments = await Comment.find({
        _id: { $in: blog.comments },
      }).populate("user", "userName");

      return res.status(200).json({ comments });
    } catch (error) {
      console.error("Error fetching comments:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
