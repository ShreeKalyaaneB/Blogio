import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import swal from "sweetalert2";

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchBlogs = async () => {
      if (status === "loading") return;

      if (!session) {
        router.push("/auth/signin");
      } else {
        try {
          const userId = session.user.id;
          const response = await axios.get(
            `/api/blog/myBlogs?userId=${userId}`
          );
          setBlogs(response.data);
        } catch (error) {
          console.error("Error fetching blogs", error);
        }
      }
    };

    fetchBlogs();
  }, [session, status, router]);

  const handleEdit = (id) => {
    router.push(`/editBlog/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/blog/delete/${id}`);

      setBlogs(blogs.filter((blog) => blog._id !== id));
      swal.fire({
        title: "Success",
        text: "Blog deleted successfully!",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error deleting blog", error);
    }
  };

  const handleNavigate = (blogId) => {
    router.push(`/myBlogDetails/${blogId}`);
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-cover bg-[url('/background.png')] bg-center bg-fixed">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl text-white font-bold text-center mb-8">
            My Blogs
          </h1>
          {blogs.length === 0 ? (
            <p className="text-center text-gray-600">No blogs found</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <li
                  key={blog._id}
                  className="bg-white shadow-lg rounded-lg overflow-hidden"
                >
                  <div>
                    <img class="rounded-t-lg" src={blog.coverPhoto} alt="" />
                  </div>
                  <div className="p-6">
                    <h2
                      className="cursor-pointer text-xl font-semibold text-gray-800 mb-4"
                      onClick={() => {
                        handleNavigate(blog._id);
                      }}
                    >
                      {blog.title}
                    </h2>

                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => handleEdit(blog._id)}
                        className="bg-stone-700 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        ✏ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        ❌ Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default MyBlogs;
