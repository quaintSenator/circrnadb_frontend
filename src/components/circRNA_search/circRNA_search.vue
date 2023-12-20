<script setup>
import axios from 'axios'
import circRNA_ID_form from './circRNA_ID_form.vue'
import SearchCondition_circRNA from './SearchCondition_circRNA.vue'
import {useRoute, useRouter} from 'vue-router'
import {circRNA_search_results, result_count} from '../../main.ts'
import { axios_server_root_url} from '../../main.ts'
import general_function_subtitle from '../general_function_subtitle.vue'
let IDtype = ''
let ID = ''
let searchPatterns = []
const router = useRouter()
const route = useRoute()

function onFormSubmitted(formContent){
    IDtype = formContent.IDtype
    ID = formContent.inputID
    
    //getting correct request API url
    //calculating patternCode
    let patternTemplate = ['cORF', 'IRES', 'm6A', 'TIS', 'miRNABinding', 'RBPBinding']
    let patternCode = 0
    let bit = 1
    for(let i = 0; i <= 5; i++){
        if(searchPatterns.includes(patternTemplate[i])){
            patternCode |= bit
            //console.log('pattern match, |=' + bit)
        }
        bit <<= 1
    }
    let url = ''
    if(typeof ID == "string" && ID.length == 0){
        //ID为空，查询所有的记录。对应
        url = axios_server_root_url.value + '/circrnas/noID/patternCode/' + patternCode;
    }
    else{
        url = axios_server_root_url.value + '/circrnas/patternCode/' + patternCode + '/' + IDtype + '/' + ID;
    }
    console.log(url)
    //calculated patternCode
    
    //sending Request
    axios.get(url).then(res=>{
        //写入全局变量circRNA_search_results,即表格内容
        circRNA_search_results.value = res.data.result
        console.log('result.length = ' + res.data.result.length)
        result_count.value = res.data.result.length
        //跳转到结果显示页
        router.push('./circRNA_search_result')

    }).catch(err=>{
        console.log(err)
    })
}
function onSearchConditionChanging(changedPatterns){
    searchPatterns = changedPatterns
}
</script>

<template>
<div>
    <general_function_subtitle title="Preset Searching Options"></general_function_subtitle>
    <SearchCondition_circRNA @search-patterns-changed="onSearchConditionChanging"/>
    <general_function_subtitle title="Select ID type"></general_function_subtitle>
    <circRNA_ID_form @search-submit="onFormSubmitted" />
</div>
</template>