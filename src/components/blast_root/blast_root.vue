<script setup>
import axios from 'axios'
import {useRoute, useRouter} from 'vue-router'
import { axios_server_root_url} from '../../main.ts'
import { ref } from 'vue'
import { ElNotification, ElMessage } from 'element-plus'
const router = useRouter()
const route = useRoute()

const textdata = ref('')
const isLoading = ref(false)
const blastResPack = ref(null)
const reportFileName = ref('')
const isReportCompleted = ref(false)
const uploadingFile = ref(null);

const try_cmd_on_nginx = ()=>{
    let req_url = axios_server_root_url.value + '/ex/exec/ps';
    //http://139.96.108.62:5000/api/ex/exec/ps
    axios.get(req_url).then(res => {
        console.log(res.data)
    })
}
const notice2 = () => {
    let msg = ''
    if(blastResPack.value.isCompleted){
        msg = 'BLAST success, file ' + blastResPack.value.resultFileName + ' is built.';
        //{isCompleted: true, failReason: '', resultFileName: '1b1f3ab9.out'}
    }
    else{
        msg = 'BLAST fail, reason: ' + blastResPack.value.failReason;
    }
    let ntcobj = {
        type: blastResPack.value.isCompleted? 'success' : 'warning',
        message: msg
    }
    console.log('elnotification obj = ')
    console.log(ntcobj)
    ElMessage(ntcobj)
}
const submit_input_text = () => {
    //139.196.108.62:5000/api/exblaststr/blaststr
    let req_url = axios_server_root_url.value + '/exblaststr/blaststr/' + encodeURIComponent(textdata.value)
    console.log('sending to:' + req_url)
    isLoading.value = true;
    axios.get(req_url).then(res => {
        isLoading.value = false;
        console.log(res.data)
        blastResPack.value = res.data;
        //{isCompleted: true, failReason: '', resultFileName: '1b1f3ab9.out'}
    }).then(res => {
        notice2();
        if(blastResPack.value.isCompleted){
            reportFileName.value = blastResPack.value.resultFileName
            isReportCompleted.value = true;
        }
    })
}
const handle_file_change = () => {
    console.log('file changed:')
    console.log(uploadingFile.value.files)
    //通过uploadingFile.value.files[0].name获取文件名
}
const upload_file = () => {
    if(uploadingFile.value !== null){
        let file2Post = uploadingFile.value.files[0]
        console.log(file2Post)
        /*
        //如何取用blob数据：
        file2Post.text().then((result)=>{
            console.log(result);
        })*/
        let formData = new FormData();
        formData.append('file', file2Post)
        isLoading.value = true
        //开始等待
        axios.post(axios_server_root_url.value + '/upload/blastfile', formData, {
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        }).then((res)=>{
            blastResPack.value = res.data
            isLoading.value = false
            console.log(res)
            if(res.data.isCompleted){
                isReportCompleted.value = true
                reportFileName.value = res.data.resultFileName
            }
            notice2()
        }).catch((err)=>{
            console.log(err)
        })
    }
}
const request_download = () => {
    axios({
        url: axios_server_root_url.value + '/download/download/' + reportFileName.value, // 139.196.108.62:5000/api/download/file.out
        method: 'GET',
        responseType: 'blob', // 设置为'blob'很重要
    }).then((res)=>{
        // 在浏览器内存中创建文件链接
        const href = URL.createObjectURL(res.data);

        // 创建一个带有文件链接的"a" HTML元素并点击
        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download',   reportFileName.value); // 或者其他扩展名
        document.body.appendChild(link);
        link.click();

        // 清理创建的文件链接和HTML元素
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
    })
}
</script>

<template>
<div>
    <el-row :gutter="12">
        <el-col :span="6">
            <el-card shadow="hover">BLAST(Basic Local Alignment Search Tool) is designed to find regions of similarity between biological sequences. </el-card>
            <el-card shadow="hover">BLAST expects fasta file or text input.</el-card>
        </el-col>
        <el-col :span="6" v-loading="isLoading">
            <el-card shadow="hover">Upload a local file, or input fasta in this input area.</el-card>
            <input ref="uploadingFile" type="file" v-on:change="handle_file_change">
            <el-button @click="upload_file">Upload file</el-button>
            <el-input v-model="textdata" :row="2"
            type="textarea" placeholder="fasta text" />
            <el-button @click="submit_input_text">Submit text</el-button>
            <el-button v-if="isReportCompleted" @click="request_download" link=true>Download {{reportFileName}}</el-button>
        </el-col>
    </el-row>
    
  
</div>
</template>
<style scoped>
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 480px;
}
</style>