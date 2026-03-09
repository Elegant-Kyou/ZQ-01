# 吃什么 - 随机菜品推荐 H5 应用

帮你解决"今天吃什么"的选择困难症。支持按菜系、类型、口味、难度筛选，随机推荐菜品并提供详细做法。

## 功能

- 8大菜系 84道菜品随机推荐（川、鲁、粤、苏、浙、闽、湘、徽）
- 多维度筛选：菜系 / 类型（热菜、凉菜、汤羹）/ 口味 / 难度
- 菜品详情：食材清单、烹饪步骤、搭配建议
- 收藏功能（本地存储）
- 亮色/暗色主题切换
- 移动端自适应布局

## 技术栈

- **前端**: Vue 3 + Vue Router 4 + Vite
- **数据**: 纯前端应用，84道菜品数据内嵌于 `src/data/dishes.json`
- **部署**: Vercel（主）/ 阿里云 IIS（备）

## 访问地址

| 环境 | 地址 | 说明 |
|------|------|------|
| Vercel (主) | https://zhangqiang.work | 自定义域名，需DNS生效后可用 |
| 阿里云 (备) | http://121.43.192.101 | 阿里云 Windows Server + IIS |

## 本地开发

```bash
npm install
npm run dev
```

浏览器打开 http://localhost:3000

## 构建部署

```bash
npm run build
```

产出目录 `dist/`，可直接部署到任意静态托管服务。

### Vercel 部署

项目已配置 `vercel.json`，支持 SPA 路由重写。

```bash
vercel --prod
```

### 阿里云 IIS 部署

1. 将 `dist/` 内容上传到服务器 `C:\inetpub\what-to-eat\`
2. IIS Default Web Site 指向该目录
3. 确保 `web.config` 已配置 URL Rewrite 规则（SPA 路由）

## 域名配置

域名 `zhangqiang.work` 绑定到 Vercel，需在阿里云域名控制台添加 DNS 解析：

| 记录类型 | 主机记录 | 记录值 |
|---------|---------|--------|
| A | @ | 76.76.21.21 |
| A | www | 76.76.21.21 |

### 验证 DNS 是否生效

```bash
node check-domain.cjs
```

## 项目结构

```
src/
├── api/dishes.js          # 数据访问层（纯前端）
├── components/
│   ├── DishCard.vue        # 菜品卡片
│   ├── TagSelector.vue     # 标签筛选器
│   ├── ThemeToggle.vue     # 主题切换
│   ├── StepList.vue        # 步骤列表
│   └── PairingSection.vue  # 搭配建议
├── composables/
│   ├── useTheme.js         # 主题管理
│   └── useFavorites.js     # 收藏管理
├── data/dishes.json        # 84道菜品数据
├── styles/variables.css    # CSS主题变量
└── views/
    ├── HomePage.vue        # 首页（筛选）
    ├── ResultPage.vue      # 推荐结果
    └── DetailPage.vue      # 菜品详情
```

## 运维工具

- `check-domain.cjs` - 域名 DNS 解析验证脚本
- `health-check.cjs` - 服务健康检查脚本（检测所有部署节点）
- `deploy/` - 部署配置文件（Nginx、Docker、IIS 等）
