import connectDB from "@/utils/connectDB";
import Blog from "@/models/Blog";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      await connectDB();

      const blogs = await Blog.find().populate('user');

      return res.status(200).json({ blogs });
    } catch (error) {
      console.error("Error fetching blogs:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
