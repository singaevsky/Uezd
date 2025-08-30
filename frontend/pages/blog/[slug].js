// frontend/pages/blog/[slug].js
import { useRouter } from 'next/router';

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;

  // В реальности: запрос к /api/blog/{slug}
  const post = {
    title: 'Как выбрать торт на свадьбу',
    content: 'Свадебный торт — символ торжества. Рекомендуем начинку "Эстерхази" или "Три шоколада".',
    date: '2025-04-01'
  };

  return (
    <div className="blog-post">
      <h1>{post.title}</h1>
      <p><small>{new Date(post.date).toLocaleDateString()}</small></p>
      <div className="content">{post.content}</div>
    </div>
  );
}
