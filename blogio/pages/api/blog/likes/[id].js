import connectDB from "@/utils/connectDB";
import Blog from "@/models/Blog";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { id } = req.query;
    const { userId } = req.query;
    console.log("Blog ID:", id);
    console.log("User ID:", userId);

    try {
      await connectDB();

      const blog = await Blog.findById(id);
      console.log("Blog:", blog);

      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }

      if (blog.user.equals(userId)) {
        return res
          .status(403)
          .json({ error: "User cannot like their own blog" });
      }

      if (blog.likes.includes(userId)) {
        return res
          .status(400)
          .json({ error: "User has already liked the blog" });
      }

      blog.likes.push(userId);

      await blog.save();

      return res.status(200).json({ message: "Blog liked successfully" });
    } catch (error) {
      console.error("Error liking blog:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
