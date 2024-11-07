import {
  en_detail_basic,
  en_detail_resource,
  en_detail_trend,
  en_detail_framework,
  en_detail_application,
} from "./en_detail";

export const enNavbarConfig = [
  {
    text: "AI Basic knowledge",
    prefix: "/basic/",
    children: en_detail_basic,
  },
  {
    text: "AI Research&Tech Trends",
    prefix: "/trend/",
    children: en_detail_trend,
  },
  {
    text: "AI Tools and frameworks",
    prefix: "/framework/",
    children: en_detail_framework,
  },
  {
    text: "AI Applications",
    prefix: "/application/",
    children: en_detail_application,
  },
  {
    text: "AI Resource",
    prefix: "/resource/",
    children: en_detail_resource,
  },
];
