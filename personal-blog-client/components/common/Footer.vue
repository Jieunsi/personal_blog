<template>
  <div class="footer">
    <div class="site">
      <div>个人博客系统</div>
      <div>© 2022 ChenZhijie</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FooterIndex',
};
</script>

<style scoped lang="scss">
.footer {
  margin-top: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  text-align: center;
  width: 100%;
  border-top: 1px solid #f0f0f0;
  color: #9e9e9e
}

.site div {
  margin: 4px 0;
}

@media screen and (max-width: 540px) {
  .footer {
    flex-direction: column;
    margin: 32px auto;
  }
  .copyright {
    margin-top: 10px;
  }
}
</style>
