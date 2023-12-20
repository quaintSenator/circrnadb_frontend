<script>
export default{
    props:[''],
    
    data(){
        return{
            searchPatterns:[]
        }
    },
    methods:{
        checkBoxChanged(status){
            this.$emit('search-patterns-changed', this.searchPatterns)
        }
    }
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
                    <el-checkbox label="TIS" @change="checkBoxChanged"></el-checkbox>
                </el-checkbox-group>
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