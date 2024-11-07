import {
  zh_detail_basic,
  zh_detail_resource,
  zh_detail_trend,
  zh_detail_framework,
  zh_detail_application,
} from "./zh_detail";

export const zhNavbarConfig = [
  {
    text: "AI 基础知识",
    prefix: "/zh/basic/",
    children: zh_detail_basic,
  },
  {
    text: "AI 研究动态与技术趋势",
    prefix: "/zh/trend/",
    children: zh_detail_trend,
  },
  {
    text: "AI 开发工具与框架",
    prefix: "/zh/framework/",
    children: zh_detail_framework,
  },
  {
    text: "AI 行业应用",
    prefix: "/zh/application/",
    children: zh_detail_application,
  },
  {
    text: "AI 资源",
    prefix: "/zh/resource/",
    children: zh_detail_resource,
  },
];
