<script setup>
import {axios_server_root_url, ORFcount, ORFdetails, ORFloading} from "~/main";
import {ref} from 'vue'
const router = useRouter()
const route = useRoute()
import axios from "axios";
import {ElMessage} from "element-plus";
import {useRoute, useRouter} from "vue-router";
const ORFpageSize = ref(5);
const ORFtable_pageNo = ref(1);
function onCurrentPageChange(newPageNo){
  ORFloading.value = true
  let sameIso = ORFdetails.value[0].isoformID

  let url = axios_server_root_url.value + '/isoorf/iso_orf/id/'
      + sameIso + '/PageNo/' + ORFtable_pageNo.value + '/PageSize/5'
  console.log(url)
  axios.get(url).then((res) => {
    console.log(res.data)
    ORFdetails.value = res.data.result
    ORFcount.value = res.data.count
    if(ORFcount.value > 0){
      router.push('./ORF_detail')
      ORFloading.value = false;
    }
    else{
      ElMessage('No ORF found in this isoform.')
      ORFloading.value = false;
    }
  }).catch((err)=>{
    console.log(err)
  })
}
</script>

<template>
  <div>
    <el-table :data="ORFdetails" v-loading="ORFloading">
      <el-table-column prop="isoformID" label="isoformID"></el-table-column>
      <el-table-column prop="ORF_start" label="ORF_start"></el-table-column>
      <el-table-column prop="ORF_end" label="ORF_end"></el-table-column>
      <el-table-column prop="ORF_type" label="ORF_type"></el-table-column>
      <el-table-column prop="protein_name" label="protein_name"></el-table-column>
      <el-table-column prop="peptide" label="peptide"></el-table-column>
    </el-table>
    <el-pagination
        v-model:current-page="ORFtable_pageNo"
        :page-size="ORFpageSize"
        :total="ORFcount"
        @current-change="onCurrentPageChange"
        background layout="prev, pager, next"  />
  </div>
</template>