<script setup>
import {miRNAdetails, miRNAcount, axios_server_root_url} from '../../main.ts'
import {ref} from 'vue'
import {useRoute, useRouter} from "vue-router";
import axios from "axios";
const router = useRouter()
const route = useRoute()
const miPageSize = ref(5)
const is_mitable_loading = ref(false)
function onCurrentPageChange(pageNo){
  let url = axios_server_root_url.value + '/mirna/'
      + miPageSize.value + '/' + pageNo
  console.log(url)
  is_mitable_loading.value = true
  axios.get(url).then((res) => {
    console.log(res.data)
    miRNAdetails.value = res.data
    is_mitable_loading.value = false
  }).catch((err)=>{
    console.log(err)
  })
}
</script>

<template>
  <div>
<!--    miRNAID: 'mmu-let-7a-1-3p',
    isoformID: 'chr1:132463614-132465318|132463614-132465318',
    score: 163,
    energy: -22.24,
    miRNAinteval: '2 21',
    isointeval: '1422 1444',
    alnlen: 20,
    identity: '70.00%',
    similarity: '85.00%'-->
    <el-table :data="miRNAdetails" v-loading="is_mitable_loading">
      <el-table-column prop="isoformID" label="isoformID"></el-table-column>
      <el-table-column prop="miRNAID" label="miRNAID"></el-table-column>
      <el-table-column prop="score" label="score"></el-table-column>
      <el-table-column prop="energy" label="energy"></el-table-column>
      <el-table-column prop="miRNAinteval" label="miRNAinteval"></el-table-column>

      <el-table-column prop="isointeval" label="isointeval"></el-table-column>
      <el-table-column prop="alnlen" label="alnlen"></el-table-column>
      <el-table-column prop="identity" label="identity"></el-table-column>
      <el-table-column prop="similarity" label="similarity"></el-table-column>
    </el-table>
    <el-pagination
        :page-size="miPageSize"
        :total="miRNAcount"
        @update:current-page="onCurrentPageChange"
        background layout="prev, pager, next"  />
  </div>
</template>