import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import DOMPurify from "dompurify";

export default function LandingPage() {
  const [blogs, setBlogs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const response = await axios.get("/api/blog/getAllBlogs");
        setBlogs(response.data.blogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    }

    fetchBlogs();
  }, []);

  const handleNavigate = (blogId) => {
    router.push(`/blog/${blogId}`);
  };

  return (
    <section
      className="min-h-screen bg-cover bg-center bg-fixed bg-opacity-50"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center text-white mb-8">
          All Blogs
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
              key={blog._id}
              onClick={() => handleNavigate(blog._id)}
            >
              <div onClick={() => handleNavigate(blog._id)}>
                <img class="rounded-t-lg cursor-pointer" src={blog.coverPhoto} alt="" />
              </div>
              <div class="p-5">
                <a href="#">
                  <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {blog.title}
                  </h5>
                </a>
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content).split(" ").slice(0, 12).join(" ")}}
                />
                <div
                  class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white cursor-pointer bg-stone-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={() => handleNavigate(blog._id)}
                >
                  Read more
                  <svg
                    class="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
