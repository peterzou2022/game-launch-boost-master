import nextra from "nextra";
import path from "path";
import { fileURLToPath } from "url";
import { SITE_CONFIG } from "./config/site.js"; // 应该为 site.js 可能因为重命名引入更新导致错误

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const withNextra = nextra({
  theme: "./theme/src/index.tsx",
  themeConfig: "./theme.config.jsx",
});

export default withNextra({
  // 如果启用多语言，则使用 i18nConfig，否则不启用
  i18n: SITE_CONFIG.features.i18n
    ? {
        ...SITE_CONFIG.i18nConfig,
        localeDetection: true,
      }
    : undefined,
  output: "export",
  images: {
    unoptimized: true,
  },
  webpack(config) {
    config.resolve.alias["@"] = path.join(__dirname, "src");
    return config;
  },
});
