declare module '*.vue' {
  import type { ComponentOptions } from 'vue'
  const component: ComponentOptions
  export default component
}

declare module '*.md' {
  import type { ComponentOptions } from 'vue'
  const component: ComponentOptions
  export default component
}

declare module '*.md?raw' {
  const content: string
  export default content
}

declare module '*?raw' {
  const content: string
  export default content
}
