import {
  zh_detail_basic,
  zh_detail_resource,
  zh_detail_trend,
  zh_detail_framework,
  zh_detail_application,
} from "../nav/zh_detail";

export const zhSidebarConfig = {
  "/zh/basic/": [
    {
      text: "AI基础知识",
      // 相对路径会自动追加子路径前缀
      collapsible: true,
      children: zh_detail_basic,
    },
  ],
  "/zh/trend/": [
    {
      text: "AI 研究动态与技术趋势",
      collapsible: true,
      children: zh_detail_basic,
    },
  ],
  "/zh/framework/": [
    {
      text: "AI 开发工具与框架",
      collapsible: true,
      children: zh_detail_basic,
    },
  ],
  "/zh/application/": [
    {
      text: "AI 行业应用",
      collapsible: true,
      children: zh_detail_basic,
    },
  ],
  "/zh/resource/": [
    {
      text: "AI 资源",
      collapsible: true,
      children: zh_detail_basic,
    },
  ],
};
