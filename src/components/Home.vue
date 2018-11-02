<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6>
        <v-card class="elevation-12">
          <v-toolbar dark color="#45688e">
            <v-toolbar-title>Enter Chat</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form v-model="valid" ref="form" validation @keyup.enter.native="onSubmit">
              <v-text-field
                prepend-icon="person"
                name="name"
                label="Name"
                type="text"
                v-model="name"
                :rules="rules"
                color="#45688e"
              ></v-text-field>
              <v-text-field
                prepend-icon="chat"
                name="room"
                label="Room"
                type="text"
                v-model="room"
                :rules="rules"
                color="#45688e"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <button
              class="button"
              @click="onSubmit"
              :disabled="!valid"
            >
              <svg class="button__svg">
                <rect class="button__rect"></rect>
              </svg>
              Enter
            </button>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        name: '',
        room: '',
        valid: false,
        rules: [
          v => !!v || 'Field is required'
        ]
      }
    },
    methods: {
      onSubmit () {
        if (this.$refs.form.validate()) {
          this.$router.push({path: 'chat', query: {name: this.name, room: this.room}})
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  $width: 120px;
  $height: 40px;
  $begin: #45688e;
  $end: #b00020;

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
