<template>
  <div class="settings">
    <div v-if="maxZoom">
      Einstellungen<br>
      <div class="option">
        Zoom nah: {{maxZoom}}<br>
        <input type="range" class="range" v-model="maxZoom" max="8" min="1" step="0.1">
      </div>
      <div class="option">
        Zoom fern: <span :style="{color: autoMinZoom ? '#aaa' : 'inherit'}">{{minZoom}}</span>
        <input type="checkbox" id="autoMinZoom" v-model="autoMinZoom"><label for="autoMinZoom">automatisch ermitteln</label><br>
        <input type="range" class="range" v-model="minZoom" max="2" min="0.05" step="0.05" :disabled="autoMinZoom">
      </div>
      <div class="option">
        Auto-Zoom:<br>
        <input type="radio" name="autozoom" id="autozoom-off" value="off" v-model="autoZoom"><label for="autozoom-off">Aus</label>
        <input type="radio" name="autozoom" id="autozoom-slow" value="slow" v-model="autoZoom"><label for="autozoom-slow">Langsam</label>
        <input type="radio" name="autozoom" id="autozoom-medium" value="medium" v-model="autoZoom"><label for="autozoom-medium">Mittel</label>
        <input type="radio" name="autozoom" id="autozoom-fast" value="fast" v-model="autoZoom"><label for="autozoom-fast">Schnell</label>
      </div>
      <div class="option">
        Detail-Zoom Dauer: {{wait}}s
        <input type="range" class="range" v-model="wait" max="15" min="2" step="0.1">
      </div>
      <div class="option">
        Transition Dauer: {{transition}}s
        <input type="range" class="range" v-model="transition" max="6" min="0.4" step="0.1">
      </div>
      <div class="option">
        <input type="button" name="" value="Aktualisieren" @click="update">
      </div>
    </div>
    <div v-else>Warten...</div>
  </div>
</template>

<script>
import fetch from 'unfetch'

export default {
  data () {
    return {
      maxZoom: null,
      minZoom: 0.5,
      autoZoom: 'off',
      wait: 5000,
      transition: 2000,
      autoMinZoom: true
    }
  },
  methods: {
    update () {
      let settings = {
        maxZoom: +this.maxZoom,
        minZoom: +this.minZoom,
        autoMinZoom: this.autoMinZoom,
        autoZoom: this.autoZoom,
        wait: +this.wait * 1000,
        transition: +this.transition * 1000
      }

      fetch(`${this.$store.state.api}/settings`,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify({settings})
        })
        .then(res => res.json())
        .then(data => {
          console.log(data)
        })
    }
  },
  created () {
    fetch(`${this.$store.state.api}/settings`) // http://psz.ft0.ch/api/all
      .then(res => res.json())
      .then(settings => {
        console.log(settings)

        this.maxZoom = settings.maxZoom
        this.minZoom = settings.minZoom
        this.autoZoom = settings.autoZoom
        this.wait = settings.wait / 1000
        this.transition = settings.transition / 1000
      })
  }
}
</script>
<style lang="scss" scoped>
.settings {
  font-family: monospace;
  padding: 16px;
  box-sizing: border-box;
  width: 100%;

  .option {
    margin: 8px 0px;
    width: 100%;

    input {
      &.range {
        width: 100%;
      }
    }
  }
}
</style>
