// src/pages/api/submit.js

import { Octokit } from "@octokit/rest";

export async function POST({ request }) {
  try {
    const { fileName, mdContent } = await request.json();

    if (!fileName || !mdContent || !fileName.endsWith('.md')) {
      return new Response(JSON.stringify({ error: '文件名和内容不能为空，且文件名必须以 .md 结尾。' }), { status: 400 });
    }

    // --- 直接使用你提供的内容，写入GitHub仓库 ---
    const octokit = new Octokit({ auth: import.meta.env.GITHUB_TOKEN });
    const [owner, repo] = import.meta.env.GITHUB_REPO.split('/');
    
    const filePath = `src/content/exhibits/${fileName}`;
    const commitMessage = `feat: add exhibit '${fileName}' via Curator's Desk`;

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: filePath,
      message: commitMessage,
      content: Buffer.from(mdContent).toString('base64'),
      committer: {
        name: "Curator Bot",
        email: "bot@vercel.app"
      },
    });

    return new Response(JSON.stringify({ success: true, message: `展品 '${fileName}' 已成功提交！` }), { status: 200 });

  } catch (error) {
    console.error(error);
    // 增加一个更详细的错误返回
    const errorMessage = error.message || '提交失败，请查看服务器日志。';
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}