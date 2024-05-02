<script setup>
import {axios_server_root_url, RBPloading, RBPdetails, RBPcount, option} from "~/main";
const router = useRouter()
const route = useRoute()
import {ElMessage} from "element-plus";
import {useRoute, useRouter} from "vue-router";
const RBP_pageSize = ref(5);
const RBP_table_pageNo = ref(1);
import { use } from 'echarts/core'
import { BarChart, PieChart,ScatterChart } from 'echarts/charts'
import general_function_subtitle from '../general_function_subtitle.vue'
import {
  LegendComponent,
  TooltipComponent,
  DatasetComponent,
  TitleComponent,
  GridComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import axios from "axios"
import VChart, { THEME_KEY } from 'vue-echarts';
import {ref, provide, reactive, computed, onMounted} from 'vue';
use([GridComponent, ScatterChart, CanvasRenderer])

const updateopts = ref({
  notMerge: true,
  lazyUpdate: false
})
function onCurrentPageChange(newPageNo){
  RBPloading.value = true
  let sameIso = RBPdetails.value[0].isoformID
  //  http://localhost:5000/api/RBP/chr10:100044905-100045501|100044905-100045501/1/5
  let url = axios_server_root_url.value + '/RBP/'
      + sameIso + '/' + RBP_table_pageNo.value + '/' + RBP_pageSize.value;
  console.log(url)
  axios.get(url).then((res) => {
    console.log(res.data)
    RBPdetails.value = res.data.result
    RBPloading.value = false;
  }).catch((err)=>{
    console.log(err)
  })
}
function onCurrentRowChange(newRow){
  console.log(newRow)
  console.log(option)
  option.series[1] = {
    name: 'RBP_sites',
    type: 'pie',
    selectedMode: 'single',
    radius: ['70%', '80%'],
    label: {
      position: 'inner',
      fontSize: 14
    },
    labelLine: {
      show: false
    },
    data:[]
  }
  option.series[1].data = []
  let currentPos = 0;
  let segPositions = []
  let in_ex_totalLen = 0
  for(let i = 0; i < option.series[0].data.length; i++){
    in_ex_totalLen += option.series[0].data[i].value;
  }
  let lenLeft = in_ex_totalLen
  newRow.BindingPos.sort((a, b) =>{
    return a - b
  })
  for(let i = 0; i < newRow.BindingPos.length; i++){
    //newRow.BindingPos中有若干个开始位点；开始位点-开始位点+6就是目标区域
    //以目前的314 & 595 为例，应该生成314, 6, 595 - 320, 6
    let realPos = positionInCirc2InGenome(newRow.BindingPos[i]);

    option.series[1].data.push({
      value: realPos - currentPos,
      name: '',
      itemStyle: {
        color: '#888'
      }
    });
    lenLeft -= (realPos - currentPos)
    option.series[1].data.push({
      value: 6,
      name: 'No' + (i + 1) + ' motif=' + newRow.Motifs[i] + ', Kmers=' + newRow.Kmers[i]
    });
    lenLeft -= 6
    currentPos = realPos + 6
  }
  option.series[1].data.push({
    value: lenLeft,
    name: ' ',
    itemStyle: {
      color: '#888'
    }
  })
}

function positionInCirc2InGenome(RBP_pos){
  //输入一个RBP开始位置，输出一个绝对位置：标识RBP片段在环上的start
  let memoriezedInput = RBP_pos
  let rawDatas = option.series[0].data
  let runPos = 0
  let r = 0
  while(r < rawDatas.length){
    if(memoriezedInput <= rawDatas[r].value){
      //跑不出这个exon,此时memoriedInput里剪掉了前面所有的内外片段，剩余值是在最后一个片段内的偏移
      runPos += memoriezedInput
      break;
    }
    else{
      //能跑完这个exon
      memoriezedInput -= rawDatas[r].value
      runPos += rawDatas[r].value
      if(r !== rawDatas.length - 1){
        memoriezedInput -= rawDatas[r + 1].value
        runPos += rawDatas[r + 1].value//跑掉当前exon和下一个
      }
      else{//如果rawData已经到了最后一个外显子位置，则不要继续前进
        runPos += memoriezedInput
        break;
      }
    }
    r += 2;
  }
  //此时runPos就是结果
  console.log('getting...' + runPos)
  return runPos

}
</script>

<template>
  <div>
    <el-table :data="RBPdetails" v-loading="RBPloading" @currentChange="onCurrentRowChange">
      <el-table-column prop="isoformID" label="isoformID"></el-table-column>
      <el-table-column prop="Protein" label="Protein"></el-table-column>

    </el-table>
    <el-pagination
        v-model:current-page="RBP_table_pageNo"
        :page-size="RBP_pageSize"
        :total="RBPcount"
        @current-change="onCurrentPageChange"
        background layout="prev, pager, next"  />

      <v-chart class="chart" :option="option" :update-optionsoptions="updateopts" autoresize />

  </div>
</template>

<style scoped>
.chart {
  height: 60vh;
}
</style>