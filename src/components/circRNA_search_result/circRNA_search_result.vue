//circRNA_search_result.vue
<script setup>

import {
  circRNA_search_results, result_count,
  circRNA_identification, axios_server_root_url,
  lastTimeWholeTableSearchParams,
  refresh_whole_table, circRNA_wholetable_page_sublist,
  concerned_BSJ_isos,concerned_BSJID,fullscreenLoading
} from '../../main.ts'
import general_function_subtitle from '../general_function_subtitle.vue'
import {onMounted, ref} from "vue";
import { ElLoading } from 'element-plus'
import {useRouter} from 'vue-router'
import axios from 'axios'
const router = useRouter()
const currentPage_sublist = ref([])
const currentRowRef = ref(null)

let pageSize = 5
function onCurrentPageChanged(jumpingToPageNo){
    //前面有currentPageNo - 1） * pageSize条记录
    fullscreenLoading.value = true
    console.log('onCurrentPageChanged')
    lastTimeWholeTableSearchParams.pageNo = jumpingToPageNo
    refresh_whole_table(lastTimeWholeTableSearchParams)

    //console.log(currentPage_sublist.value)
}
function onPageSizeChanged(switchingToPageSize){
    //pageSize = switchingToPageSize
}
function onCurrentRowChanged(currentRow, oldRow){
    //在搜索结果表中点击任何一行，表示要跳转到这个BSJ的详情页
    fullscreenLoading.value = true;
    currentRowRef.value = currentRow
    let BSJtoSearchDetail = currentRowRef.value.BSJID
    //goto circRNA detail
    let url = ''
    url = axios_server_root_url.value + '/isoform/iso/' + BSJtoSearchDetail
    console.log(url);
    return axios.get(url).then(res=>{
        //写入全局变量circRNA_search_results,即表格内容
        /*circRNA_identification.value = res.data.result[0]
        console.log('after CurrentRowChanged, iso = ')
        console.log(circRNA_identification.value)*/
        res.data.result.forEach((iso)=>{
          concerned_BSJ_isos.value.push(iso)
        })
        //concerned_BSJ_isos.value = res.data.result
        concerned_BSJID.value = BSJtoSearchDetail
        fullscreenLoading.value = false;
      //跳转到详情显示页
        router.push('./circRNA_detail')
    }).catch(err=>{
        console.log(err)
    })
}

onMounted(()=>{
    //onCurrentPageChanged(1)
})
</script>

<template>
<div>
    <general_function_subtitle title="Search Result:"></general_function_subtitle>
    <el-table v-loading="fullscreenLoading"
              :data="circRNA_wholetable_page_sublist"
    :lazy="true"
    :highlight-current-row="true"
    @current-change="onCurrentRowChanged"
    style="width: 100%" highlight-current-row
    >
        <el-table-column prop="BSJID" label="BSJID"></el-table-column>
        <el-table-column prop="species" label="species"></el-table-column>
        <el-table-column prop="circAtlasID" label="circAtlasID"></el-table-column>
        <el-table-column prop="circBaseID" label="circBaseID"></el-table-column>
        <el-table-column prop="gene_id" label="gene_id"></el-table-column>
        <el-table-column prop="gene_name" label="gene_name"></el-table-column>
        <el-table-column prop="miRNA_count" label="miRNA binding site"></el-table-column>
        <el-table-column prop="RBP_count" label="RBP binding site"></el-table-column>
        <el-table-column prop="ORF_count" label="ORF count"></el-table-column>
        <el-table-column prop="IRES_count" label="IRES count"></el-table-column>
        <el-table-column prop="m6A_count" label="m6A count"></el-table-column>
        <el-table-column prop="isoform_count" label="isoform count"></el-table-column>

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