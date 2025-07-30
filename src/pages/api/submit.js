// src/pages/api/submit.js

// 这是一个在Vercel服务器上运行的“云函数”

import { Octokit } from "@octokit/rest";

// 这是我们之前打磨好的、最终版的Prompt
const PROMPT_V2_5 = `... (请在这里粘贴你那个完整的v2.5 Prompt) ...`;

export async function POST({ request }) {
  try {
    const { dirtyInput } = await request.json();

    if (!dirtyInput || dirtyInput.trim() === '') {
      return new Response(JSON.stringify({ error: '输入内容不能为空' }), { status: 400 });
    }

    // --- 调用你自己的“炼金术士” ---
    // 在这里，我们会模拟调用一个强大的AI（比如Gemini API）
    // 为了简化，我们先用一个占位符来模拟AI的输出
    // 在真实场景中，这里会是对Gemini API的fetch调用
    const fullPrompt = `${PROMPT_V2_5}\n\n# 原始材料:\n${dirtyInput}`;
    
    // --- 模拟AI生成内容 ---
    // TODO: 替换为真实的Gemini API调用
    // 假设AI分析了fullPrompt，并返回了下面这个Markdown内容
    // 这里的逻辑就是去调用AI API，然后把返回的Markdown内容赋值给aiGeneratedContent
    const exhibitNumberMatch = dirtyInput.match(/第(\d+)/);
    const exhibitNumber = exhibitNumberMatch ? exhibitNumberMatch[1] : 'XXX';
    const aiGeneratedContent = `---
title: "展品 #${exhibitNumber.padStart(3, '0')}: AI生成的占位符"
description: "这是由AI管家根据你的输入自动生成的展品。"
pubDate: "${new Date().toISOString().slice(0, 19)}"
tags: ['自动化', '测试']
layout: '../../layouts/Layout.astro'
---

### 策展人笔记：

这是你输入的内容：

${dirtyInput}
`;

    // --- 使用GitHub API将文件写入仓库 ---
    const octokit = new Octokit({ auth: import.meta.env.GITHUB_TOKEN });
    const [owner, repo] = import.meta.env.GITHUB_REPO.split('/');
    
    const fileName = `exhibit-${exhibitNumber}.md`;
    const filePath = `src/content/exhibits/${fileName}`;

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: filePath,
      message: `feat: add exhibit #${exhibitNumber} via Curator's Desk`,
      content: Buffer.from(aiGeneratedContent).toString('base64'),
      committer: {
        name: "Curator Bot",
        email: "bot@vercel.app"
      },
    });

    return new Response(JSON.stringify({ success: true, message: `展品 #${exhibitNumber} 已成功提交！` }), { status: 200 });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: '提交失败，请查看服务器日志。' }), { status: 500 });
  }
}