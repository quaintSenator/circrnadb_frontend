<script setup>
import {m6Acount, axios_server_root_url, m6Aloading, m6Adetails} from '../../main.ts'
import {ref} from 'vue'
import {useRoute, useRouter} from "vue-router";
import axios from "axios";
const router = useRouter()
const route = useRoute()
const is_mitable_loading = ref(false)
function onCurrentPageChange(pageNo){
  let last_isoform_id = m6Adetails.value[0].result
  console.log(m6Adetails.value[0])
 /* let url = axios_server_root_url.value + '/m6A/' + newRow.isoformID + '/1/5'
  console.log(url)
  m6Aloading.value = true
  axios.get(url).then((res) => {
    console.log(res.data)
    m6Adetails.value = res.data
    m6Aloading.value = false
  }).catch((err)=>{
    m6Aloading.value = false
    console.log(err)
  })*/
}
</script>

<template>
  <div>
    <el-table :data="m6Adetails" v-loading="m6Aloading">
      <el-table-column prop="isoformID" label="isoformID"></el-table-column>
      <el-table-column prop="m6AID" label="m6AID"></el-table-column>
      <el-table-column prop="iso_start" label="iso_start"></el-table-column>
      <el-table-column prop="iso_end" label="iso_end"></el-table-column>
    </el-table>
    <el-pagination
        :page-size="5"
        :total="m6Acount"
        @update:current-page="onCurrentPageChange"
        background layout="prev, pager, next"  />
  </div>

  <el-row :gutter="12" class="demo-radius">
    <el-col>
      <div
          class="radius"
      />
    </el-col>
  </el-row>

</template>
<style scoped>
.demo-radius .title {
  color: var(--el-text-color-regular);
  font-size: 18px;
  margin: 10px 0;
}
.demo-radius .value {
  color: var(--el-text-color-primary);
  font-size: 16px;
  margin: 10px 0;
}
.demo-radius .radius {
  height: 40px;
  width: 70%;
  border: 1px solid var(--el-border-color);
  border-radius: 0;
  margin-top: 20px;
}
</style>