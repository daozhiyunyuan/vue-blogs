import Vue from 'vue'
import VueI18n from 'vue-i18n'
import en_us from './locale/en-US'
import zh_cn from './locale/zh-CN'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'zh-CN', // 语言标识
  messages: {
    'zh-CN': zh_cn,
    'en-US': en_us
  }
})
export default i18n