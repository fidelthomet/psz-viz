<template>
  <div class="page">
    <!-- <list :statements="statements" :user="user"></list> -->
    <network v-if="links != null" :links="links" :nodes="nodes"></network>
  </div>
</template>

<script>
import List from 'components/List'
import Network from 'components/Network'
import fetch from 'unfetch'

export default {
  data  () {
    return {
      nodes: null,
      links: null
    }
  },
  components: {
    List,
    Network
  },
  created () {
    fetch(`${this.$store.state.api}/all`) // http://psz.ft0.ch/api/all
      .then(res => res.json())
      .then(data => {
        // this.nodes = data.statements
        // // let likes = [...data.likes, ...data.statements.map(s => {
        // //   return {
        // //     isLike: true,
        // //     statement: s._id,
        // //     time: s.time,
        // //     user: s.userId,
        // //     id: null
        // //   }
        // // })]
        //
        // let likes = [...data.likes]
        //
        // let links = []
        // likes.forEach((like, index) => {
        //   const remaining = likes.filter((l, i) => i > index && like.user === l.user)
        //   if (remaining == null) return
        //
        //   remaining.forEach(r => {
        //     let link = links.find(l =>
        //       (l.source === like.statement && l.target === r.statement) ||
        //       (l.target === like.statement && l.source === r.statement)
        //     )
        //     if (link != null) {
        //       link.value += r.isLike ? 1 : -1
        //     } else {
        //       links.push({
        //         source: like.statement,
        //         target: r.statement,
        //         value: r.isLike ? 1 : -1
        //       })
        //     }
        //   })
        // })
        //
        // this.links = links

        this.nodes = [
          ...data.statements.map(s => {
            return {
              _id: 's_' + s._id,
              type: 'statement'
            }
          }),
          ...data.user
            .filter(u => data.statements.find(s => s.user === u._id) != null)
            .map(u => {
              return {
                _id: 'u_' + u._id,
                type: 'user'
              }
            })
        ]

        console.log(this.nodes)

        let likes = [...data.likes, ...data.statements.map(s => {
          return {
            isLike: true,
            statement: s._id,
            time: s.time,
            user: s.user,
            id: null
          }
        })]

        // let likes = [...data.likes]

        this.links = likes.map(like => {
          return {
            source: 'u_' + like.user,
            target: 's_' + like.statement,
            value: like.isLike ? 1 : -1
          }
        })

        // console.log(this.links)
      })
  }
}
</script>
