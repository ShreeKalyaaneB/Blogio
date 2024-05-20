import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const EditBlogPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [blog, setBlog] = useState({});
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`/api/blog/${id}`);
        setBlog(response.data.blog);
        setTitle(response.data.blog.title);
        setContent(response.data.blog.content);
      } catch (error) {
        console.error("Error fetching blog", error);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`/api/blog/edit/${id}`, {
        title,
        content,
      });
      console.log("Blog updated successfully:", response.data);
      router.push("/myBlogs");
    } catch (error) {
      console.error("Error updating blog:", error);
    }
  };

  return (
    <>
      <Header />
      <section className="min-h-screen bg-cover bg-[url('/background.png')] bg-center bg-fixed">
        <div className="text-4xl items-center text-white py-6 font-bold text-center mb-8 ">
          Edit Blog
        </div>
        <div className="mx-auto mt-4 max-w-screen-xl bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleUpdate} className="w-full p-2">
            <div className="mb-4">
              <label htmlFor="title" className="block mb-2 font-bold">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-[50px] border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="content" className="block mb-2 font-bold">
                Content
              </label>
              <ReactQuill
                value={content}
                onChange={setContent}
                modules={{
                  toolbar: [
                    [{ header: "1" }, { header: "2" }, { font: [] }],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["bold", "italic", "underline", "strike"],
                    [{ align: [] }],
                    ["link", "image"],
                    ["clean"],
                  ],
                }}
                formats={[
                  "header",
                  "font",
                  "bold",
                  "italic",
                  "underline",
                  "strike",
                  "list",
                  "bullet",
                  "align",
                  "link",
                  "image",
                ]}
                placeholder="Write your blog content here..."
                className="h-[400px] mb-4"
              />
            </div>

            <button
              type="submit"
              className="bg-stone-700 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Update Blog
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default EditBlogPage;
