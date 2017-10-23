<template>
  <div class="page">
    <container>
      <div class="header">
        Verfasse:
      </div>
      <div class="statement" @click="focus(null)">
        {{before}}
        <span contenteditable="true" ref='input' @input="change($event)">&nbsp;</span>&#8203;<span v-if="noWhiteSpace">&nbsp;</span>{{after && after.replace(/^ /, '')}}
      </div>
      <div class="length" v-if="decided === true">
        <span :class="{tomuch: length > 120}">{{length}}</span> / 120
      </div>
      <div class="bottom" v-if="decided !== true">
        <div class="templates">
          Oder aus Vorlage:
          <div class="template" v-for="template in templates" @click="focus(template)">
            {{template[0]}}
            <span class="ellipsis">…</span>
            {{template[1]}}
          </div>
        </div>
      </div>

      <div class="submit-wrapper skip" v-if="decided === true && $store.state.skipped < 3 && $store.state.didSubmit">
        <input class="submit" type="button" @click="skip" value="überspringen">
      </div>
      <div class="submit-wrapper" v-if="decided === true">
        <input class="submit" type="button" :disabled="submitDisabled" @click="commit" value="Posten!">
      </div>
    </container>
  </div>
</template>

<script>
import Container from 'components/Container'
import fetch from 'unfetch'

export default {
  components: {
    Container
  },
  data () {
    return {
      statement: '&nbsp',
      before: 'Eigenes Statement…',
      after: '',
      decided: false
    }
  },
  mounted () {
    if (this.$store.state.didSubmit) {
      // this.decided = true
      this.focus()
    }
  },
  methods: {
    commit (e) {
      e.preventDefault()
      let statement = this.statement.replace(/&nbsp;?/g, '').replace(/<.*>/g, ' ')
      fetch(`${this.$store.state.api}/statement`,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify({user: this.$store.state.id, text: `${this.before}${statement}${this.after}`})
        }).then(() => {
          this.$store.commit('SUBMITTED')
          this.$store.commit('RESET_COUNTER')
          this.$store.commit('RESET_SKIPPED')
          if (this.$store.state.deviceType === 'private') {
            this.$router.push('rate')
          } else {
            this.$router.push('signout')
          }
        })
    },
    focus (template) {
      if (this.decided !== true) {
        this.decided = true
        if (template != null) {
          this.before = template[0]
          this.after = template[1]
        } else {
          this.before = ''
          this.after = ''
        }
      }
      this.$refs.input.focus()
    },
    change (e) {
      if (this.$refs.input.innerHTML === '') {
        this.$refs.input.innerHTML = '&nbsp;'
      }
      this.statement = this.$refs.input.innerHTML
    },
    skip () {
      this.$store.commit('SKIPPED')
      this.$store.commit('RESET_COUNTER')
      this.$router.push('rate')
    }
  },
  watch: {
  },
  computed: {
    templates () {
      return this.$store.state.templates.sort(() => (Math.random() - 0.5)).filter((d, i) => i < 3)
    },
    noWhiteSpace () {
      return this.statement.match(/&nbsp;$/) == null
    },
    submitDisabled () {
      return this.statement.replace(/&nbsp;?/g, '').replace(/<.*>/g, '').replace(/\s/g, '').length === 0 || this.length > 120
    },
    length () {
      let statement = this.statement.replace(/&nbsp;?/g, '').replace(/<.*>/g, ' ')
      console.log(`${this.before}${statement}${this.after}`.length)
      return `${this.before}${statement}${this.after}`.length
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
  padding: 16px 8px 112px;
  border: 1px solid $PINK;
  width: calc(100% - 16px);
  box-sizing: border-box;
  font-size: 32px;
  cursor: pointer;

  span {
    outline: none;
    width: 20px;
    height: 20px;
  }

  [contenteditable=true]:empty:before{
    content: attr(placeholder);
    // display: block; /* For Firefox */
  }
}

.bottom {
  // margin-top: -64px;
  width: 100%;

  .slice {
    overflow: visible;
    polygon {
      fill: $YELLOW;
    }
  }

  .templates{
    margin: 16px;
    font-size: 20px;

    .template {
      cursor: pointer;
      margin: 8px -8px 16px;
      padding: 8px 8px 2px 8px;
      border: 1px solid $YELLOW;
      position: relative;
      font-size: 32px;
      // background: #fff;

      .ellipsis {
        padding: 0px 2px;
        color: $PINK;
        background: linear-gradient(0deg, transparent, transparent 6px, $YELLOW 6px, $YELLOW 0)
      }
    }
  }
}

.length {
  color: #777;
  font-size: 20px;
  position: absolute;
  right: 24px;
  margin-top: -32px;
  z-index: -1;
}

.submit-wrapper {
  margin: 16px 8px 0 8px;
  float: left;
  width: calc(50% - 16px);

  &.skip {
    margin-top: 16px;
    input {
      font: $REGULAR;
      padding-top: 6px;
      font-size: 20px;
      margin-right: 16px;
    }

  }
  input {
    width: 100%;
    font: $BOLD;
    height: 56px;
    box-sizing: border-box;
    color: $PINK;
    background: none;
    border: 1px solid $YELLOW;
    outline: none;
    padding: 4px 12px 4px 12px;
    // margin-left: 32px;
    position: relative;

    &:disabled {
      border: 1px solid #CCC;
      color: #CCC;
    }
  }

  .submit-slice {
    position: absolute;
    width: 32px;
    height: 56px;

    polygon {
      fill: $YELLOW;

      &.disabled {
        fill: #ddd;
      }
    }
  }
}
</style>
