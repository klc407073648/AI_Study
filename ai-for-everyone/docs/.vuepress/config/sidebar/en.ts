// region config
import {
  en_detail_basic,
  en_detail_resource,
  en_detail_trend,
  en_detail_framework,
  en_detail_application,
} from "../nav/en_detail";

export const enSidebarConfig = {
  '/basic/': [
    {
      text: 'AI Basic knowledge',
      // 相对路径会自动追加子路径前缀
      collapsible: true,
      children: en_detail_basic,
    },
  ],
  '/trend/': [
    {
      text: "AI Research&Tech Trends",
      collapsible: true,
      children: en_detail_trend,
    }
  ],
  '/framework/': [
    {
      text: "AI Tools and frameworks",
      collapsible: true,
      children: en_detail_trend,
    }
  ],
  '/application/': [
    {
      text: "AI Applications",
      collapsible: true,
      children: en_detail_trend,
    }
  ],
  '/resource/': [
    {
      text: "AI Resource",
      collapsible: true,
      children: en_detail_trend,
    }
  ],
}