<script setup>
defineEmits(['concerned-isoform-changed'])
import { circRNA_identification, circRNA_isoform_relations, axios_server_root_url } from '../../main.ts'
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import axios from 'axios'
import general_function_subtitle from '../general_function_subtitle.vue'
import {
    LegendComponent,
    TooltipComponent,
    DatasetComponent,
    TitleComponent,
    GridComponent
} from 'echarts/components'
import isoform_mirna_sites from './isoform_mirna_sites.vue'
import { ScatterChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

use([GridComponent, ScatterChart, CanvasRenderer])
import VChart, { THEME_KEY } from 'vue-echarts';
import { ref, provide, reactive } from 'vue';
provide(THEME_KEY, 'dark');
use([
    TitleComponent,
    LegendComponent,
    TooltipComponent,
    DatasetComponent,
    GridComponent,
    BarChart,
    CanvasRenderer
])
//const props = defineProps()
const updateopts = ref({
    notMerge: true,
    lazyUpdate: false
})
const segments = ref([])
const iso_begin = ref(0)
const iso_end = ref(0)
const option = reactive({
    title: {
        text: 'Exons in current isoform',
        subtext: 'iso#1'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
        type: 'shadow'
    },
        formatter: function (params) {
            var tar = params[1];
            return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        splitLine: { show: false },
        data: ['exon#01', 'exon#02']
    },
    yAxis: {
        type: 'value',
        min: 0,
        max: 100
    },
    series: [
        {
            name: 'Placeholder',
            type: 'bar',
            stack: 'Total',
            itemStyle: {
                borderColor: 'transparent',
                color: 'transparent'
            },
            emphasis: {
                itemStyle: {
                    borderColor: 'transparent',
                    color: 'transparent'
                }
            },
            data: [0, 0]//102608927
        },
        {
            name: 'exon length',
            type: 'bar',
            stack: 'Total',
            label: {
                show: true,
                position: 'inside'
            },
            data: [0, 0]
        }
    ]
})
const childCompData = reactive({
    data4circ_mi_interact:{
        PageSize: 5,
        PageNo: 1
    }
})
const childCompMi = ref(null)
function getIsoBeginNEnd(iso_id){
    let colonPos = 0
    let minusPos = 0
    let underlinePos = 0
    for(let i = 0; i < iso_id.length; i++){
        if(iso_id[i] === ':'){
            colonPos = i
        }
        if(iso_id[i] === '-'){
            minusPos = i
        }
        if(iso_id[i] === '_'){
            underlinePos = i
        }
    }
    iso_begin.value = Number(iso_id.substring(colonPos + 1, minusPos))
    iso_end.value = Number(iso_id.substring(minusPos + 1, underlinePos))
}
function onCurrentRowChanged(newRow, oldRow){
    let current_isoform_id = newRow.isoform_id
    getIsoBeginNEnd(current_isoform_id)
    //查询mongodb:circRNAdb.isoform_details, 获取对应isoform_id的isoform_detail
    let url = ''
    url = axios_server_root_url.value + '/isoform/isoform/id/' + current_isoform_id
    axios.get(url).then(res=>{
        //根据isoform_id 查询isoform
        console.log(res.data.result[0])
        segments.value = res.data.result[0].segments
        for(let i = 0; i < segments.value.length; i++){
            segments.value[i].start += iso_begin.value;
            segments.value[i].end += iso_begin.value;
        }
        
        option.xAxis.data = []
        option.series[0].data = []
        option.series[1].data = []

        let xAxisList = []
        let startDataList = []
        let lengthDataList = []

        for(let i = 0; i < segments.value.length; i++){
            xAxisList.push('exon#' + (i + 1))
            startDataList.push(segments.value[i].start)
            lengthDataList.push(segments.value[i].end - segments.value[i].start)
        }
        option.xAxis.data = xAxisList
        option.series[0].data = startDataList
        option.series[1].data = lengthDataList
        option.yAxis.min = iso_begin.value
        option.yAxis.max = iso_end.value
        
        //通知子组件刷新
        childCompMi.value.refresh(current_isoform_id)
    })
}
</script>

<template>
    <div>
        <general_function_subtitle title="CircRNA Isoforms"></general_function_subtitle>
         <el-row>
            <el-table :data="circRNA_isoform_relations"
            :lazy="false"
            :highlight-current-row="true"
            style="width: 100%" highlight-current-row
            @current-change="onCurrentRowChanged"
            >
            <el-table-column prop="circFulldbID" label="circFulldbID"></el-table-column>
            <el-table-column prop="isoform_id" label="isoform_id"></el-table-column>
            </el-table>
         </el-row>
         <el-row>
            <v-chart class="chart" :option="option" :update-optionsoptions="updateopts" autoresize />
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
         
        <general_function_subtitle title="Current Isoform Detail"></general_function_subtitle>
        <!--注意：isoform_mirna_sites.vue现在被调整，作为circ_isoforms_subtable.vue的子组件。
        这是因为isoform_mirna_sites对于circ_isoforms_subtable具有依赖，当circ_isoforms_subtable发生更换表格选中行时，
        也应当告知isoform_mirna_sites重新查询
        -->
        <isoform_mirna_sites ref="childCompMi"></isoform_mirna_sites>
    </div>
</template>

<style scoped>
.chart {
  height: 60vh;
}
</style>