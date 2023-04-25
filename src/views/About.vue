<template>
  <div class="about">
    <Header title='关于我' />
    <van-divider
      content-position="left"
      :style="{ color: '#39be77', borderColor: '#39be77', padding: '0 16px' }"
    >
      关于本项目
    </van-divider>
    <div class="content">
      <p>随便开发玩玩</p>
      <p><a href="https://github.com/sgr997/daily-cost-boot" target="_blank">项目后端</a></p>
      <p><a href="https://github.com/sgr997/daily-cost" target="_blank">项目前端(不是我写的)</a></p>
    </div>
    <van-divider
      content-position="left"
      :style="{ color: '#39be77', borderColor: '#39be77', padding: '0 16px' }"
    >
      关于我
    </van-divider>
    <div class="content">
      <p><a href="https://blog.goku.top" target="_blank">我的博客</a></p>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header.vue'
export default {
  name: 'About',
  components: {
    Header
  }
}
</script>

<style lang="less">
  .about {
    .content {
      padding: 0 16px;
      font-size: 14px;
      color: rgba(0, 0, 0, .5);
      line-height: 24px;
      p {
        margin-bottom: 10px;
      }
    }
  }
</style>