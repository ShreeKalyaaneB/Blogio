import React, { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const profileMenuRef = useRef(null);
  const { data: session } = useSession();
  const router = useRouter();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMobileMenuOpen(false);
    }
    if (
      profileMenuRef.current &&
      !profileMenuRef.current.contains(event.target)
    ) {
      setIsProfileMenuOpen(false);
    }
  };

  const handleCreateBlog = () => {
    if (session) {
      router.push("/writeBlog");
    } else {
      router.push("/auth/signin");
    }
  };

  useEffect(() => {
    if (isMobileMenuOpen || isProfileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen, isProfileMenuOpen]);

  return (
    <div>
      <header className="pb-6 bg-[#11161A] lg:pb-0">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex-shrink-0">
              <Link
                href="/"
                title=""
                className="flex font-bold text-white text-2xl "
              >
                Blogio
                
              </Link>
            </div>

            <button
              type="button"
              className="inline-flex p-2 text-white transition-all duration-200 rounded-md lg:hidden focus:bg-gray-100 hover:bg-gray-100"
              onClick={toggleMobileMenu}
            >
              <svg
                className={`block w-6 h-6 ${
                  isMobileMenuOpen ? "hidden" : "block"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 8h16M4 16h16"
                />
              </svg>
              <svg
                className={`hidden w-6 h-6 ${
                  isMobileMenuOpen ? "block" : "hidden"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="hidden lg:flex lg:items-center lg:ml-auto lg:space-x-10">
              <Link
                href="/"
                title=""
                className="text-base font-medium text-white transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
              >
                Home
              </Link>
              {session && (
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={toggleProfileMenu}
                    className="inline-flex py-2 text-base font-medium text-white transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
                  >
                    Profile
                  </button>
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg">
                      <div className="py-1">
                        <Link
                          href="/myBlogs"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          My Blogs
                        </Link>
                        <button
                          onClick={() => signOut()}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={handleCreateBlog}
              className="items-center justify-center hidden px-4 py-3 ml-10 text-base font-semibold text-white transition-all duration-200 bg-stone-700 border border-transparent rounded-md lg:inline-flex hover:bg-blue-700 focus:bg-blue-700"
            >
              Create Blog
            </button>
          </nav>

          {isMobileMenuOpen && (
            <nav
              className="pt-4 pb-6 bg-stone-700 border border-gray-200 rounded-md shadow-md lg:hidden"
              ref={menuRef}
            >
              <div className="flow-root">
                <div className="flex flex-col px-6 -my-2 space-y-1">
                  <Link
                    href="/"
                    title=""
                    className="inline-flex py-2 text-base font-medium text-white transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
                  >
                    Home
                  </Link>

                  {session && (
                    <div className="relative" ref={profileMenuRef}>
                      <button
                        onClick={toggleProfileMenu}
                        className="inline-flex py-2 text-base font-medium text-white transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
                      >
                        Profile
                      </button>
                      {isProfileMenuOpen && (
                        <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg">
                          <div className="py-1">
                            <Link
                              href="/myBlogs"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              My Blogs
                            </Link>
                            <button
                              onClick={() => signOut()}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Sign Out
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="px-6 mt-6">
                <button
                  onClick={handleCreateBlog}
                  className="inline-flex justify-center px-4 py-3 text-base font-semibold text-white transition-all duration-200 bg-black border border-transparent rounded-md items-center hover:bg-blue-700 focus:bg-blue-700"
                >
                  Create Blog
                </button>
              </div>
            </nav>
          )}
        </div>
      </header>
    </div>
  );
}

export default Header;
