<template>
</template>

<script>
export default {
  created () {
    this.$store.commit('RESET')
    this.$router.push('auth')
  }
}
</script>
