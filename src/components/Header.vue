<template>
  <div class="header">
    <b-navbar>
      <b-navbar-nav class="ml-auto">
        <b-nav-form right>
          <button class="btn btn-outline-dark btn-sm" @click="disconnectAction">切断</button>
        </b-nav-form>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'navheader',
  methods: {
    ...mapActions(['disconnectAction'])
  }
}
</script>
