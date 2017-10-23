<template>
  <div class="container">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
@import "~main";
.container {
  overflow-x: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  max-width: 420px;
  left: 50%;
  transform: translateX(-50%);
  box-sizing: border-box;
  font: $REGULAR;
  color: $PINK;
}
</style>
