//BaseHeader.vue
<script lang="ts" setup>
import { toggleDark } from "~/composables";
import { RouterView } from 'vue-router';

</script>

<template>
  <el-menu class="el-menu-demo" mode="horizontal">
    <el-menu-item index="1">
      <router-link :to="{ path: '/home_page' }" replace:true>Home</router-link>
    </el-menu-item>
    <el-menu-item index="2">
       <router-link :to="{ path: '/circRNA_search' }" replace:true>Search</router-link>
    </el-menu-item>
    <el-menu-item index="3">
       <router-link :to="{ path: '/circRNA_search_result' }" replace:true>Online Analysis</router-link>
    </el-menu-item>
    <el-menu-item index="4">
       <router-link :to="{ path: '/blast_root' }" replace:true>BLAST</router-link>
    </el-menu-item>
    <el-menu-item h="full" @click="toggleDark()">
      <button
        class="border-none w-full bg-transparent cursor-pointer"
        style="height: var(--ep-menu-item-height)"
      >
        <i inline-flex i="dark:ep-moon ep-sunny" />
      </button>
    </el-menu-item>
  </el-menu>

  <RouterView/>
</template>
