<template>
  <div>
    <Header class="header"/>
    <div class="main" >
      <Nuxt />
    </div>
    <Footer class="footer"/>
  </div>
</template>
<script>
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
export default {
  components: {
    Header,
    Footer,
  },
};
</script>
<style lang="scss" scoped>
.main {
  min-height: calc(100vh - 151px);
  background-color: #f4f5f5;
  padding-bottom: 32px;
}
.header {
  box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
}
.footer {
  box-shadow: 0 -1px 2px 0 rgba(0,0,0,.05);
}
</style>
