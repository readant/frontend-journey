# 07. 响应式设计

## 7.1 视口设置

### viewport meta 标签
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### viewport 参数说明
| 参数 | 说明 | 取值 |
|-----|------|------|
| `width` | 视口宽度 | `device-width` 或具体值 |
| `height` | 视口高度 | `device-height` 或具体值 |
| `initial-scale` | 初始缩放比 | `1.0` |
| `minimum-scale` | 最小缩放比 | `0.5` |
| `maximum-scale` | 最大缩放比 | `3.0` |
| `user-scalable` | 是否允许用户缩放 | `yes`, `no` |

> [!warning] 注意
> - `width=device-width` 必须设置，否则移动端不会自适应
> - 不推荐 `user-scalable=no`，影响可访问性
> - 微信/QQ 等内置浏览器需要额外适配

---

## 7.2 媒体查询

### 基础语法
```css
@media media-type and (media-feature) {
    /* 样式 */
}
```

### 媒体类型
| 类型 | 说明 |
|-----|------|
| `all` | 所有媒体（默认） |
| `screen` | 屏幕 |
| `print` | 打印 |
| `speech` | 屏幕阅读器 |

### 媒体特性
| 特性 | 说明 | 示例 |
|-----|------|------|
| `width` | 视口宽度 | `(width: 768px)` |
| `min-width` | 最小宽度 | `(min-width: 768px)` |
| `max-width` | 最大宽度 | `(max-width: 768px)` |
| `height` | 视口高度 | `(height: 600px)` |
| `orientation` | 屏幕方向 | `(orientation: portrait)` |
| `resolution` | 分辨率 | `(resolution: 2dppx)` |
| `aspect-ratio` | 宽高比 | `(aspect-ratio: 16/9)` |

### 逻辑操作符
| 操作符 | 说明 | 示例 |
|-------|------|------|
| `and` | 与 | `screen and (min-width: 768px)` |
| `or` (或 `,`) | 或 | `screen, print` |
| `not` | 非 | `not print` |
| `only` | 仅 | `only screen and (max-width: 600px)` |

> [!tip] `only` 的作用
> 防止老旧浏览器（不支持媒体查询的）错误应用样式
> 实际开发中通常省略

### 示例
```css
/* 移动端 */
@media screen and (max-width: 767px) {
    .container { padding: 10px; }
    .sidebar { display: none; }
}

/* 平板 */
@media screen and (min-width: 768px) and (max-width: 1023px) {
    .container { padding: 20px; }
}

/* 桌面 */
@media screen and (min-width: 1024px) {
    .container { max-width: 1200px; margin: 0 auto; }
}

/* 打印样式 */
@media print {
    .no-print { display: none; }
    body { color: black; background: white; }
}
```

---

## 7.3 断点策略

### 移动优先
```css
/* 默认：移动端样式 */
.container { padding: 10px; }

/* 平板 */
@media (min-width: 768px) {
    .container { padding: 20px; }
}

/* 桌面 */
@media (min-width: 1024px) {
    .container { padding: 30px; }
}
```

### 桌面优先
```css
/* 默认：桌面端样式 */
.container { padding: 30px; }

/* 平板 */
@media (max-width: 1023px) {
    .container { padding: 20px; }
}

/* 移动端 */
@media (max-width: 767px) {
    .container { padding: 10px; }
}
```

### 常用断点
| 设备类型 | 断点范围 | 说明 |
|---------|---------|------|
| 手机 | < 768px | iPhone / Android |
| 平板 | 768px - 1023px | iPad 等 |
| 桌面 | ≥ 1024px | 笔记本 / PC |
| 大屏 | ≥ 1440px | 高清屏 |

> [!tip] 建议
> - 使用 **Mobile First** 策略
> - 不要为了特定设备设置断点
> - 让内容决定断点（从宽到窄测试，找到断点）
> - 结合 Flexbox / Grid 实现流式布局

---

## 7.4 容器查询

### 基础概念
容器查询是根据**容器尺寸**而非视口尺寸来调整样式。

```css
.card-container {
    container-type: inline-size;
    container-name: card;
}

@container card (min-width: 400px) {
    .card {
        display: flex;
        flex-direction: row;
    }
}

@container card (max-width: 399px) {
    .card {
        display: flex;
        flex-direction: column;
    }
}
```

---

## 速查语法

### viewport 设置
<meta name="viewport" content="width=device-width, initial-scale=1.0">

### 媒体查询
```css
@media screen and (min-width: 768px) { ... }
@media screen and (max-width: 767px) { ... }
```

### 逻辑操作符
and / or(,) / not / only

### 断点策略
- Mobile First: 默认移动端, min-width 向上
- Desktop First: 默认桌面端, max-width 向下
- 常用断点: 768px / 1024px / 1440px

### 容器查询
```css
.container { container-type: inline-size; }
@container (min-width: 400px) { ... }
```

### 响应式工具
- clamp(min, ideal, max) 响应式字号
- repeat(auto-fit/fill, minmax(min, 1fr)) 自适应网格
- srcset/sizes 响应式图片
