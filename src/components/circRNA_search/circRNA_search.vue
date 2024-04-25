<script setup>
import axios from 'axios'
import circRNA_ID_form from './circRNA_ID_form.vue'
import SearchCondition_circRNA from './SearchCondition_circRNA.vue'
import {useRoute, useRouter} from 'vue-router'
import {circRNA_search_results, result_count,
  refresh_whole_table, lastTimeWholeTableSearchParams, searchPatterns} from '../../main.ts'
import { axios_server_root_url} from '../../main.ts'
import general_function_subtitle from '../general_function_subtitle.vue'
let IDtype = ''
let ID = ''
let patternCode = 0
const router = useRouter()
const route = useRoute()
function getSearchPatternCode(){
  console.log('getSearchPatternCode exec')
  //calculating patternCode
  //let patternTemplate = ['cORF', 'IRES', 'm6A', 'TIS', 'miRNABinding', 'RBPBinding']
  let patternTemplate = ['miRNABinding', 'RBPBinding', 'cORF', 'IRES', 'm6A', 'TIS']

  let patternCode = 0
  let bit = 1
  for(let i = 0; i <= 5; i++){
    if(searchPatterns.value.includes(patternTemplate[i])){
      patternCode |= bit
      //console.log('pattern match, |=' + bit)
    }
    bit <<= 1
  }
  return patternCode
}
function onFormSubmitted(formContent){
    console.log('onFormSubmitted launched')

    lastTimeWholeTableSearchParams.IDtype = formContent.IDtype
    lastTimeWholeTableSearchParams.ID = formContent.inputID
    lastTimeWholeTableSearchParams.patternCode = getSearchPatternCode()
    console.log(lastTimeWholeTableSearchParams.patternCode)
    lastTimeWholeTableSearchParams.pageNo = 1
    lastTimeWholeTableSearchParams.pageSize = 5
  refresh_whole_table(lastTimeWholeTableSearchParams)
}
function onSearchConditionChanging(changedPatterns){
    searchPatterns = changedPatterns
    patternCode = getSearchPatternCode()
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