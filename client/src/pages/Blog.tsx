import { BlogPost } from "@/entities/Post/ui/BlogPost";
import { useTranslation } from "react-i18next";
import type { BlogPost as BlogPostType } from "@/shared/types/blog";

export default function Blog() {
  const { t } = useTranslation();
  const posts = t('postsData', { returnObjects: true }) as BlogPostType[];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">{t('pages.blog.title')}</h1>
      <div className="max-w-3xl mx-auto">
        {posts.map((post) => (
          <BlogPost key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
