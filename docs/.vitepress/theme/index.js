import DefaultTheme from 'vitepress/theme'
import CustomViewsCounter from './components/CustomViewsCounter.vue'
import GoogleSheetData from './components/GoogleSheetData.vue'

import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('CustomViewsCounter', CustomViewsCounter)
    app.component('GoogleSheetData', GoogleSheetData)
  }
}
