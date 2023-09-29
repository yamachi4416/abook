<template>
  <div :class="$style.layout">
    <header>
      <a href="#" @click.prevent="$router.back">Back</a>
      <h2>
        <slot name="title" />
      </h2>
    </header>
    <main>
      <slot />
    </main>
    <footer v-if="$slots.footer">
      <slot name="footer" />
    </footer>
  </div>
</template>

<style module lang="scss">
.layout {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-width: 1000px;
  min-height: 100dvh;
  margin: 0 auto;

  & > header {
    position: sticky;
    top: 0;
    display: flex;
    justify-content: space-between;
    margin: 0;
    text-align: center;

    h2 {
      flex: 1;
      margin: 0;
    }
  }

  & > main {
    flex: 1;
  }

  & > footer {
    position: sticky;
    bottom: 0;
    margin: 0;
  }
}
</style>
