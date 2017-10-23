<template>
  <div class="page">
    <container>
      <div class="info">
        <span class="title">Let's map the gap</span>
        <span class="text">{{info}}</span>
      </div>
      <!-- <svg class="slice" viewBox="0 0 375 48" preserveAspectRatio="none">
        <polygon class="slice" points="0 0 375 0 0 48"></polygon>
      </svg> -->
      <form>
        <input class="user-id" type="text" v-model="user" placeholder="Deine ID*">
        <div class="footnote" v-html="footnote">
        </div>
        <div class="submit-wrapper">
          <svg class="submit-slice" viewBox="0 0 16 56" preserveAspectRatio="none">
            <polygon class="slice" points="0 0 16 0 16 56"></polygon>
          </svg>
          <input class="submit" type="submit" :disabled="user == null || user.length < 1" @click="authenticate" value="WEITER">
        </div>
      </form>
      <br>

    </container>
  </div>
</template>

<script>
import Container from 'components/Container'
import fetch from 'unfetch'

export default {
  data  () {
    return {
      user: null,
      footnote: '*Bekommst du im Podium /<br>in der Gallerie',
      info: 'Melde dich an:'
    }
  },
  components: {
    Container
  },
  created () {
    if (this.$store.state.id != null) {
      this.$router.push('rate')
    }
  },
  methods: {
    authenticate (e) {
      e.preventDefault()
      fetch(`${this.$store.state.api}/authenticate/${this.user}`)
        .then(res => res.json())
        .then(data => {
          console.log(data)
          if (data[0] == null) {
            // this.footnote = ''
            this.info = 'Nochmal, die war ungültig:'
            this.user = null
          } else {
            this.$store.commit('RESET_COUNTER')
            this.$store.commit('SET_ID', data[0]._id)
            this.$router.push('rate')
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~main";

.page {
  .info {
    padding: 16px;
    // background: $YELLOW;

    .title {
      font: $BOLD;
      font-size: 40px;
      margin-bottom: -8px;
      display: block;
    }

    .text {
      font-size: 20px;
    }

  }
  .slice {
    width: 100%;
    height: 48px;

    polygon {
      fill: $YELLOW;
    }
  }
  form {
    // margin-top: -32px;

    input {
      font: $BOLD;
      height: 56px;
      box-sizing: border-box;
      color: $PINK;
      border-radius: 0;

      &.user-id {
        padding: 4px 8px;
        background: #fff;
        border: none;
        border-bottom: 1px solid $YELLOW;
        width: calc(100% - 16px);
        margin: -16px 8px 0px;
        outline: none;

        @include placeholder {
          color: $YELLOW;
        }
      }
      &.submit {
        background: none;
        border: none;
        outline: none;
        padding: 8px 12px;
        margin-left: 32px;
        position: relative;
        border: 1px solid $YELLOW;
        color: $PINK;

        &:disabled {
          border-color: #CCC;
          color: #CCC;
        }
      }
    }

    .submit-wrapper {
      margin: -8px 8px 0 0;
      float: right;
      .submit-slice {
        position: absolute;
        width: 32px;
        height: 56px;

        polygon {
          fill: none;
          // stroke: $PINK;
        }
      }
    }
  }

  .footnote {
    margin: 32px 16px;
    font-size: 20px;
  }
}

.error {
  color: red;
}
</style>
