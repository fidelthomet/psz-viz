<template>
  <div class="network">
    <svg width="100%" height="100%" ref="all">
      <radialGradient id="gradient">
        <stop offset="0%" stop-opacity="1" stop-color="rgba(255,255,255, 1)"/>
        <stop offset="100%" stop-opacity="0" stop-color="rgba(255,255,255, 1)"/>
      </radialGradient>
      <g :transform="transform" ref="group">
        <transition name="fade">
        <g v-if="visible">
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
            :transform="'translate(' + (node.x || 0) + ' ' + (node.y || 0) + ')'"
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

export default {
  props: ['links', 'nodes', 'settings'],
  mixins: [require('vue-mixins/getViewportSize')],
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
      showLinks: true
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
        opacity: (node.engaged || this.focused != null) ? node.opacity : 0.4
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
    strokeWidth () {
      return 1 / this.throttledZoom
    },
    linkedLinks () {
      if (this.focused == null) return []
      return this.links.filter(link =>
        this.focused._id === link.target._id || this.focused._id === link.source._id
      )
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~main";

svg {
  background: #000;
  position: absolute;
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
  line, path {
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
  background: rgba(0,0,0,.5);

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

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to {
  opacity: 0
}
</style>
