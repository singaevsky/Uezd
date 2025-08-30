// frontend/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['res.cloudinary.com', 'localhost', 'your-bucket.s3.amazonaws.com'],
  },
  env: {
    SITE_NAME: 'Уездный кондитер.рф', // Название вашего сайта, которое будет отображаться в уведомлениях',
  },
};

module.exports = nextConfig;
