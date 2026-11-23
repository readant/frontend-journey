<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style lang="less">
@import '@/styles/variables.less';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 不要给 body / #app 写死 height: 100%。
   写死之后 #app 的高度被锁在视口高度，内容超出的部分变成"挂在盒子外面"，
   滚动到底部时会出现多余空白、粘性页眉也可能提前失效。
   用 min-height 让容器随内容自然增高。 */
html,
body {
  min-height: 100%;
}

#app {
  min-height: 100vh;
  min-height: 100dvh;
  /* 必须走 --font-sans：
     这里原来写的是 -apple-system / Segoe UI / Arial 一串纯西文字体，
     中文没有对应字形，会被浏览器回落到系统默认宋体，
     于是"无衬线设计"实际渲染成了衬线，全站字重和气质都跑偏。 */
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>