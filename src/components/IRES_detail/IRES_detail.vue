<script setup>
import {IRESdetails,IREScount } from "../../main.ts";
import {ref} from 'vue'
import {useRoute, useRouter} from "vue-router";
import axios from "axios";
const router = useRouter()
const route = useRoute()
const is_IREStable_loading = ref(false)

function onCurrentPageChange(newPageNo){
  console.log(newPageNo)
}
let isoSeq = ''
let alnLine = ''
let IRES_seq = ''
function showAlign(newRow, oldRow){
  isoSeq = newRow.iso_seq
  alnLine = newRow.align_state
  IRES_seq = newRow.IRES_seq
}
</script>

<template>
  <div>
    <el-table :data="IRESdetails" v-loading="is_IREStable_loading"
      @current-change="showAlign"
    >
      <el-table-column prop="isoform_ID" label="isoformID"></el-table-column>
      <el-table-column prop="IRES_ID" label="queryID"></el-table-column>
      <el-table-column prop="score" label="score"></el-table-column>
      <el-table-column prop="identity" label="energy"></el-table-column>
      <el-table-column prop="aln_len" label="queryStart"></el-table-column>
      <el-table-column prop="mismatch" label="queryEnd"></el-table-column>
      <el-table-column prop="gapopen" label="isoStart"></el-table-column>
      <el-table-column prop="iso_start" label="isoEnd"></el-table-column>
      <el-table-column prop="iso_end" label="identity"></el-table-column>
      <el-table-column prop="IRES_start" label="similarity"></el-table-column>
      <el-table-column prop="IRES_end" label="similarity"></el-table-column>
    </el-table>
    <el-pagination
        :page-size="5"
        :total="IREScount"
        @update:current-page="onCurrentPageChange"
        background layout="prev, pager, next"  />





  </div>
</template>