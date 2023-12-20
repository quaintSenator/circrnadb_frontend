//circRNA_search_result.vue
<script setup>

import {
    circRNA_search_results, result_count,
    circRNA_identification, axios_server_root_url
} from '../../main.ts'
import general_function_subtitle from '../general_function_subtitle.vue'
import {onMounted, ref} from "vue";
import {useRouter} from 'vue-router'
import axios from 'axios'
const router = useRouter()
const currentPage_sublist = ref([])
const currentRowRef = ref(null)
let pageSize = 3
function onCurrentPageChanged(jumpingToPageNo){
    //前面有currentPageNo - 1） * pageSize条记录
    //当前页的第一条是
    let firstRecordNo = (jumpingToPageNo - 1) * pageSize
    currentPage_sublist.value = circRNA_search_results.value.slice(firstRecordNo, firstRecordNo + pageSize)
    console.log('currentPageChanged, new PageNo = ' + jumpingToPageNo)
    console.log(currentPage_sublist.value)
}
function onPageSizeChanged(switchingToPageSize){
    pageSize = switchingToPageSize
}
function onCurrentRowChanged(currentRow, oldRow){
    currentRowRef.value = currentRow
    //goto circRNA detail
    let url = ''
    url = axios_server_root_url.value + '/circrnaidentification/circFulldbID/' + currentRowRef.value.circFulldbID
    
    axios.get(url).then(res=>{
        //写入全局变量circRNA_search_results,即表格内容
        circRNA_identification.value = res.data.result[0]
        console.log('after CurrentRowChanged, circRNA_identification = ')
        console.log(circRNA_identification.value)
        
        //跳转到详情显示页
        router.push('./circRNA_detail')

    }).catch(err=>{
        console.log(err)
    })
}

onMounted(()=>{
    onCurrentPageChanged(1)
})
</script>

<template>
<div>
    <general_function_subtitle title="Search Result:"></general_function_subtitle>

        
    <el-table :data="currentPage_sublist"
    :lazy="true"
    :highlight-current-row="true"
    @current-change="onCurrentRowChanged"
    style="width: 100%" highlight-current-row>
        <el-table-column prop="circFulldbID" label="circFulldbID"></el-table-column>
        <el-table-column prop="circAtlasID" label="circAtlasID"></el-table-column>
        <el-table-column prop="circBaseID" label="circBaseID"></el-table-column>
        <el-table-column prop="gene" label="gene"></el-table-column>
        <el-table-column prop="isoform_count" label="isoform_count"></el-table-column>
        <el-table-column prop="miRNAbindingsite" label="miRNAbindingsite"></el-table-column>
        <el-table-column prop="RBPbindingsite" label="RBPbindingsite"></el-table-column>
        <el-table-column prop="has_cORF" label="cORF"></el-table-column>
        <el-table-column prop="has_IRES" label="IRES"></el-table-column>
        <el-table-column prop="has_m6A" label="m6A"></el-table-column>
        <el-table-column prop="has_TIS" label="TIS"></el-table-column>
    </el-table>
    
    <el-pagination
    :page-size="pageSize"
    :total="result_count"
    @update:current-page="onCurrentPageChanged"
    @update:page-size="onPageSizeChanged"
    background layout="prev, pager, next"  />

</div>

</template>

<style>
    .subfunction-title{
        font-size: 24px ;
        font-weight: bold;
        color: grey;
        text-align: left;
    }
    .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
    .bg-purple {
    background: #d3dce6;
  }
    .bg-purple-dark {
    background: #99a9bf;
  }

</style>