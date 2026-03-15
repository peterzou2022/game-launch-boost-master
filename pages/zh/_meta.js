export default {
  index: {
    title: "首页",
    type: "page",
    icon: "material-symbols:home",
    href: "/zh",
  },
  categories: {
    title: "分类",
    type: "menu",
    icon: "material-symbols:category",
    items: {
      "Reaction-Time-Test": {
        title: "反应时间测试",
        icon: "material-symbols:timer",
        href: "/zh/games/Reaction-Time-Test/The-Reaction-Time-Test",
      },
      "category-1": {
        title: "分类示例一",
        icon: "material-symbols:sports-martial-arts",
        href: "/zh/games/category-1",
      },
      "category-2": {
        title: "分类示例二",
        icon: "material-symbols:gamepad",
        href: "/zh/games/category-2",
      },
    },
  },
  landing: {
    title: "落地页示例",
    type: "page",
    icon: "material-symbols:download",
    href: "/zh/landing",
  },
  guides: {
    title: "指南",
    type: "menu",
    icon: "material-symbols:menu-book",
    items: {
      "1.getting-started": {
        title: "1. 快速开始",
        href: "/zh/guides/1.getting-started",
        icon: "material-symbols:rocket-launch",
      },
      "2.create-a-cloudflare-pages": {
        title: "2. 使用 Cloudflare Pages 部署",
        href: "/zh/guides/2.depoly-2-cloudflare-pages",
        icon: "material-symbols:cloud-upload",
      },
      "3.basic-configuration": {
        title: "3. 基础配置",
        href: "/zh/guides/3.basic-configuration",
        icon: "material-symbols:settings",
      },
      "4.i18n": {
        title: "4. 多语言支持",
        href: "/zh/guides/4.i18n",
        icon: "material-symbols:translate",
      },
      "5.menu": {
        title: "5. 菜单配置说明",
        href: "/zh/guides/5.menu",
        icon: "material-symbols:menu",
      },
      "6.theme-customization": {
        title: "6. 主题定制",
        href: "/zh/guides/6.theme-customization",
        icon: "material-symbols:palette",
      },
      "7.vscode-plugin": {
        title: "7. VSCode 插件",
        href: "/zh/guides/7.vscode-plugin",
        icon: "material-symbols:code",
      },
      "8.script": {
        title: "8. 脚本",
        href: "/zh/guides/8.script",
        icon: "material-symbols:terminal",
      },
    },
  },
};
