import connectDB from "@/utils/connectDB";
import Blog from "@/models/Blog";

export default async function handler(req, res)  {
  await connectDB();

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const blogs = await Blog.find({ user: userId }).sort({ createdAt: -1 });
    return res.status(200).json(blogs);
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};


