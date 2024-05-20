import connectDB from "@/utils/connectDB";
import Blog from "@/models/Blog";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { title, content, userId, coverPhoto } = req.body;

      if (!title || !content || !userId) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      await connectDB();

      const newBlog = new Blog({
        title,
        content,
        user: userId,
        coverPhoto,
      });

      await newBlog.save();

      return res.status(201).json({ message: "Blog created", blog: newBlog });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
