<template>
  <div class="page">
    <network v-if="links.length" :links="links" :nodes="nodes" :settings="settings"></network>
  </div>
</template>

<script>
import Network from 'components/Network'
import data from 'data.json'
// import fetch from 'unfetch'
import * as d3 from 'd3'

export default {
  data  () {
    return {
      nodes: [],
      links: [],
      time: new Date('08-22-2017').getTime(),
      scale: d3.scaleLinear()
        .domain([0, 1])
        .range(['rgba(255, 29, 136, 1)', 'rgba(250, 237, 84, 1)']),
      settings: null
    }
  },
  components: {
    Network
  },
  created () {
    this.update()
  },
  methods: {
    update () {
      console.log([0, 0.25, 0.5, 0.75, 1].map(d => this.scale(d)))
      // fetch(`${this.$store.state.api}/all`) // http://psz.ft0.ch/api/all
      //   .then(res => res.json())
      //   .then(data => {
      this.settings = data.settings

      // data.statements = data.statements.filter(s => s.time <= this.time)
      // data.likes = data.likes.filter(l => l.time <= this.time)

      data.statements.forEach((statement, i) => {
        statement.likes = data.likes.filter(like => like.statement === statement._id && like.isLike).length
        statement.dislikes = data.likes.filter(like => like.statement === statement._id && !like.isLike).length
        statement.ratings = statement.likes + statement.dislikes
        statement.rating = statement.ratings > 0 ? statement.likes / statement.ratings : 0.5
        statement.controversity = ((0.5 - Math.abs(statement.rating - 0.5)) * Math.pow(statement.ratings, 0.5))
      })
      let maxControversity = Math.max(...data.statements.map(s => s.controversity))

      data.user.forEach(user => {
        user.statements = data.statements.filter(statement => statement.user === user._id).length +
          data.likes.filter(like => like.user === user._id).length / 3
      })
      let maxStatements = Math.max(...data.user.map(s => s.statements))

      this.nodes.forEach(node => {
        if (node.type === 'statement') {
          let statement = data.statements.find(s => `s_${s._id}` === node._id)
          node.controversityNorm = Math.max(statement.controversity / maxControversity, 0.125)
          node.rating = statement.rating
          node.fill = this.scale(statement.rating)
        } else {
          let user = data.user.find(u => `u_${u._id}` === node._id)
          node.r = Math.max(user.statements / maxStatements, 0.25)
        }
      })

      // console.log(...data.statements
      //   .filter(s => this.nodes.find(node => node._id === 's_' + s._id) == null))

      this.nodes.push(
        ...data.statements
          .filter(s => this.nodes.find(node => node._id === 's_' + s._id) == null)
          .map(s => {
            let user = data.user.find(u => u._id === s.user)
            return {
              _id: 's_' + s._id,
              type: 'statement',
              text: s.text,
              controversityNorm: Math.max(s.controversity / maxControversity, 0.125),
              controversityNorm12: Math.max(s.controversity / maxControversity, 0.125) * 12,
              rating: s.rating,
              fill: this.scale(s.rating),
              author: user && user.name ? user.name : '',
              time: s.time,
              ratio: `${s.likes} / ${s.dislikes}`,
              opacity: 1
            }
          }),
        ...data.user
          .filter(u => (data.statements.find(s => s.user === u._id) != null) || (data.likes.find(s => s.user === u._id) != null))
          .filter(u => this.nodes.find(node => node._id === 'u_' + u._id) == null)
          .map(u => {
            return {
              _id: 'u_' + u._id,
              type: 'user',
              text: u.name,
              r: Math.max(u.statements / maxStatements, 0.125),
              fontSize: Math.max(u.statements / maxStatements, 0.25),
              engaged: (u.statements / maxStatements) > 0.25,
              opacity: 1
            }
          })
      )

      // nodes.statements.find(d => s_59935065267f441bf0c44a78¿¿)

      let likes = [...data.likes, ...data.statements.map(s => {
        return {
          statement: s._id,
          time: s.time,
          user: s.user,
          _id: s.user + s._id
        }
      })]

      // let likes = [...data.likes]

      this.links.push(...likes
        .filter(like => this.links.find(link => link._id === like._id) == null)
        .map(like => {
          return {
            _id: like._id,
            source: 'u_' + like.user,
            target: 's_' + like.statement,
            type: like.isLike === true ? 'like' : like.isLike === false ? 'dislike' : 'author'
          }
        })
      )
    }
  }
}
</script>
<style lang="scss">
  .time {
    position: absolute;
    width: 100%;
    z-index: 100;
    bottom: 0px;
    height: 48px;
    background: #fff;

    .stamp {
      width: 100%;
      text-align: center;
    }

    .slider {
      width: calc(100% - 16px);
    }
  }
</style>
