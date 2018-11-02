<template>
  <div class="message" :class="{'owner': message.id === user.id}">
    <div class="message-content elevation-1">
      <b>{{message.name}}:</b> {{message.text}}
    </div>
  </div>
</template>

<script>
  export default {
    props: ['message', 'user']
  }
</script>

<style lang="scss" scoped>
  .message {
    display: flex;
  }

  .message-content {
    background-color: #b00020;
    color: #fff;
    border-radius: 5px;
    padding: 6px 9px;
    font-size: 14px;
    margin-bottom: 10px;
    max-width: 250px;
    word-break: break-all;
  }

  .message.owner {
    justify-content: flex-end;
  }

  .message.owner .message-content {
    color: #fff;
    background: #45688e;
  }
</style>
