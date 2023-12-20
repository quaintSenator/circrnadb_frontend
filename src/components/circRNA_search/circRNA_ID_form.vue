//circRNA_ID_form.vue
<script>
export default {
    name:"circRNA_ID_form",
    data(){
        return{
            options:[
                {value:'circAtlasID',label:'circAtlasID'},
                {value:'circBaseID',label:'circBaseID'},
                {value:'circFulldbID',label:'circFulldbID'},
                ],
            formContent:{
                IDtype:'circAtlasID',
                inputID:''
            }
            
        }
    },
    mounted() {
        
    },
    methods:{
        onSubmit(){
            //onSubmit在提交键按下时触发
            this.$emit('search-submit', this.formContent)
        }
    }
   
}
</script>

<template>
    <div>
        <el-row>
            <el-col :span="4">
                <el-select v-model="formContent.IDtype" placeholder="circAtlasID">
                    <el-option v-for="option in options" :key="option.value"
                    :label="option.label" :value="option.value"></el-option>
                </el-select>
            </el-col>
            <el-col :span="8" >
                <el-input class="grid-content" v-model="formContent.inputID"></el-input>
            </el-col>
            <el-col :span="4">
                <el-button @click="onSubmit">Submit</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<style>
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