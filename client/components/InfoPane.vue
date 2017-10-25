<template>
  <div class="info-pane">
    <div class="container">
      <h1>Let's map the gap</h1>
      <span v-html="text"></span>

      <div class="legend">
        <svg width="296px" height="314px" viewBox="0 0 296 314" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <!-- Generator: Sketch 47.1 (45422) - http://www.bohemiancoding.com/sketch -->
            <desc>Created with Sketch.</desc>
            <defs>
              <radialGradient id="gradient">
                <stop offset="0%" stop-opacity="1" stop-color="rgba(255,255,255, 1)"/>
                <stop offset="100%" stop-opacity="0" stop-color="rgba(255,255,255, 1)"/>
              </radialGradient>
            </defs>
            <g id="Page-2" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="Key" transform="translate(0.000000, -5.000000)">
                    <g id="Links" transform="translate(0.000000, 256.000000)">
                        <g id="Group-6" fill="#FFFFFF">
                            <text id="verfasst" font-family="Roboto-Regular, Roboto" font-size="12" font-weight="normal" line-spacing="16">
                                <tspan x="0.76953125" y="11">verfasst</tspan>
                            </text>
                            <rect id="Link" x="52" y="8" width="236" height="1"></rect>
                            <rect class="hover" x="0" y="0" width="288" height="16" @mouseout="setFilter(null)" @mouseover="setFilter('link-author')"></rect>
                        </g>
                        <g id="Group-6" transform="translate(0.000000, 24.000000)">
                            <text id="positiv-bewertet" font-family="Roboto-Regular, Roboto" font-size="12" font-weight="normal" line-spacing="16" fill="#FFFFFF">
                                <tspan x="0.693359375" y="11">positiv bewertet</tspan>
                            </text>
                            <rect id="Link" fill="#FAED66" x="94" y="8" width="194" height="1"></rect>
                            <rect class="hover" x="0" y="0" width="288" height="16" @mouseout="setFilter(null)" @mouseover="setFilter('link-like')"></rect>
                        </g>
                        <g id="Group" transform="translate(0.000000, 48.000000)">
                            <text id="negativ-bewertet" font-family="Roboto-Regular, Roboto" font-size="12" font-weight="normal" line-spacing="16" fill="#FFFFFF">
                                <tspan x="0.130859375" y="11">negativ bewertet</tspan>
                            </text>
                            <rect id="Link" fill="#FF1E88" x="97" y="8" width="191" height="1"></rect>
                            <rect class="hover" x="0" y="0" width="288" height="16" @mouseout="setFilter(null)" @mouseover="setFilter('link-dislike')"></rect>
                        </g>
                    </g>
                    <g transform="translate(0.000000, 124.000000)">
                        <text id="Bewertungen" font-family="Roboto-Regular, Roboto" font-size="12" font-weight="normal" line-spacing="16" fill="#FFFFFF">
                            <tspan x="0.288085938" y="15">Bewertungen</tspan>
                        </text>
                        <g transform="translate(4.000000, 0)">
                        <path d="M99.5,25 C92.5964406,25 87,19.4035594 87,12.5 C87,5.59644063 92.5964406,0 99.5,0 C106.403559,0 112,5.59644063 112,12.5 C112,19.4035594 106.403559,25 99.5,25 Z M94,11 L94,14 L105,14 L105,11 L94,11 Z"
                          fill="rgb(255, 29, 136)" fill-rule="nonzero"></path>
                        <circle fill="rgb(254, 81, 123)" fill-rule="nonzero" cx="141.5" cy="12.5" r="12.5"></circle>
                        <circle fill="rgb(253, 133, 110)" fill-rule="nonzero" cx="183.5" cy="12.5" r="12.5"></circle>
                        <circle fill="rgb(251, 185, 97)" fill-rule="nonzero" cx="225.5" cy="12.5" r="12.5"></circle>
                        <path d="M267.5,25 C260.596441,25 255,19.4035594 255,12.5 C255,5.59644063 260.596441,0 267.5,0 C274.403559,0 280,5.59644063 280,12.5 C280,19.4035594 274.403559,25 267.5,25 Z M262,11 L262,14 L266,14 L266,18 L269,18 L269,14 L273,14 L273,11 L268.949551,10.9495509 L269,7 L266,7 L266,11 L262,11 Z"
                          fill="rgb(250, 237, 84)" fill-rule="nonzero"></path>

                        <rect class="hover" x="87" width="25" height="25" @mouseout="setFilter(null)" @mouseover="setFilter('rating-negative')" fill="#fff"></rect>
                        <rect class="hover" x="129" width="25" height="25" @mouseout="setFilter(null)" @mouseover="setFilter('rating-mid-negative')" fill="#fff"></rect>
                        <rect class="hover" x="171" width="25" height="25" @mouseout="setFilter(null)" @mouseover="setFilter('rating-mid')" fill="#fff"></rect>
                        <rect class="hover" x="213" width="25" height="25" @mouseout="setFilter(null)" @mouseover="setFilter('rating-mid-positiv')" fill="#fff"></rect>
                        <rect class="hover" x="255" width="25" height="25" @mouseout="setFilter(null)" @mouseover="setFilter('rating-positiv')" fill="#fff"></rect>
                      </g>
                    </g>
                    <g transform="translate(0.000000, 164.000000)">
                        <g id="Group-12" transform="translate(95.000000, 0.000000)">
                            <g id="Group-13">
                                <circle fill="#FC866D" fill-rule="nonzero" cx="4.5" cy="20.5" r="4.5"></circle>
                                <circle fill="#FC866D" fill-rule="nonzero" cx="80.5" cy="20.5" r="12.5"></circle>
                                <circle fill="#FC866D" fill-rule="nonzero" cx="172.5" cy="20.5" r="20.5"></circle>
                                <g fill="#D8D8D8" transform="translate(107.000000, 17.000000)">
                                    <rect id="Tail" fill="#FFFFFF" x="0" y="3" width="28" height="1"></rect>
                                    <polygon id="Head" fill="#FFFFFF" points="31 3.5 28 7 28 0"></polygon>
                                </g>
                                <g transform="translate(23.000000, 17.000000)" fill="#FFFFFF">
                                    <rect id="Tail" x="0" y="3" width="28" height="1"></rect>
                                    <polygon id="Head" points="31 3.5 28 7 28 0"></polygon>
                                </g>

                                <circle id="Oval" class="hover" @mouseout="setFilter(null)" @mouseover="setFilter('controversity-high')" fill-rule="nonzero" cx="172.5" cy="20.5" r="20.5"></circle>
                                <circle id="Oval" class="hover" @mouseout="setFilter(null)" @mouseover="setFilter('controversity-mid')" fill-rule="nonzero" cx="80.5" cy="20.5" r="20.5"></circle>
                                <circle id="Oval" class="hover" @mouseout="setFilter(null)" @mouseover="setFilter('controversity-low')" fill-rule="nonzero" cx="4.5" cy="20.5" r="20.5"></circle>
                            </g>
                        </g>
                        <text font-family="Roboto-Regular, Roboto" font-size="12" font-weight="normal" line-spacing="16" fill="#FFFFFF">
                            <tspan x="0" y="23">Kontroversität</tspan>
                        </text>
                    </g>
                    <g id="Engagement" transform="translate(0.000000, 28.000000)">
                        <circle stroke="url(#gradient)" stroke-width="8" fill-rule="nonzero" cx="99.5" cy="20.5" r="8.5"></circle>
                        <circle stroke="url(#gradient)" stroke-width="20" fill-rule="nonzero" cx="175.5" cy="20.5" r="20.5"></circle>
                        <circle stroke="url(#gradient)" stroke-width="32" fill-rule="nonzero" cx="267.5" cy="20.5" r="32.5"></circle>
                        <g fill="#D8D8D8" transform="translate(202.000000, 17.000000)">
                            <rect id="Tail" fill="#FFFFFF" x="0" y="3" width="28" height="1"></rect>
                            <polygon id="Head" fill="#FFFFFF" points="31 3.5 28 7 28 0"></polygon>
                        </g>
                        <g transform="translate(118.000000, 17.000000)" fill="#FFFFFF">
                            <rect id="Tail" x="0" y="3" width="28" height="1"></rect>
                            <polygon id="Head" points="31 3.5 28 7 28 0"></polygon>
                        </g>
                        <text id="Aktivität" font-family="Roboto-Regular, Roboto" font-size="12" font-weight="normal" line-spacing="16" fill="#FFFFFF">
                            <tspan x="0" y="23">Aktivität</tspan>
                        </text>
                        <circle id="Oval" class="hover" @mouseout="setFilter(null)" @mouseover="setFilter('engagement-high')" fill-rule="nonzero" cx="267.5" cy="20.5" r="20.5"></circle>
                        <circle id="Oval" class="hover" @mouseout="setFilter(null)" @mouseover="setFilter('engagement-mid')" fill-rule="nonzero" cx="175.5" cy="20.5" r="20.5"></circle>
                        <circle id="Oval" class="hover" @mouseout="setFilter(null)" @mouseover="setFilter('engagement-low')" fill-rule="nonzero" cx="99.5" cy="20.5" r="20.5"></circle>
                    </g>
                    <text id="Verknüpfungen" font-family="Roboto-Regular, Roboto" font-size="16" font-weight="normal" line-spacing="24" fill="#FFFFFF">
                        <tspan x="0" y="239">Verknüpfungen</tspan>
                    </text>
                    <text id="Statements" font-family="Roboto-Regular, Roboto" font-size="16" font-weight="normal" line-spacing="24" fill="#FFFFFF">
                        <tspan x="0" y="103">Statements</tspan>
                    </text>
                    <text id="Teilnehmer/innen" font-family="Roboto-Regular, Roboto" font-size="16" font-weight="normal" line-spacing="24" fill="#FFFFFF">
                        <tspan x="0" y="15">Teilnehmer/innen</tspan>
                    </text>
                </g>
            </g>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import Text from 'text'

export default {
  props: ['statements'],
  data () {
    return {
      text: Text.text
    }
  },
  methods: {
    setFilter (filter) {
      this.$store.commit('FILTER', filter)
    }
  },
  computed: {
  }
}
</script>

<style lang="scss" scoped>
@import "~main";

.info-pane {
  width: 336px;
  background: rgba(31, 27, 51, 0.9);
  height: 100%;
  position: absolute;
  min-height: 840px;


  font: $REGULAR;
  color: white;

  @media (max-width: 1000px) {
    width: 100%;
  }

  .container {
    width: 336px;
    height: 100%;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    box-sizing: border-box;
    padding: 16px 24px;

    // text-align: justify;

    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    h1 {
      font: $BOLD;
    }

    .legend {
      position: absolute;
      padding: 16px 0;
      bottom: 0px;

      svg {
        overflow: visible;

        .hover {
          fill: none;
          pointer-events: all;
        }
      }
    }
  }
}

</style>
