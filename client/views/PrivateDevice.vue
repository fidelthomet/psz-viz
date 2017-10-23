<template>
</template>

<script>
export default {
  created () {
    this.$store.commit('PRIVATE_DEVICE')
    this.$router.push('Signout')
  }
}
</script>
