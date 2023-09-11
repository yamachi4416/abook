<template>
  <div>
    <header>
      <h2>
        <slot name="title" />
      </h2>
      <a href="#" @click.prevent="$router.back">Back</a>
    </header>
    <main>
      <slot />
    </main>
    <footer v-if="$slots.footer">
      <slot name="footer" />
    </footer>
  </div>
</template>
