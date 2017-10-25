<template>
  <div class="network">
    <svg width="100%" height="100%" ref="all">
      <radialGradient id="gradient">
        <stop offset="0%" stop-opacity="1" stop-color="rgba(255,255,255, 1)"/>
        <stop offset="100%" stop-opacity="0" stop-color="rgba(255,255,255, 1)"/>
      </radialGradient>
      <g :transform="transform" ref="group">
        <transition name="fade">
        <g v-if="visible" :transform="`translate(${offset / 1.8} 0)`">
        <g>
          <line v-for="link in elLinks" v-if="showLink(link)"
            :class="link.type" :style="{opacity: focused === null ? 0.1 : 0.75}" :stroke-width="strokeWidth"
            :x1="link.source.x" :y1="link.source.y" :x2="link.target.x" :y2="link.target.y"/>
        </g>
        <g>
          <circle class="statement-circle"
            v-for="node in elNodes" v-if="node.type !== 'user'"
            :fill="node.fill" :style="{opacity: node.opacity}"
            :r="((node.controversityNorm12) || 4) / throttledZoom" :cx="node.x || 0" :cy="node.y || 0"
            @click="focus(node)" @mouseover="highlight(node)" @mouseleave="highlight(null)"/>
        </g>
        <g>
          <g v-for="node in elNodes" v-if="node.type === 'user'"
            :transform="`translate(${node.x || 0} ${node.y || 0})`"
            @mouseover="text = node.text" @mousleave="text = null">

            <circle class="user-circle" :style="{opacity: node.opacity}" stroke="url(#gradient)"
              :r="node.r * 64 / throttledZoom" :stroke-width="node.r * 64 / throttledZoom"
              @mouseover="highlight(node)" @mouseleave="highlight(null)"/>

            <g class="text" :class="{'right-align': node.textAlign === 'right' }"
              :transform="`rotate(${node.textDeg || 0})`">

              <text class="user" :style="getTextStyle(node)"
                :y="node.r * 10 / throttledZoom" :x="(node.textAlign !== 'right' ? (node.r * 32 + 8) : (-node.r * 32 - 8)) / throttledZoom">
                {{node.text}}</text>
            </g>
          </g>
        </g>
      </g>
      </transition>
      </g>

    </svg>
    <transition name="fade">
      <info-pane v-if="visible && (largeScreen || showPane)"></info-pane>
    </transition>

    <transition name="fade">
      <svg v-if="!largeScreen && visible" class="buttons" width="32px" height="32px" viewBox="0 0 32 32">
        <g fill-rule="nonzero" fill="#FFFFFF" stroke="none">
          <transition name="fade">
            <path v-if="showPane" d="M16,32 C7.163444,32 0,24.836556 0,16 C0,7.163444 7.163444,0 16,0 C24.836556,0 32,7.163444 32,16 C32,24.836556 24.836556,32 16,32 Z M22.363961,20.9497475 L18.1213203,16 L22.363961,11.0502525 L20.9497475,9.63603897 L16,13.8786797 L11.0502525,9.63603897 L9.63603897,11.0502525 L13.8786797,16 L9.63603897,20.9497475 L11.0502525,22.363961 L16,18.1213203 L20.9497475,22.363961 L22.363961,20.9497475 Z" id="Close"></path>
          </transition>
          <transition name="fade">
            <path v-if="!showPane" d="M16,32 C7.163444,32 0,24.836556 0,16 C0,7.163444 7.163444,0 16,0 C24.836556,0 32,7.163444 32,16 C32,24.836556 24.836556,32 16,32 Z M16.7705078,13.1025391 L13,13.9404297 L13,14.7138672 L14.8046875,14.9931641 L13.6230469,20.9121094 C13.5442704,21.3346375 13.49056,21.6515289 13.4619141,21.862793 C13.4332681,22.074057 13.4189453,22.2513014 13.4189453,22.3945312 C13.4189453,22.9531278 13.556802,23.37744 13.8325195,23.6674805 C14.1082371,23.957521 14.5146458,24.1025391 15.0517578,24.1025391 C15.5960314,24.1025391 16.172523,24.0345059 16.78125,23.8984375 C17.389977,23.7623691 18.066728,23.5439468 18.8115234,23.2431641 L18.8115234,22.3408203 C18.4749332,22.4482427 18.1777357,22.527018 17.9199219,22.5771484 C17.6621081,22.6272789 17.4544279,22.6523438 17.296875,22.6523438 C16.9459618,22.6523438 16.6774098,22.550294 16.4912109,22.3461914 C16.3050121,22.1420888 16.2119141,21.8431009 16.2119141,21.4492188 C16.2119141,21.3561193 16.2208658,21.2379564 16.2387695,21.0947266 C16.2566733,20.9514967 16.2871092,20.7653006 16.3300781,20.5361328 L17.7373047,13.1025391 L16.7705078,13.1025391 Z M17.2109375,8 C16.7239559,8 16.3193375,8.15934085 15.9970703,8.47802734 C15.6748031,8.79671383 15.5136719,9.19596114 15.5136719,9.67578125 C15.5136719,10.0839864 15.6515286,10.4169909 15.9272461,10.6748047 C16.2029636,10.9326185 16.5628233,11.0615234 17.0068359,11.0615234 C17.4794946,11.0615234 17.8769515,10.9021826 18.1992188,10.5834961 C18.521486,10.2648096 18.6826172,9.87272368 18.6826172,9.40722656 C18.6826172,8.97753691 18.5501315,8.6355807 18.2851562,8.38134766 C18.020181,8.12711461 17.6621116,8 17.2109375,8 Z" id="Info"></path>
          </transition>
          <circle style="pointer-events: all" fill="none" @click="showPane = !showPane" cx="16" cy="16" r="16"></circle>
        </g>
      </svg>
    </transition>
    <br>
    <transition name="fade">
      <div class="focus" v-if="focused && focused.type === 'statement' && ((throttledZoom > settings.maxZoom - 0.2 && settings.autoZoom !== 'off') || clicked)" :style="{'border-color': focused.fill, color: focused.fill}" @click="blur">
        <div class="text">
          <span class="author">{{focused.author}}:</span>
          <br>
          {{focused.text}}
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import * as d3 from 'd3'
import _ from 'lodash'

import InfoPane from 'components/InfoPane'

export default {
  mixins: [require('vue-mixins/onWindowResize'), require('vue-mixins/getViewportSize')],
  components: {
    InfoPane
  },
  props: ['links', 'nodes', 'settings'],
  data () {
    return {
      width: this.getViewportSize().width,
      height: this.getViewportSize().height,
      elLinks: this.links,
      elNodes: this.nodes,
      text: null,
      transform: 'scale(1) translate(0 0)',
      zoom: 1,
      focused: null,
      d3Zoom: d3.zoom().on('zoom', this.zoomed).on('end', this.zoomended),
      auto: true,
      autoPause: 2000,
      lastFocus: null,
      clicked: false,
      visible: false,
      throttledZoom: 1,
      showLinks: true,
      showPane: false
    }
  },
  mounted () {
    this.simulation
      .nodes(this.elNodes)
      .on('end', this.ticked)
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))

    this.simulation.force('link')
      .links(this.elLinks)

    d3.select(this.$refs.all)
      .call(this.d3Zoom)
      .on('dblclick.zoom', () => {
        this.resetZoom()
      })
      .on('mouseup.end dblclick.end wheel.end touchstart.end touchend.end touchcancel.end', null)

    setTimeout(() => {
      this.resetZoom()
      let statements = this.elNodes.filter(n => n.type === 'statement')
      this.focus(statements[Math.floor(Math.random() * statements.length)])
    }, 100)

    this.onWindowResize(() => {
      this.width = this.getViewportSize().width
    })
  },
  methods: {
    ticked () {
      this.nodes
        .filter(node => node.type === 'user')
        .forEach(node => {
          let textDeg = Math.atan2(node.y - (this.height / 2), node.x - (this.width / 2)) * 180 / Math.PI
          if (textDeg < -90 || textDeg > 90) {
            node.textDeg = textDeg + 180
            node.textAlign = 'right'
          } else {
            node.textDeg = textDeg
            node.textAlign = 'left'
          }
        })

      this.$forceUpdate()
      this.visible = true
      this.blur()
    },
    showLink (link) {
      if (this.focused === null && this.showLinks === false) return false
      if (this.focused === null) return true
      return (this.focused._id === link.target._id || this.focused._id === link.source._id)
    },
    getTextStyle (node) {
      return {
        'font-size': `${node.fontSize * 40 / this.throttledZoom}px`,
        opacity: (node.engaged || this.focused != null || this.$store.state.filter !== null) ? node.opacity : 0.4
      }
    },
    highlight (node) {
      if (this.showLinks === false) return
      if (this.clicked && node == null) return
      if (this.settings.autoZoom === 'off') {
        this.focused = node
        this.nodes.forEach(n => {
          n.opacity = this.getOpacity(n)
        })
      }
    },
    blur () {
      this.clicked = false
      this.focused = null
      this.nodes.forEach(n => {
        n.opacity = 1
      })
    },
    getOpacity (node) {
      if (this.focused == null || this.focused._id === node._id) return 1

      let linked = this.linkedLinks.find(link =>
        (node._id === link.source._id) || (node._id === link.target._id)
      )

      if (linked != null) return 1
      return 0.2
    },
    zoomed () {
      this.showLinks = false
      this.zoom = d3.event.transform.k
      this.transform = `translate(${d3.event.transform.x} ${d3.event.transform.y}) scale(${d3.event.transform.k})`
    },
    zoomended () {
      this.showLinks = true
      if (d3.event.sourceEvent != null) return
    },
    focus (node) {
      this.focused = node
      this.clicked = true
    },
    resetZoom () {
      let zoom = 1.8

      d3.select(this.$refs.all).transition().duration(this.settings.transition).call(this.d3Zoom.transform, d3.zoomIdentity.translate(this.width / 2 - this.width / 2 * zoom, this.height / 2 - this.height / 2 * zoom).scale(zoom))

      this.d3Zoom.on('end', () => {
        setTimeout(() => {
          this.nodes.forEach(n => {
            n.opacity = 1
          })

          this.showLinks = true
        }, 1000)
        this.d3Zoom.on('end', () => {
          this.showLinks = true
        })
      })
    },
    throttleZoom:
      _.throttle((_this) => {
        _this.throttledZoom = _this.zoom
      }, 20)
  },
  computed: {
    simulation () {
      return d3.forceSimulation()
        .force('link', d3.forceLink()
          .id(function (d) { return d._id })
          .strength(d => d.type === 'like' ? 1 : d.type === 'dislike' ? 0.01 : 0.5)
          .distance(70)
        )
        .force('charge', d3.forceManyBody()
          .strength((a, b, c) => {
            return a.type === 'user' ? -48 : (-8 * a.controversityNorm || -4)
          })
        )
    },
    largeScreen () {
      return this.width > 1000
    },
    strokeWidth () {
      return 1 / this.throttledZoom
    },
    linkedLinks () {
      if (this.focused == null) return []
      return this.links.filter(link =>
        this.focused._id === link.target._id || this.focused._id === link.source._id
      )
    },
    offset () {
      return this.width <= 1000 ? 0 : 320 / 2
    }
  },
  watch: {
    links () {
      this.simulation
        .nodes(this.elNodes)
      this.simulation.force('link')
        .links(this.elLinks)
    },
    zoom () {
      this.throttleZoom(this)
    },
    '$store.state.filter' (filter) {
      this.nodes.forEach(n => {
        if (filter === null) n.opacity = 1

        else if (
          (filter === 'controversity-high' && n.controversityNorm > 0.66) ||
          (filter === 'controversity-mid' && n.controversityNorm <= 0.66 && n.controversityNorm > 0.33) ||
          (filter === 'controversity-low' && n.controversityNorm <= 0.33) ||

          (filter === 'rating-positiv' && n.rating > 0.8) ||
          (filter === 'rating-mid-positiv' && n.rating <= 0.8 && n.rating > 0.6) ||
          (filter === 'rating-mid' && n.rating <= 0.6 && n.rating > 0.4) ||
          (filter === 'rating-mid-negative' && n.rating <= 0.4 && n.rating > 0.2) ||
          (filter === 'rating-negative' && n.rating < 0.2) ||

          (filter === 'engagement-high' && n.r > 0.5) ||
          (filter === 'engagement-mid' && n.r <= 0.5 && n.r > 0.25) ||
          (filter === 'engagement-low' && n.r <= 0.25)
        ) n.opacity = 1

        else n.opacity = 0.2
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~main";

svg {
  background: #060021;
  position: fixed;
  .user-circle {
    fill: none;
    pointer-events: fill;
  }
  .user-circle-filled {
    pointer-events: fill;
    stroke: none;
  }
  .statement-circle {
    cursor: pointer;
  }
  .text {
    &.right-align {
      text-anchor: end;
    }
  }
  text {
    pointer-events: none;
    font: $REGULAR;
    fill: #FFF;

    &.user-shadow {
      fill: #000;
      stroke: #000;
      stroke-width: 2px;
    }
  }
  line {
    pointer-events: none;
    opacity: .3;

    &.like {
      stroke: $YELLOW;
    }
    &.author {
      stroke: #fff;
    }
    &.dislike {
      stroke: $PINK;
    }
  }
  path, text, circle {
    transition: opacity 0.4s;
  }
}
.focus {
  position: absolute;
  z-index: 100;

  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  background: rgba(0,0,0,.75);

  cursor: pointer;

  font: $REGULAR;
  color: $PINK;

  .text {
    pointer-events: none;
    position: absolute;
    left: 50%;
    top: 50%;

    line-height: normal;
    font-size: 32px;
    transform: translate(-50%, -50%);
    max-width: 540px;
    width: 100%;

    text-align: center;
    text-shadow: 0px 0px 12px black;

    .author {
      color: #fff;
      white-space: nowrap;

    }
  }
}

.buttons {
  position: absolute;
  right: 16px;
  top: 16px;
  background: none;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to {
  opacity: 0
}
</style>
