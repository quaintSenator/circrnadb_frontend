<script setup>
import {ElMessage} from "element-plus";

defineEmits(['concerned-isoform-changed'])
import {
  concerned_BSJ_isos,
  concerned_BSJID,
  concerned_expression,
  axios_server_root_url,
  miRNAdetails,
  miRNAcount,
  IRESdetails,
  IREScount,
  ORFdetails,
  ORFcount,
  ORFloading,
  m6Aloading,
  m6Adetails,
  m6Acount,
  RBPdetails,
  RBPloading,
  RBPcount,
  option,
  currentBSJ_is_human
} from '../../main.ts'
import {useRouter} from 'vue-router'
const router = useRouter()
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

provide(THEME_KEY, 'dark');
use([
    TitleComponent,
    LegendComponent,
    TooltipComponent,
    DatasetComponent,
    GridComponent,
    BarChart,
    PieChart,
    CanvasRenderer
])
const segments = ref([])
const iso_begin = ref(0)
const iso_end = ref(0)
const isolist = ref([])
const expressTableLoading = ref(false)
onMounted(()=>{
  isolist.value = getIsolist()
})
//const props = defineProps()
const updateopts = ref({
  notMerge: true,
  lazyUpdate: false
})
const getExpression = (isoID) => {
  console.log('getExpression...')
  let url = axios_server_root_url.value + '/expression/' + isoID + '/1'
  expressTableLoading.value = true;
  axios.get(url).then((res) => {
    concerned_expression.value = res.data.result[0]
    console.log(concerned_expression.value)

    exprOption_human.series[0].data = []
    exprOption_human.series[1].data = []

    for(let i = 0; i < concerned_expression.value.readArray.length; i++){
      if(i % 2 === 0){
        exprOption_human.series[0].data.push(concerned_expression.value.readArray[i]);
      }
      else{
        exprOption_human.series[1].data.push(concerned_expression.value.readArray[i]);
      }
    }
    expressTableLoading.value = false;
  }).catch((err)=>{
    console.log(err)
  })
}
const getMouseExpression = (isoID) => {
  console.log('getMouseExpression...')
  let url = axios_server_root_url.value + '/expression/' + isoID + '/0'
  expressTableLoading.value = true;
  axios.get(url).then((res) => {
    concerned_expression.value = res.data.result[0]
    /*"result": [
      {
          "isoformID": "chr5:143715284-143715649|143715284-143715649",
          "TBcount": [
              0,
              0
          ],
          "CCcount": [
              0,
              0
          ],
          "HPcount": [
              0,
              0
          ],
          "STcount": [
              0,
              2
          ]
      }
  ]
* */
    console.log(concerned_expression.value)
    //后端//0 for isoc & 1 for ciri
    exprOption_mouse.series[0].data = [
      concerned_expression.value.TBcount[0],
      concerned_expression.value.CCcount[0],
      concerned_expression.value.HPcount[0],
      concerned_expression.value.STcount[0]
    ]
    exprOption_mouse.series[1].data = [
      concerned_expression.value.TBcount[1],
      concerned_expression.value.CCcount[1],
      concerned_expression.value.HPcount[1],
      concerned_expression.value.STcount[1]
    ]


    expressTableLoading.value = false;
  }).catch((err)=>{
    console.log(err)
  })
}
const getSegments = (isoID) => {

  let concerned_exon_start_str = ''
  let concerned_exon_end_str = ''

  //找到concerned BSJ
  for(const isoItem of isolist.value){
    if(isoItem.isoformID === isoID){
      concerned_exon_start_str = isoItem.exonstart;
      concerned_exon_end_str = isoItem.exonend;
      break;
    }
  }
  let startlist = []
  let endlist = []

  //遍历start字符串
  let l = 0, r = 0;
  while(true){
    if(r >= concerned_exon_start_str.length || concerned_exon_start_str[r] === ','){
      //split
      let start_str = concerned_exon_start_str.substring(l, r)
      startlist.push(BigInt(start_str))
      if(r === concerned_exon_start_str.length)break;
      r++;//r 位移到下一个有效字符
      l = r;
    }
    else{
      r++;
    }
  }
  l = 0;
  r = 0;
  while(true){
    if(r >= concerned_exon_end_str.length || concerned_exon_end_str[r] === ','){
      //split
      let end_str = concerned_exon_end_str.substring(l, r)
      endlist.push(BigInt(end_str))
      if(r === concerned_exon_end_str.length)break;
      r++;//r 位移到下一个有效字符
      l = r;
    }
    else{
      r++;
    }
  }

  let list = []
  for(let i = 0; i < startlist.length; i++){
    let obj = {
      start: startlist[i],
      end: endlist[i]
    }
    list.push(obj)
  }
  return list

}
const getIsolist = ()=>{
  let list = []
  concerned_BSJ_isos.value.forEach((bsjiso)=>{
    if(bsjiso.BSJID === concerned_BSJID.value){
      list.push(bsjiso)
    }
  })
  return list;
}

//exprOption是差异表达柱状图的配置
const exprOption_human = reactive({
  //backgroundColor: '#FFFFFF',
  title: {
    text: 'Isoform Expression'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {},
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'value',
    boundaryGap: [0, 0.01]
  },
  yAxis: {
    type: 'category',
    data: ['HEK293', 'HEK293T', 'Hela', 'MCF-7', 'SH-SY5Y', 'SKOV3', 'VCaP', 'Adipose','Adrenal_gland',
    'Blood', 'Brain', 'Cortex', 'Heart', 'Kidney', 'Liver', 'Lung',
      'Prostate','Skeletal_muscle','Smooth_muscle','Testis']
  },
  series: [
    {
      name: 'CIRIlong',
      type: 'bar',
      data: []
    },
    {
      name: 'isoc',
      type: 'bar',
      data: []
    }
  ]
})

const exprOption_mouse = reactive({
  //backgroundColor: '#FFFFFF',
  title: {
    text: 'Isoform Expression'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {},
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'value',
    boundaryGap: [0, 0.01]
  },
  yAxis: {
    type: 'category',
    data: ['Total Brain', 'Celebral Cortex', 'hippocampus', 'striatum']
  },
  series: [
    {
      name: 'isoc',
      type: 'bar',
      data: []
    },
    {
      name: 'CIRI-long',
      type: 'bar',
      data: []
    }
  ]
})
const is_function_loading = ref(false)
const iso_function_search_radio = ref(0)
function onCurrentRowChanged(newRow, oldRow){
    console.log('isolist row changed')
    //刷新差异表达表
    if(currentBSJ_is_human.value){
      getExpression(newRow.isoformID)
    }
    else{
      getMouseExpression(newRow.isoformID)
    }

    //点击一个新的isoform行，表明需要查看其环形可视化图
    let ex_values = []
    let intro_values = []
    let ex_names = []
    let intro_names = []
    let current_isoform_id = newRow.isoformID

    segments.value = getSegments(current_isoform_id)

    for(let i = 0; i < segments.value.length; i++){
      ex_values.push(segments.value[i].end - segments.value[i].start)
      ex_names.push('exon#' + (i + 1))
      if(i > 0){
        intro_values.push(segments.value[i].start - segments.value[i - 1].end)
        intro_names.push('intro#' + i)
      }
    }
    for(let i = 0; i < intro_names.length; i++){
      ex_names.push(intro_names[i])
    }
    option.legend.data = ex_names
    //option.series[0].name  = res.data.result[0].isoform_id
    //option.series[0].name = current_isoform_id;
    option.series[0].name = ''

    option.series[0].data = []

    let all_item_count = ex_values.length + intro_values.length

    let isExon = true
    let ei = 0
    let ii = 0
    for(let i = 0; i < all_item_count; i++){
      //3ex 2intro; 4ex 3intro
      if(isExon){
        option.series[0].data.push({
          value : Number(ex_values[ei]),
          name: 'exon#' + (ei + 1)
/*          itemStyle: {
            color : "rgb(192,132,252)"
          }*/
        })
        ei++;
      }
      else{
        option.series[0].data.push({
          value : Number(intro_values[ii]),
          name: 'intron#' + (ii + 1),
          itemStyle: {
            color : "#bbb"
          }
        })
        ii++;
      }
      isExon = !isExon;
    }
}
function seeCurrentFunction(newRow){
  switch(iso_function_search_radio.value){
    case('1'):
      seeCurrentRowIsoMinra(newRow)
      break;
    case('2'):
      seeCurrentRowIsoORFs(newRow)
      break;
    case('3'):
      seeCurrentRowIsoIRES(newRow)
      break;
    case('4'):
      seeCurrentRowIsom6A(newRow)
      break;
    case('5'):
      break;
    case('6'):
      seeCurrentRowIsoRBP(newRow)
      break;
    default:
      console.log('default invoke')
      break;
  }
}
function seeCurrentRowIsoMinra(newRow, oldRow){
  console.log(newRow)
  is_function_loading.value = true
  let url = axios_server_root_url.value + '/mirna/5/1/'
      + newRow.isoformID
  console.log(url)
  axios.get(url).then((res) => {
    console.log(res.data)
    miRNAdetails.value = res.data.result;
    miRNAcount.value = res.data.count;
    is_function_loading.value = false
    router.push('./mirna_detail')
  })
}

function seeCurrentRowIsoIRES(newRow){
  console.log(newRow)
  is_function_loading.value = true
  let url = axios_server_root_url.value + '/IRES/1/5/'
      + newRow.isoformID
  axios.get(url).then((res)=>{
    console.log(res.data)
    IRESdetails.value = res.data.result
    IREScount.value = res.data.count
    is_function_loading.value = false
    if(IREScount.value > 0){
      router.push('./IRES_detail')
    }
    else{
      ElMessage('No IRES found in this isoform.')
    }

  }).catch((err)=>{
    console.log(err)
    is_function_loading.value = false
  })
}
function seeCurrentRowIsoORFs(newRow){
  is_function_loading.value = true
  ORFloading.value = true;
  let url = axios_server_root_url.value + '/isoorf/iso_orf/id/'
      + newRow.isoformID + '/PageNo/1/PageSize/5'
  console.log(url)
  axios.get(url).then((res)=>{
    console.log(res.data)
    ORFdetails.value = res.data.result
    ORFcount.value = res.data.count
    is_function_loading.value = false
    if(ORFcount.value > 0){
      router.push('./ORF_detail')
      ORFloading.value = false;
    }
    else{
      ElMessage('No ORF found in this isoform.')
      ORFloading.value = false;
    }
  }).catch((err)=>{
    console.log(err)
    is_function_loading.value = false
  })
}
function seeCurrentRowIsom6A(newRow){
  console.log('seeCurrentRowIsom6A')
  m6Aloading.value = true;
  is_function_loading.value = true;
  //localhost:5000/api/m6A/chr10:100051846-100064146|100051846-100051959,100064084-100064146/1/5
  let url = axios_server_root_url.value + '/m6A/' + newRow.isoformID +
      '/1/5'
  console.log(url)
  axios.get(url).then((res)=>{
    console.log(res.data)
    m6Adetails.value = res.data.result
    m6Acount.value = res.data.count
    if(m6Acount.value > 0){
      router.push('./m6A_detail')
      m6Aloading.value = false;
    }
    else{
      ElMessage('No m6A binding site found in this isoform.')
      m6Aloading.value = false;
    }
    is_function_loading.value = false;
  }).catch((err)=>{
    console.log(err)
  })
}
function seeCurrentRowIsoRBP(newRow){
  console.log('seeCurrentRowIsoRBP')
  RBPloading.value = true;
  is_function_loading.value = true;
  //  http://localhost:5000/api/RBP/chr10:100044905-100045501|100044905-100045501/1/5
  let url = axios_server_root_url.value + '/RBP/' + newRow.isoformID +
      '/1/5'
  console.log(url)
  axios.get(url).then((res)=>{
    console.log(res.data)
    RBPdetails.value = res.data.result
    RBPcount.value = res.data.count
    if(RBPcount.value > 0){
      router.push('./RBP_detail')
      RBPloading.value = false;
    }
    else{
      ElMessage('No RBP binding site found in this isoform.')
      RBPloading.value = false;
    }
    is_function_loading.value = false;
  }).catch((err)=>{
    console.log(err)
  })
}

function iso_function_model_changed(param){
  console.log(param)
  console.log(iso_function_search_radio.value)
}
</script>

<template>
    <div>
        <general_function_subtitle title="CircRNA Isoforms"></general_function_subtitle>
         <el-row>
            <el-table :data="isolist"
            :lazy="false"
            :highlight-current-row="true"
            style="width: 100%" highlight-current-row
                      :default-sort="{ prop:'order', order:'descending'}"
            @current-change="onCurrentRowChanged"
            >
            <el-table-column prop="order" label="iso_order"></el-table-column>
            <el-table-column prop="BSJID" label="BSJ ID"></el-table-column>
            <el-table-column prop="isoformID" label="isoform_id"></el-table-column>
            </el-table>
         </el-row>
      <general_function_subtitle title="Current Isoform Segments"></general_function_subtitle>
      <el-row>
        <el-table :data="segments"
                  :lazy="false"
                  :highlight-current-row="true"
                  style="width: 100%" highlight-current-row
        >
          <el-table-column prop="start" label="start"></el-table-column>
          <el-table-column prop="end" label="end"></el-table-column>
        </el-table>
      </el-row>
         <el-row>
            <v-chart class="chart" :option="option" :update-optionsoptions="updateopts" autoresize />
         </el-row>
      <general_function_subtitle title="isoform Expression"></general_function_subtitle>
      <el-row v-loading="expressTableLoading">
        <v-chart class="chart" v-if="currentBSJ_is_human"
        :option="exprOption_human" :update-optionsoptions="updateopts" autoresize />
        <v-chart class="chart" v-if="!currentBSJ_is_human"
                 :option="exprOption_mouse" :update-optionsoptions="updateopts" autoresize />
      </el-row>
        <general_function_subtitle title="function detail"></general_function_subtitle>
      <el-row>
        <el-table :data="isolist"
                  :lazy="false"
                  :highlight-current-row="true"
                  style="width: 100%" highlight-current-row
                  @current-change="seeCurrentFunction"
                  v-loading="is_function_loading"
        >
          <el-table-column prop="isoformID" label="isoform_id"></el-table-column>
        </el-table>

      </el-row>
      <el-radio-group v-model="iso_function_search_radio" @change="iso_function_model_changed">
        <el-radio label="1" size="large" border>miRNA</el-radio>
        <el-radio label="2" size="large" border>cORF</el-radio>
        <el-radio label="3" size="large" border>IRES</el-radio>
        <el-radio label="4" size="large" border>m6A</el-radio>
        <el-radio label="5" size="large" border>TIS</el-radio>
        <el-radio label="6" size="large" border>RBP</el-radio>
      </el-radio-group>
<!--        <isoform_mirna_sites ref="childCompMi"></isoform_mirna_sites>-->
    </div>
</template>

<style scoped>
.chart {
  height: 60vh;
}
</style>