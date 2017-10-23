<template>
</template>

<script>
export default {
  created () {
    this.$store.commit('PUBLIC_DEVICE')
    this.$router.push('Signout')
  }
}
</script>
