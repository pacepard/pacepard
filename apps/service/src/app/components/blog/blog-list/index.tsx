"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function BlogList() {
  const [blogData, setBlogData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('/api/blog');
        if (!res.ok) throw new Error('Failed to fetch blogs');
        const data = await res.json();
        setBlogData(data || []);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setBlogData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading blogs...</div>
        </div>
      </section>
    );
  }

  if (blogData.length === 0) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Blog</h2>
            <p className="text-gray-600">No blog posts available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Blog Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogData.map((blog: any, index: number) => (
            <Link
              key={index}
              href={`/blog/${blog.slug || index}`}
              className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {blog.image && (
                <div className="relative h-48 w-full">
                  <Image
                    src={blog.image}
                    alt={blog.title || "Blog post"}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{blog.title || "Untitled"}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {blog.excerpt || blog.description || "No description available."}
                </p>
                <div className="text-sm text-gray-500">
                  {blog.date && new Date(blog.date).toLocaleDateString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
