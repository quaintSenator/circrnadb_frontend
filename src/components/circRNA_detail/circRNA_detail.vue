<script setup>
import { onMounted } from 'vue'
import axios from 'axios'
import {axios_server_root_url, concerned_BSJ_isos,
  circRNA_identification, circRNA_isoform_relations
} from '../../main.ts'
import {  } from '../../main.ts'
import circRNA_isoforms_subtable from './circRNA_isoforms_subtable.vue'
onMounted(()=>{
    /*console.log("test from circRNA isoforms subtable")
    console.log(circRNA_identification.value)
    getIsoforms()*/
})

function getIsoforms(){
    //getIsoforms use isoform_id to search in database
    /*let circRNA_id = circRNA_identification.value.circFulldbID
    console.log('getIsoform is launched, circRNA_id = ' + circRNA_id)
    let url = axios_server_root_url.value + '/circrnaiso/relations/id/' + circRNA_id
    axios.get(url).then(res=>{
        circRNA_isoform_relations.value = res.data.result
        console.log(res.data.result)
        //concerned_BSJ_isos.value.push(res.data.result)
    })*/
}
</script>


<template>

<circRNA_isoforms_subtable @concerned-isoform-changed="getIsoforms"></circRNA_isoforms_subtable>
</template>