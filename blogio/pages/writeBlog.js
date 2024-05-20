import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import axios from "axios";
import Header from "@/components/Header";
import dynamic from "next/dynamic";
import swal from "sweetalert2";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function WriteBlog() {
  const { data: session, status } = useSession();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverPhoto, setCoverPhoto] = useState("");
  const [userId, setUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const modalRef = useRef();

  useEffect(() => {
    if (session?.user?.id) {
      setUserId(session.user.id);
    }
  }, [session]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    }
    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      router.push("/auth/signin");
      return;
    }

    const formData = { title, content, userId, coverPhoto };

    try {
      const response = await axios.post("/api/blog/add", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        console.log("Blog post created successfully");
        setTitle("");
        setContent("");
        setCoverPhoto("");
        swal.fire({
          title: "Success",
          text: "Blog Created successfully!",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        router.push(`/myBlogs`);
      } else {
        console.error("Error creating blog post:", response.data);
      }
    } catch (error) {
      console.error("Error creating blog post:", error);
    }
  };

  const coverPhotos = [
    "/cover/general.png",
    "/cover/business.png",
    "/cover/fashion.png",
    "/cover/lifestyle.png",
    "/cover/technology.png",
    "/cover/nature.png",
    "/cover/food.png",
  ];

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const selectCoverPhoto = (photo) => {
    setCoverPhoto(photo);
    closeModal();
  };

  return (
    <>
      <Header />
      <section className="min-h-screen bg-cover bg-[url('/background.png')] bg-center bg-fixed">
        <div className="text-4xl items-center text-white py-6 font-bold text-center mb-8">
          Create a Blog Post
        </div>
        <div className="mx-auto mt-4 max-w-screen-xl bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="w-full p-2">
            <div className="mb-4">
              <label htmlFor="coverPhoto" className="block mb-2 font-bold">
                Cover Photo 📸
              </label>
              <button
                type="button"
                onClick={openModal}
                className="w-full h-[350px] object-fit border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-black"
              >
                {coverPhoto ? (
                  <img
                    src={coverPhoto}
                    alt="Cover"
                    className="h-full w-full "
                  />
                ) : (
                  "Select a cover photo"
                )}
              </button>
            </div>
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
              className="mt-8 bg-stone-700 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Publish Blog
            </button>
          </form>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            ref={modalRef}
            className="bg-white rounded-lg p-4 max-w-lg mx-auto overflow-y-auto max-h-full"
          >
            <h2 className="text-2xl mb-4">Select a Cover Photo</h2>
            <div className="grid grid-cols-2 gap-4">
              {coverPhotos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`Cover ${index + 1}`}
                  className="w-full h-auto cursor-pointer"
                  onClick={() => selectCoverPhoto(photo)}
                />
              ))}
            </div>
            <button
              onClick={closeModal}
              className="mt-4 bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
