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
- `health-check.cjs` - 服务健康检查脚本（检测所有部署节点，支持 `--json` 输出）
- `deploy/` - 部署配置文件（Nginx、Docker、IIS 等）

```bash
# 检查所有节点健康状态
node health-check.cjs

# JSON 格式输出（可对接监控系统）
node health-check.cjs --json

# 验证域名 DNS 解析
node check-domain.cjs
```

## 待完成事项

### 1. 域名 DNS 配置（等待域名审核通过）

域名 `zhangqiang.work` 已在阿里云提交注册，注册局审核中（约6小时）。审核通过后：

1. 登录阿里云控制台 -> 域名 -> 域名解析
2. 添加两条 A 记录：

| 记录类型 | 主机记录 | 记录值 |
|---------|---------|--------|
| A | @ | 76.76.21.21 |
| A | www | 76.76.21.21 |

3. 等待 DNS 生效（通常几分钟），运行 `node check-domain.cjs` 验证

### 2. 恢复阿里云服务器 IIS 服务

服务器 `121.43.192.101` 的 IIS（W3SVC）服务当前未运行，80 端口无响应。
SSH 密码认证已被禁用，无法远程执行命令。

**方案 A：通过 RDP 远程桌面修复（推荐）**

1. 远程桌面连接 `121.43.192.101`（用户 `Administrator`，密码见私密记录）
2. 打开 PowerShell（管理员），执行：
   ```powershell
   iisreset /start
   ```
3. 验证：浏览器访问 http://121.43.192.101

**方案 B：通过阿里云云助手远程执行**

1. 获取 AccessKey：阿里云控制台 -> 右上角头像 -> AccessKey 管理
2. 配置阿里云 CLI（已安装于 `C:\aliyun-cli\`）：
   ```bash
   export PATH="/c/aliyun-cli:$PATH"
   aliyun configure set --profile default --access-key-id <ID> --access-key-secret <SECRET> --region cn-hangzhou
   ```
3. 通过云助手执行命令：
   ```bash
   aliyun ecs RunCommand --Type RunPowerShellScript --CommandContent "iisreset /start" --InstanceId.1 <实例ID> --RegionId cn-hangzhou
   ```

**方案 C：恢复 SSH 密码认证**

通过 RDP 登录后，在 PowerShell 中执行：
```powershell
(Get-Content C:\ProgramData\ssh\sshd_config) -replace 'PasswordAuthentication no','PasswordAuthentication yes' | Set-Content C:\ProgramData\ssh\sshd_config
Restart-Service sshd
```

### 3. 后续优化方向

- 接入更多菜品数据
- 用户自定义菜品功能
- 分享推荐结果
- PWA 离线支持
