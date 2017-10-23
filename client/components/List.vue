<template>
  <div class="list">
    <div class="statement" v-for="statement in statements">
      {{statement.text}}

      <br>
      {{statement.user}}
    </div>
  </div>
</template>

<script>
export default {
  props: ['statements', 'user'],
  data () {
    return {
      statement: null
    }
  }
}
</script>

<style lang="scss">
  .list {
    .statement {
      margin: 8px;
      padding: 8px;
      border: 1px solid black;
    }
  }
</style>
