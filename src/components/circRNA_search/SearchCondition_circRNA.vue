<script setup>
import {onMounted, ref} from 'vue'
import {lastTimeWholeTableSearchParams, speciesPatterns, searchPatterns} from "~/main";
const checkBoxChanged = (status)=>{
  //this.$emit('search-patterns-changed', this.searchPatterns)
  console.log(searchPatterns.value)
}
const speciesChanged = () => {
  console.log(speciesPatterns.value);
  lastTimeWholeTableSearchParams.isHuman = speciesPatterns.value;
}
</script>

<template>
    <div>
        <el-row>
            <el-col :span="12">
                <el-checkbox-group v-model="searchPatterns" >
                    <el-checkbox label="miRNABinding" @change="checkBoxChanged"></el-checkbox>
                    <el-checkbox label="RBPBinding" @change="checkBoxChanged"></el-checkbox>
                    <el-checkbox label="cORF" @change="checkBoxChanged"></el-checkbox>
                    <el-checkbox label="IRES" @change="checkBoxChanged"></el-checkbox>
                    <el-checkbox label="m6A" @change="checkBoxChanged"></el-checkbox>
                </el-checkbox-group>
            </el-col>

        </el-row>
      <el-row>
        <el-col :span="12">
          <el-radio-group v-model="speciesPatterns">
            <el-radio label="0" size="large" @change="speciesChanged">Mouse</el-radio>
            <el-radio label="1" size="large" @change="speciesChanged">Human</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
    </div>
</template>

<style>
    .subfunction-title{
        font-size: 24px ;
        font-weight: bold;
        color: grey;
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