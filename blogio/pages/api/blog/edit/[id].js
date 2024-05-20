import Blog from "@/models/Blog";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    const { title, content } = req.body;
    blog.title = title;
    blog.content = content;

    await blog.save();
    res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
