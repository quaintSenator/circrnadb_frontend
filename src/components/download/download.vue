<script setup>
import axios from 'axios'
import {useRoute, useRouter} from 'vue-router'
import { axios_server_root_url} from '../../main.ts'
import { ref } from 'vue'
import { ElNotification, ElMessage } from 'element-plus'
const router = useRouter()
const route = useRoute()

const tableData = ref([
  {
    filename: "human_iso_final.json",
    discription: "人类亚型信息"
  },
  {
    filename: "human_IRES_final.json",
    discription: "人类IRES信息"
  },
  {
    filename: "human_bsj_atlas_base.json",
    discription: "人类BSJ信息"
  },
  {
    filename: "human_micro.json",
    discription: "人类miRNA信息"
  },
  {
    filename: "ORF_processed.json",
    discription: "小鼠ORF信息"
  },
  {
    filename: "mouse_bsj_atlas_base.json",
    discription: "小鼠BSJ信息"
  },
  {
    filename: "m6a_output.json",
    discription: "小鼠m6a信息"
  },
  {
    filename: "mouseIRES.json",
    discription: "小鼠IRES信息"
  },
  {
    filename: "mouse_isos2Append.json",
    discription: "小鼠isoform信息"
  },
  {
    filename: "RBP_output_correct_v3.json",
    discription: "小鼠RBP信息"
  },
  {
    filename: "mousemiRNA.json",
    discription: "小鼠miRNA信息"
  },
])
function download_which(currentRow){
  console.log(currentRow)
}
function currentRowChanged(newRow){
  console.log(newRow)
}

</script>

<template>
  <div>
    <el-row>
      <el-col :span="10"><el-card>
        <el-table :data="tableData" :highlight-current-row="true" @current-change="currentRowChanged">
          <el-table-column prop="filename" label="filename"></el-table-column>
          <el-table-column prop="discription" label="discription"></el-table-column>
        </el-table>
      </el-card>
      </el-col>
      <el-col :span="10">
        <el-card align="left">
            注意，若浏览器无法正常启动下载，请右键对应链接-复制链接地址-采用Edge或其他下载工具下载<br>
          Note, if the browser can not start the download, please right-click the corresponding link - copy the link address - use Edge or other download tools to download<br><br>
            <a href="http://139.196.108.62/download/human_iso_final.json">human_iso_final.json</a> <br><br>
            <a href="http://139.196.108.62/download/human_IRES_final.json">human_IRES_final.json</a> <br><br>
            <a href="http://139.196.108.62/download/human_bsj_atlas_base.json">human_bsj_atlas_base.json</a> <br><br>
            <a href="http://139.196.108.62/download/human_micro.json">human_micro.json</a> <br><br>
            <a href="http://139.196.108.62/download/ORF_processed.json"> ORF_processed.json</a> <br><br>
            <a href="http://139.196.108.62/download/mouse_bsj_atlas_base.json">mouse_bsj_atlas_base.json</a> <br><br>
            <a href="http://139.196.108.62/download/m6a_output.json">m6a_output.json</a> <br><br>
            <a href="http://139.196.108.62/download/mouseIRES.json">mouseIRES.json</a> <br><br>
            <a href="http://139.196.108.62/download/mouse_isos2Append.json">mouse_isos2Append.json</a> <br><br>
            <a href="http://139.196.108.62/download/RBP_output_correct_v3.json">RBP_output_correct_v3.json</a> <br><br>
            <a href="http://139.196.108.62/download/mousemiRNA.json">mousemiRNA.json</a> <br><br>
        </el-card>
      </el-col>



    </el-row>
  </div>
</template>