import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import Image from "next/image";


const BlogDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`/api/blog/${id}`);
        setBlog(response.data.blog);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog", error);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  if (!blog) {
    return <div>Blog not found</div>;
  }

  return (
    <>
      <Header />
      <section className="min-h-screen bg-cover bg-[url('/background.png')] bg-center bg-fixed">
        <div className="mx-auto max-w-screen-md pt-0">
          <div className="flex justify-center">
            <div categories={blog.categories} />
          </div>

          <h1 className="text-brand-primary mb-3 mt-2 text-white text-center text-3xl font-semibold tracking-tight lg:text-4xl lg:leading-snug">
            {blog.title}
          </h1>

          <div className="mt-3 flex justify-center space-x-3 text-gray-500">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 flex-shrink-0">
                <div className="bg-gray-200 rounded-full w-10 h-10"></div>
              </div>
              <div>
                <p className="text-white">
                  <span>{blog.user.userName}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-4 z-0 mx-auto aspect-w-16 aspect-h-9 max-w-screen-lg overflow-hidden">
          <div className="bg-gray-300 w-full h-full">
            <Image
              src={blog.coverPhoto}
              alt="Cover Photo"
              width={100}
              height={100}
              className="object-fit w-full h-full"
            />
          </div>
        </div>

        <div className="mx-auto max-w-screen-lg bg-white  shadow-md p-8">
        <div
            className="prose dark:prose-dark"
            dangerouslySetInnerHTML={{ __html:(blog.content) }}
          />
          <div className="mb-7 mt-7">
            <div className="flex items-center mb-3">
              ❤ Likes :<span className="ml-2">{blog.likes.length}</span>
            </div>

            <h2>Comments</h2>

            <div className="space-y-4">
              {blog.comments.map((comment, index) => (
                <div key={index} className="bg-gray-100 rounded-md p-4">
                  <p className="text-gray-800">{comment.user.userName}</p>
                  <p className="text-gray-700">{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogDetailsPage;
