<template>
  <div>
    <Header />
    <Nuxt class="main"/>
    <Footer />
  </div>
</template>
<script>
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
export default {
  components: {
    Header,
    Footer
  },
}
</script>
<style lang="scss" scoped>
.main {
  min-height: calc(100vh - 118px);
}
</style>
