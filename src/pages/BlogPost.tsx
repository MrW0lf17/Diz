import { useParams, Link } from 'react-router-dom';
import { blogPosts } from './Blog';
import { BlogPost as BlogPostType } from '../types/blog';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p: BlogPostType) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-light py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-dark mb-8">Post Not Found</h1>
          <p className="text-xl text-gray-600 mb-8">
            The blog post you're looking for doesn't exist.
          </p>
          <Link to="/blog" className="text-primary hover:text-opacity-80">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light py-16 px-4 sm:px-6 lg:px-8">
      <article className="max-w-3xl mx-auto">
        <Link to="/blog" className="text-primary hover:text-opacity-80 inline-flex items-center mb-8">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </Link>

        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg mb-8" 
        />

        <div className="prose prose-lg max-w-none">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <time dateTime={post.date}>{post.date}</time>
            {post.category && (
              <>
                <span className="mx-2">•</span>
                <span className="text-primary">{post.category}</span>
              </>
            )}
          </div>

          <h1 className="text-4xl font-bold text-dark mb-8">{post.title}</h1>
          
          <div 
            className="text-gray-600"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-semibold text-dark mb-6">Related Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogPosts
              .filter((p: BlogPostType) => p.slug !== post.slug)
              .slice(0, 2)
              .map((relatedPost: BlogPostType) => (
                <Link 
                  key={relatedPost.slug} 
                  to={`/blog/${relatedPost.slug}`}
                  className="group"
                >
                  <article className="bg-white rounded-lg shadow-md overflow-hidden">
                    <img 
                      src={relatedPost.image} 
                      alt={relatedPost.title} 
                      className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-200" 
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-dark mb-2 group-hover:text-primary transition-colors duration-200">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-600">{relatedPost.excerpt}</p>
                    </div>
                  </article>
                </Link>
              ))}
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost; 