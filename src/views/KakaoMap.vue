<template>
  <div>
    <div class="jumbotron">
      <h2 class="text-center">카카오맵이다 이거야</h2>
      <div class="nav">
        <div class="nav-item">
          <router-link class="nav-link" :to="{ name: 'HomeSample' }"
            >샘플지도</router-link
          >
        </div>
        <div class="nav-item">
          <router-link class="nav-link" :to="{ name: 'HomeSpring' }"
            >스프링에서 정보 불러오기</router-link
          >
        </div>
        <div class="nav-item">
          <router-link class="nav-link" :to="{ name: 'HomePin' }"
            >동코드 맵에 핀찍기</router-link
          >
        </div>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
