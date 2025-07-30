// src/pages/api/submit.js

import { Octokit } from "@octokit/rest";

export async function POST({ request }) {
  // 探针 #1：函数被触发
  console.log("[API START] /api/submit function was triggered.");

  try {
    const { fileName, mdContent } = await request.json();
    
    // 探针 #2：成功解析了请求体
    console.log(`[API DATA] Received fileName: ${fileName}`);

    if (!fileName || !mdContent || !fileName.endsWith('.md')) {
      // 探针 #3A：输入验证失败
      console.error("[API ERROR] Input validation failed.");
      return new Response(JSON.stringify({ error: '文件名和内容不能为空，且文件名必须以 .md 结尾。' }), { status: 400 });
    }

    // 探针 #4：准备调用GitHub API
    console.log("[API ACTION] Preparing to call GitHub API.");
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

    // 探针 #5：GitHub API调用成功
    console.log(`[API SUCCESS] Successfully committed ${fileName} to GitHub.`);
    return new Response(JSON.stringify({ success: true, message: `展品 '${fileName}' 已成功提交！` }), { status: 200 });

  } catch (error) {
    // 探针 #3B：捕获到未知错误
    console.error("[API CRITICAL ERROR] An unexpected error occurred:", error);
    const errorMessage = error.message || '提交失败，请查看服务器日志。';
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}