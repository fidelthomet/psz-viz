<template>
  <div class="page">
    <container>
    <div class="header">
      Bewerte:
    </div>
    <div class="statement">
      {{statement}}
    </div>
    <div class="bottom">
      <div class="thumbs">
        <div class="rate like" @click="rate(true)">
          <thumb :up="true"></thumb>
        </div>
        <div class="rate dislike" @click="rate(false)">
          <thumb :up="false"></thumb>
        </div>
      </div>
    </div>
  </container>
  </div>
</template>

<script>
import Container from 'components/Container'
import Thumb from 'components/Thumb'
import fetch from 'unfetch'

export default {
  data () {
    return {
      statement: null,
      statementId: null
    }
  },
  components: {
    Thumb,
    Container
  },
  methods: {
    rate (isLike) {
      fetch(`${this.$store.state.api}/rate`,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify({user: this.$store.state.id, statement: this.statementId, isLike: isLike})
        })
        .then(res => res.json())
        .then(data => {
          this.$store.commit('INCREMENT_COUNTER')
          if (this.$store.state.counter >= this.$store.state.maxCount) {
            this.$router.push('input')
          } else {
            this.getUnrated()
          }
        })
    },
    getUnrated () {
      fetch(`${this.$store.state.api}/unrated/${this.$store.state.id}`)
        .then(res => res.json())
        .then(data => {
          console.log(data)
          if (data[0] != null) {
            this.statement = data[0].text
            this.statementId = data[0]._id
          } else {
            this.$router.push('input')
          }
        })
    }
  },
  created () {
    this.$store.commit('SET_MAX_COUNT')
    if (this.$store.state.counter >= this.$store.state.maxCount) {
      this.$router.push('input')
    } else {
      this.getUnrated()
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~main";

.header {
  color: $YELLOW;
  font: $BOLD;
  margin: 16px;
}

.statement {
  margin: 0 8px;
  padding: 16px 8px 12px;
  border: 1px solid $PINK;
  width: calc(100% - 16px);
  box-sizing: border-box;
  word-break: break-word;
  overflow-wrap: break-word;
  font-size: 32px;
}

.bottom {
  // margin-top: -112px;
  width: 100%;

  .slice {
    overflow: visible;
    polygon {
      fill: $YELLOW;
    }
  }

  .thumbs {
    // background: $YELLOW;
    margin-top: 8px;
    height: 120px;

    .rate {
      border: 1px solid $YELLOW;
      box-sizing: border-box;
      width: calc(50% - 16px);
      margin: 8px 8px 8px 8px;
      float: left;
      // height: 160px;
      padding: 16px;
      cursor: pointer;

      &.dislike {
        margin: 8px 8px 8px 8px;
      }

      // &:hover {
      //   background: $YELLOW;
      // }
    }
  }
}
</style>
