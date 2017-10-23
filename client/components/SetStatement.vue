<template>
  <div class="list">
    <br>
    Statement<br>
    <form>
      <textarea v-model="statement"rows="8" cols="80"></textarea>
      <br>
      <input type="submit" @click="commit" value="senden">
    </form>

  </div>
</template>

<script>
import fetch from 'unfetch'

export default {
  props: ['statements'],
  data () {
    return {
      statement: null
    }
  },
  methods: {
    commit () {
      fetch(`${this.$store.state.api}/statement`,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify({user: this.$store.state.id, text: this.statement})
        }).then(() => {
          this.$store.commit('RESET_COUNTER')
          this.$router.push('rate')
        })
    }
  },
  computed: {
    count () {
      return this.$store.state.count
    }
  }
}
</script>

<style>
</style>
