import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import DOMPurify from "dompurify";


export default function SingleBlogPage({ blog, comments: initialComments }) {
  const { data: session } = useSession();
  const [alreadyLiked, setAlreadyLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(blog ? blog.likes.length : 0);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(initialComments);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (blog && session) {
      setAlreadyLiked(blog.likes.includes(session.user.id));
    }
  }, [blog, session]);

  useEffect(() => {
    if (initialComments.length > 0) {
      setLoaded(true);
    }
  }, [initialComments]);

  const handleLike = async () => {
    try {
      if (alreadyLiked) {
        console.log("You've already liked this blog");
      } else {
        const response = await axios.post(
          `/api/blog/likes/${blog._id}?userId=${session.user.id}`
        );
        console.log("Blog liked successfully:", response.data);
        setAlreadyLiked(true);
        setLikesCount(likesCount + 1);
      }
    } catch (error) {
      console.error("Error liking blog:", error);
    }
  };

  const handleComment = async () => {
    try {
      const response = await axios.post(
        `/api/blog/comments/${blog._id}?userId=${session.user.id}`,
        {
          text: commentText,
        }
      );
      console.log("Comment added successfully:", response.data);
      setComments([...comments, response.data.comment]);
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

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
                <div className="bg-gray-200 rounded-full w-10 h-10"></div>{" "}
              </div>
              <div>
                <p className="text-white">
                  <span>{blog.user.userName}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-0 mt-2 mx-auto aspect-w-16 aspect-h-9 max-w-screen-lg overflow-hidden  mb-0">
          <div className="bg-gray-300 w-full h-full">
            <img
              src={blog.coverPhoto}
              alt="Cover Photo"
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        <div className="mx-auto max-w-screen-lg bg-white shadow-md p-8">
        <div
            className="prose dark:prose-dark"
            dangerouslySetInnerHTML={{ __html: (blog.content) }}
          />
          <div className="mb-7 mt-7">
            <div className="flex items-center mb-3">
              <button onClick={handleLike} disabled={alreadyLiked}>
                ❤ Like
              </button>
              <span className="ml-2">{likesCount}</span>
            </div>
            <div className="flex items-center mb-3">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Leave a comment..."
                className="border border-gray-300 rounded-md px-4 py-2 mr-2"
              />
              <button
                onClick={handleComment}
                className="bg-stone-700 text-white px-4 py-2 rounded-md"
              >
                Comment
              </button>
            </div>
            {loaded ? (
              <div className="space-y-4">
                {comments.map((comment, index) => (
                  <div key={index} className="bg-gray-100 rounded-md p-4">
                    <p className="text-gray-800 font-bold">{comment.user.userName}</p>
                    <p className="text-gray-700">Comment:{comment.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No Comments Yet...</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.query;

  try {
    const [blogResponse, commentsResponse] = await Promise.all([
      axios.get(`http://localhost:3000/api/blog/${id}`),
      axios.get(`http://localhost:3000/api/comments/${id}`),
    ]);
    const blog = blogResponse.data.blog;
    const comments = commentsResponse.data.comments;
    return {
      props: {
        blog,
        comments,
      },
    };
  } catch (error) {
    console.error("Error fetching blog and comments:", error);
    return {
      props: {
        blog: null,
        comments: [],
      },
    };
  }
}
