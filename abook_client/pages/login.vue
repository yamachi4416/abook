<template>
  <DefaultLayout :hide-footer="true">
    <template #title>
      {{ $t(`pages.others.login.title`) }}
    </template>

    <div class="login">
      <button class="button" @click.once="login()" />
    </div>
  </DefaultLayout>
</template>

<script>
export default {
  methods: {
    login () {
      this.$flashattrs.setAttr('login', true)
      this.$router.replace('/')
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  margin: 0;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  .button {
    cursor: pointer;
    background-color: var(--them-background);
    background-image: url("~static/login.png");
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    height: 300px;
    width: 300px;
    border: none;
    outline: none;
  }
}
</style>
