<template>
  <div class="network">
    <svg width="100%" height="100%" ref="all" @mousemove="mousemove">
      <radialGradient id="yellow">
        <stop offset="0%" stop-opacity="1" stop-color="rgba(255,255,255, 1)"/>
        <stop offset="100%" stop-opacity="0" stop-color="rgba(255,255,255, 1)"/>
      </radialGradient>
      <radialGradient id="gradient">
        <stop offset="0%" stop-opacity="0.5" stop-color="rgba(255,255,255, 1)"/>
        <stop offset="100%" stop-opacity="0" stop-color="rgba(255,255,255, 1)"/>
      </radialGradient>
      <g :transform="transform" ref="group">
        <transition name="fade">
        <g v-if="visible">
        <g>
          <!-- <path v-for="link in elLinks" :class="link.type" :d="`M${link.source.x} ${link.source.y} Q ${width/2} ${height/2} ${link.target.x} ${link.target.y}`" stroke="black" fill="transparent"/> -->
          <line v-for="link in elLinks" v-if="(focused === null && showLines) || (focused !== null && (focused._id === link.target._id || focused._id === link.source._id))" :style="{opacity: focused === null ? 0.1 : 0.75}" :stroke-width="strokeWidth" :class="link.type" :x1="link.source.x" :y1="link.source.y" :x2="link.target.x" :y2="link.target.y"/>
        </g>
        <g>
          <circle class="statement-circle" :fill="node.fill" :style="{opacity: node.opacity}" v-for="node in elNodes" v-if="node.type !== 'user'" @click="focus(node)" @mouseover="highlight(node)" @mouseleave="highlight(null)" :r="((node.controversityNorm12) || 4) / throttledZoom" :cx="node.x || 0" :cy="node.y || 0"/>
        </g>
        <g>
          <g v-for="node in elNodes" v-if="node.type === 'user'" @mouseover="text = node.text" @mousleave="text = null" :transform="'translate(' + (node.x || 0) + ' ' + (node.y || 0) + ')'">
            <circle :style="{opacity: node.opacity}" stroke="url(#yellow)" class="user-circle" :r="node.r * 64 / throttledZoom" :stroke-width="node.r * 64 / throttledZoom" @mouseover="highlight(node)" @mouseleave="highlight(null)"/>
            <!-- <circle v-else :style="{opacity: node.opacity}" fill="url(#gradient)" class="user-circle-filled" :r="8  / throttledZoom" :stroke-width="0" @mouseover="highlight(node)" @mouseleave="highlight(null)"/> -->
            <g class="text" :class="{'right-align': node.textAlign === 'right' }" :transform="`rotate(${node.textDeg || 0})`">
              <text :style="{'font-size': `${node.fontSize * 40 / throttledZoom}px`, opacity: (node.engaged || focused != null) ? node.opacity : 0.4}" class="user" filte="url(#blur-text)" :y="node.r * 10 / throttledZoom" :x="(node.textAlign !== 'right' ? (node.r * 32 + 8) : (-node.r * 32 - 8)) / throttledZoom">{{node.text}}</text>
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
  mixins: [require('vue-mixins/onWindowResize'), require('vue-mixins/getViewportSize')],
  data () {
    return {
      width: this.getViewportSize().width,
      height: this.getViewportSize().height,
      elLinks: this.links, // .filter((l, i) => l.value > 0),
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
      showLines: true
    }
  },
  mounted () {
    this.simulation
      .nodes(this.elNodes)
      .on('end', this.ticked)
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))

    this.simulation.force('link')
      .links(this.elLinks)
    // this.simulation.alphaTarget(0.5)
    // .restart()

    this.onWindowResize(() => {
      let vs = this.getViewportSize()
      this.width = vs.width
      this.height = vs.height

      this.simulation.force('center', d3.forceCenter(vs.width / 2, vs.height / 2))

      this.ticked()
      // this.simulation
      //   .nodes(this.elNodes)
      //
      // this.simulation.force('link')
      //   .links(this.elLinks)

        // this.simulation.alphaTarget(0.1).restart()

        // console.log('updateupdateupdateupdate')
    })
    // console.log(this.elLinks)
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
    mousemove: _.throttle(
      function (e) {
        // if (this.visible === false) return
        // this.nodes
        //   .filter(node => node.type === 'user')
        //   .forEach(node => {
        //     let textDeg = Math.atan2(node.y - (e.clientY), node.x - (e.clientX)) * 180 / Math.PI
        //     if (textDeg < -90 || textDeg > 90) {
        //       node.textDeg = textDeg + 180
        //       node.textAlign = 'right'
        //     } else {
        //       node.textDeg = textDeg
        //       node.textAlign = 'left'
        //     }
        //   })
        // this.$forceUpdate()
      }, 30),
    highlight (node) {
      if (this.showLines === false) return
      if (this.clicked && node == null) return
      if (this.settings.autoZoom === 'off') {
        this.focused = node
        let linkedLinks = this.focused == null ? [] : this.links.filter((link) => this.focused._id === link.target._id || this.focused._id === link.source._id)
        this.nodes.forEach(n => {
          n.opacity = this.checkOpacity(n, linkedLinks)
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
    checkOpacity (node, links) {
      if (this.focused == null || this.focused._id === node._id) return 1

      let linked = links.find(link => (node._id === link.source._id) || (node._id === link.target._id))
      if (linked != null) return 1

      return 0.2
    },
    zoomed () {
      this.showLines = false
      this.zoom = d3.event.transform.k
      this.transform = `translate(${d3.event.transform.x} ${d3.event.transform.y}) scale(${d3.event.transform.k})`
    },
    zoomended () {
      this.showLines = true
      if (d3.event.sourceEvent != null) return
      // console.log('ended')
    },
    focus (node) {
      this.focused = node

      console.log(node)
      if (this.settings.autoZoom === 'off') {
        this.clicked = true
      } else {
        let linkedLinks = this.focused == null ? [] : this.links.filter((link) => this.focused._id === link.target._id || this.focused._id === link.source._id)
        this.nodes.forEach(n => {
          n.opacity = this.checkOpacity(n, linkedLinks)
        })
        d3.select(this.$refs.all).transition().duration(this.settings.transition).call(this.d3Zoom.transform, d3.zoomIdentity.translate(this.width / 2 - node.x * this.settings.maxZoom, this.height / 2 - node.y * this.settings.maxZoom).scale(this.settings.maxZoom))
        // this.simulation.force('center', d3.forceCenter(node.x, node.y))
      }
    },
    resetZoom () {
      let zoom = 1.8

      // if (this.settings.autoMinZoom) {
      //   let bbox = this.$refs.group.getBBox()
      //
      //   let maxX = Math.max(-bbox.x + this.width / 2, bbox.x + bbox.width - this.width / 2)
      //   let maxY = Math.max(-bbox.y + this.height / 2, bbox.y + bbox.height - this.height / 2)
      //
      //   let zoomX = (this.width / 2) / (maxX)
      //   let zoomY = (this.height / 2) / (maxY)
      //
      //   zoom = Math.min(zoomX, zoomY) * 0.95
      // }

      d3.select(this.$refs.all).transition().duration(this.settings.transition).call(this.d3Zoom.transform, d3.zoomIdentity.translate(this.width / 2 - this.width / 2 * zoom, this.height / 2 - this.height / 2 * zoom).scale(zoom))

      this.d3Zoom.on('end', () => {
        setTimeout(() => {
          this.nodes.forEach(n => {
            n.opacity = 1
          })
          // this.focused = null
          this.showLines = true
        }, 1000)
        this.d3Zoom.on('end', () => {
          this.showLines = true
        })
      })
    },
    throttleZoom:
      _.throttle((_this) => {
        // console.log(_this.throttledZoom)
        _this.throttledZoom = _this.zoom
      }, 20)
    // }
  },
  computed: {
    simulation () {
      // var collide = bboxCollide(function (d, i) {
      //   if (d.type !== 'user') return [[-1, -1], [1, 1]]
      //   return [[-d.text.length * 12, -24], [d.text.length * 12, 24]]
      //   // return [[-d.value * 10, -d.value * 5], [d.value * 10, d.value * 5]]
      // })
      // .strength(1)
      // .iterations(2)

      return d3.forceSimulation()
        .force('link', d3.forceLink()
          .id(function (d) { return d._id })
          .strength(d => d.type === 'like' ? 1 : d.type === 'dislike' ? 0.01 : 0.5)
          .distance(70)
        )
        // .force('collide',
        //   d3.forceCollide()
        //     .radius(function (d) { return d.type === 'user' ? 40 : (d.controversityNorm * 32 || 4) })
        //     .iterations(2)
        // )
        .force('charge', d3.forceManyBody()
          .strength((a, b, c) => {
            // console.log(a, b, c)
            return a.type === 'user' ? -48 : (-8 * a.controversityNorm || -4)
          })
          // .theta((a, b, c) => {
          //   console.log('aaa')
          //   console.log(a, b, c)
          //   return 0.9
          // })
          // .force('charge', (node, a, b) => {
          //   console.log(node, a, b)
          //   // console.log()
          //   return d3.forceManyBody(node)
          // }
          // .strength(-75)  // -1000
          // .distanceMax([500])
          // .distanceMin([1])
        )
        // .force('center', d3.forceCenter(this.width / 2, this.height / 2))
        // .on('tick', this.ticked)
        // .on("tick", this.tick)
        // .force('collide', collide)
    },
    strokeWidth () {
      return 1 / this.throttledZoom
    }
    // weightScale () {
    //   return d3.scaleLinear()
    //     .domain(this.extent)
    //     .range([0, 0.01])
    // },
    // extent () {
    //   return d3.extent(this.elLinks, l => l.value)
    // }
  },
  watch: {
    links () {
      this.simulation
        .nodes(this.elNodes)

      this.simulation.force('link')
        .links(this.elLinks)

      // this.simulation.alpha(0.1).restart()
      // this.simulation.force('center', d3.forceCenter(this.width / 2, this.height / 2))

      // console.log('updateupdateupdateupdate')
    },
    zoom () {
      // console.log('here')
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
    // fill: $PINK;
    // stroke-width: 32px;
    fill: none;
    pointer-events: fill;
    // stroke: #fff;
  }
  .user-circle-filled {
    pointer-events: fill;
    stroke: none;
  }
  .statement-circle {
    // fill: $YELLOW;
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
    // text-anchor: middle;
    &.user-shadow {
      fill: #000;
      stroke: #000;
      stroke-width: 2px;
    }
  }
  line, path {
    pointer-events: none;
    opacity: .3;
    // stroke-width: 1;
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
  // pointer-events: none;
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
      // line-height: 96px;
    }
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0
}
</style>
