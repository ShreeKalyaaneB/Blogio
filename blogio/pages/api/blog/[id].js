import connectDB from "@/utils/connectDB";
import Blog from "@/models/Blog";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { id } = req.query;

    try {
      await connectDB();

      const blog = await Blog.findById(id)
        .populate("user")
        .populate("comments");

      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }

      return res.status(200).json({ blog });
    } catch (error) {
      console.error("Error fetching blog:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
