<script setup>
import {circRNA_identification,
  concerned_BSJ_isos
} from '../../main.ts'
import {onMounted, computed } from 'vue'

const circRNA_iden_computed = computed({
    get(){
        let list = []
        list.push(circRNA_identification.value)
        return list
    }
})
function selectingRow(selectedRow){

}
</script>

<template>
    <div>
        <el-row>
            <el-col :span="12">
                <div class="bg-purple subfunction-title grid-content">
                    CircRNA Identification
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content"></div>
            </el-col>
        </el-row>
         <el-row>
            <el-table :data="circRNA_iden_computed"
            :lazy="true"
            :highlight-current-row="true"
            style="width: 100%" highlight-current-row
            @selectionChange="selectingRow"
            >
            <el-table-column prop="BSJID" label="BSJID"></el-table-column>
<!--            <el-table-column prop="circAtlasID" label="circAtlasID"></el-table-column>
            <el-table-column prop="circBaseID" label="circBaseID"></el-table-column>-->
            <el-table-column prop="gene" label="gene"></el-table-column>
            <el-table-column prop="has_IRES" label="has_IRES"></el-table-column>
            <el-table-column prop="has_cORF" label="has_cORF"></el-table-column>
            <el-table-column prop="has_m6A" label="has_m6A"></el-table-column>
            <el-table-column prop="isoform_count" label="isoform_count   "></el-table-column>
            <el-table-column prop="miRNAbindingsite" label="miRNAbindingsite   "></el-table-column>
            <el-table-column prop="RBPbindingsite" label="RBPbindingsite   "></el-table-column>
            </el-table>
         </el-row>
         
        
       
    </div>
</template>