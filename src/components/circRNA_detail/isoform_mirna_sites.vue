<script setup>

import {reactive, ref} from 'vue'
import axios from 'axios'
import general_function_subtitle from '../general_function_subtitle.vue'
import {axios_server_root_url} from '../../main.ts'
//为了防止反复更新表项不断发起查询，设置一个记忆
const mi_buffer = reactive(new Map)
const mi_len_buffer = reactive(new Map)
const mirnainteractions = reactive([])
const selected_mirna = ref(null)
const current_isoID = ref('')
function selectedMirnaChanged(newRow, oldRow){
    console.log('testing selected row')
    console.log(newRow)
    selected_mirna.value = newRow.binding_sites
}
const paginationOption = reactive({
    pageNo: 1,
    pageSize: 3,
    recordCount: 0
})
const flip = (toPageNo)=>{
    paginationOption.pageNo = toPageNo
    console.log('flip ' + toPageNo)
    refresh(current_isoID)
}
const refresh = (isoID) => {
    current_isoID.value = isoID
    //先查长度
    let url = axios_server_root_url.value + '/isomirna/getcircmiinteract_len/isoid/' + isoID
    if(mi_len_buffer.has(url)){
        paginationOption.recordCount = mi_len_buffer.get(url)
        preciousQuery(isoID)
    }
    else{
        axios.get(url).then(res=>{
            console.log(res.data)
            paginationOption.recordCount = res.data.len
            preciousQuery(isoID)
        })
    }
}
const preciousQuery = (isoID)=>{
    //根据isoform_id 查询isoform_mirna
    let url = axios_server_root_url.value + '/isomirna/getcircmiinteract/isoid/' + isoID
        + '/PageNo/' + paginationOption.pageNo + '/PageSize/' + paginationOption.pageSize
    if(mi_buffer.has(url)){
        //如果mi_buffer已经有记忆，则不必发起查询
        console.log('no need to send request')
        mirnainteractions.length = 0
        let toCopyList = mi_buffer.get(url)
        for(let i = 0; i < toCopyList.length; i++){
            mirnainteractions.push(toCopyList[i])
        }
    }
    else{
        axios.get(url).then(res=>{
            console.log('sending request...')
            mirnainteractions.length = 0
            for(let i = 0; i < res.data.result.length; i++){
                mirnainteractions.push(res.data.result[i])
            }
            mi_buffer.set(url, res.data.result)//写入记忆
        })
    }
}
defineExpose({
    refresh
})
</script>

<template>
   <general_function_subtitle title="miRNAs binding to selected isoform" :frontoffset="1"></general_function_subtitle>
   <el-row>
       <el-table :data="mirnainteractions"
       :lazy="false"
       :highlight-current-row="true"
        style="width: 100%" highlight-current-row
       @current-change="selectedMirnaChanged"
       >
       <el-table-column prop="circRNAIsoformID" label="isoform_id"></el-table-column>
       <el-table-column prop="miRNAID" label="miRNA_id"></el-table-column>
       </el-table>
       <el-pagination
    :page-size="paginationOption.pageSize"
       :total="paginationOption.recordCount"
    layout="prev, pager, next"
       @current-change="flip"
  />
   </el-row>
       
   <general_function_subtitle title="selected miRNA's binding sites detail" :frontoffset="2"></general_function_subtitle>
   <el-table :data="selected_mirna"
            :lazy="false"
             :highlight-current-row="true"
              style="width: 100%" highlight-current-row
            >
             <el-table-column prop="iso_start" label="iso_start"></el-table-column>
             <el-table-column prop="iso_end" label="iso_end"></el-table-column>
             <el-table-column prop="miRNA_start" label="miRNA_start"></el-table-column>
             <el-table-column prop="miRNA_end" label="miRNA_end"></el-table-column>
             <el-table-column prop="aln_length" label="aln_length"></el-table-column>
             <el-table-column prop="identity" label="identity"></el-table-column>
             <el-table-column prop="score" label="score"></el-table-column>
             <el-table-column prop="energy" label="energy"></el-table-column>
    </el-table>
    
    
</template>

