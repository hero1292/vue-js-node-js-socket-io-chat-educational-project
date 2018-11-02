<template>
  <div>
    <div class="chat">
      <div class="chat-users">
        <v-list class="pl-3" v-for="(u, i) in users" :key="i" :class="{'active': u.id === user.id}">{{u.name}}</v-list>
      </div>
      <div class="chat-messages" ref="messages">
        <chat-message v-for="(m, i) in messages" :key="i" :message="m" :user="user"></chat-message>
      </div>
    </div>
    <v-flex xs12>
      <v-card class="transparent elevation-0">
        <v-card-text>
          <v-textarea
            prepend-icon="chat"
            label="Type your message..."
            type="text"
            v-model.trim="message"
            @keydown.enter="sendMessage"
            outline
            autofocus
            background-color="#45688e"
            color="#45688e"
            height="80px"
          ></v-textarea>
          <v-card-actions>
            <v-spacer></v-spacer>
            <button
              class="button"
              @click="sendMessage"
              :disabled="message.length === 0"
            >
              <svg class="button__svg">
                <rect class="button__rect"></rect>
              </svg>
              Send
            </button>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-flex>
  </div>
</template>

<script>
  import io from 'socket.io-client'
  import ChatMessage from './ChatMessage.vue'

  function scrollToBottom (node) {
    setTimeout(() => {
      node.scrollTop = node.scrollHeight
    })
  }

  export default {
    data () {
      return {
        message: '',
        messages: [],
        user: {
          name: '',
          room: ''
        },
        users: [],
        socket: io()
      }
    },
    methods: {
      sendMessage () {
        const message = {
          text: this.message,
          name: this.user.name,
          id: this.user.id
        }
        this.socket.emit('message:create', message, err => {
          if (err) {
            console.error(err)
          } else {
            this.message = ''
          }
        })
      },
      initializeConnection () {
        this.socket.on('users:update', users => {
          this.users = [...users]
        })

        this.socket.on('message:new', message => {
          this.messages.push(message)
          scrollToBottom(this.$refs.messages)
        })
        scrollToBottom(this.$refs.messages)
      }
    },
    created () {
      const name = this.$route.query.name
      const room = this.$route.query.room

      this.user = {name, room}
    },
    mounted () {
      this.socket.emit('join', this.user, data => {
        if (typeof data === 'string') {
          console.error(data)
        } else {
          this.user.id = data.userId
          this.initializeConnection()
        }
      })
    },
    components: {
      chatMessage: ChatMessage
    }
  }
</script>

<style lang="scss" scoped>
  $width: 120px;
  $height: 40px;
  $begin: #45688e;
  $end: #b00020;

  .chat {
    display: flex;
    height: 70vh;
    width: 100%;
  }

  .chat-users {
    width: 300px;
    border: 1px solid $begin;
    margin: 0;
  }

  .chat-messages {
    border: 1px solid $begin;
    width: 100%;
    padding: 15px;
    overflow-y: auto;
  }

  .chat-users .active {
    background: $begin;
    color: #fff;
  }

  .button {
    position: relative;
    display: inline-block;
    margin: 0 10px 10px 0;
    width: $width;
    height: $height;
    line-height: $height;
    color: $begin;
    text-align: center;
    font-size: 20px;
    letter-spacing: 5px;
    text-transform: uppercase;
    text-decoration: none;
    transition: 2s;
    background-color: transparent;
    border-color: transparent;
  }

  .button:hover,
  .button:focus {
    outline: none;
    color: $end;
  }

  .button__svg,
  .button__rect {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    fill: none;
  }

  .button__rect {
    stroke: $begin;
    stroke-width: 5;
    stroke-dasharray: $height $width;
    stroke-dashoffset: calc(
      2 * #{$width}
      + 2 * #{$height}
      + #{$height} / 2
    );
    transition: 2s;
  }

  .button:hover .button__rect,
  .button:focus .button__rect {
    stroke: $end;
    stroke-dashoffset: calc(#{$height} + #{$height} / 2);
  }
</style>
