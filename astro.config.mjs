import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  output: 'hybrid',
  adapter: vercel({
    // 关键新增：明确地将我们的API路由，排除在Astro的预渲染和中间件处理之外
    functionPerRoute: false,
    imageService: true,
  }),
});