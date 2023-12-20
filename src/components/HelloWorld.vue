<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { RouterView } from 'vue-router';

defineProps<{ msg: string }>();

const count = ref(0);
const input = ref("element-plus");
const curDate = ref("");

const toast = () => {
  ElMessage.success("Hello");
};

const value1 = ref(true);
</script>

<template>
  <h1 color="$ep-color-primary">{{ msg }}</h1>

  <!-- example components -->
  <div class="mb-4">
    <el-button size="large" @click="toast">El Message</el-button>
  </div>

  <div class="my-2 text-center flex flex-wrap justify-center items-center">
    <el-button @click="count++">count is: {{ count }}</el-button>
  </div>

  <div>
    <el-switch v-model="value1" />
    <el-switch
      v-model="value1"
      class="m-2"
      style="--ep-switch-on-color: black; --ep-switch-off-color: gray;"
    />
  </div>

  <div class="my-2">
    <el-input class="m-2" v-model="input" style="width: 200px" />
    <el-date-picker
      class="m-2"
      v-model="curDate"
      type="date"
      placeholder="Pick a day"
    ></el-date-picker>
  </div>

</template>

<style>
.ep-button {
  margin: 4px;
}
.ep-button + .ep-button {
  margin-left: 0;
  margin: 4px;
}
</style>
