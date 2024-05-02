<script lang="ts" setup>
import {provide, reactive, ref} from 'vue'
import {use} from "echarts/core";
import {DatasetComponent, GridComponent, LegendComponent, TitleComponent, TooltipComponent} from "echarts/components";
import {BarChart, PieChart, ScatterChart} from "echarts/charts";
import {CanvasRenderer} from "echarts/renderers";
import VChart, {THEME_KEY} from "vue-echarts";
import type { TableColumnCtx } from 'element-plus'
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
const human_iso_option = reactive({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    data: ['detected_with_CIRI-long', 'detected_with_isoCirc']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'value'
    }
  ],
  yAxis: [
    {
      type: 'category',
      axisTick: {
        show: false
      },
      data: ['HEK293', 'HEK293T', 'Hela', 'MCF-7', 'SH-SY5Y', 'SKOV3', 'VCaP', 'Adipose','Adrenal_gland',
        'Blood', 'Brain', 'Cortex', 'Heart', 'Kidney', 'Liver', 'Lung', 'Prostate','Skeletal_muscle','Smooth_muscle','Testis']
    }
  ],
  series: [
    {
      name: 'detected_with_CIRI-long',
      type: 'bar',
      label: {
        show: true,
        position: 'inside'
      },
      emphasis: {
        focus: 'series'
      },
      data: [174470,0,12752,22891,19704,15623,20265,17660,33795,96330,250124,220248,1425,49962,124964,48511,83653,29293,44091,69434]
    },
    {
      name: 'detected_with_isoCirc',
      type: 'bar',
      stack: 'Total',
      label: {
        show: true
      },
      emphasis: {
        focus: 'series'
      },
      data: [336712,18175,32568,31334,25193,56297,29194,14586,54903,47232,80685,3305,15859,54736,23561,41715,13029,12672,19565,122564]
    }
  ]
});
const mouse_iso_option = reactive({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    data: ['detected_with_CIRI-long', 'detected_with_isoCirc']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'value'
    }
  ],
  yAxis: [
    {
      type: 'category',
      axisTick: {
        show: false
      },
      data: ['Total Brain', 'Cerebral Cortex', 'hippocampus', 'striatum']
    }
  ],
  series: [
    {
      name: 'detected_with_CIRI-long',
      type: 'bar',
      label: {
        show: true,
        position: 'inside'
      },
      emphasis: {
        focus: 'series'
      },
      data: [387016, 185090,149961,185518]
    },
    {
      name: 'detected_with_isoCirc',
      type: 'bar',
      stack: 'Total',
      label: {
        show: true
      },
      emphasis: {
        focus: 'series'
      },
      data: [183110, 98173, 86308, 96594]
    }
  ]
});
const updateopts = ref({
  notMerge: true,
  lazyUpdate: false
})
const functionData = ref([{
  cORF:1861130,
  nBSJORF:8436542,
  IRES:26909,
  m6A:19077000,
  RBP:13872366,
  miRNA:11881367
}])
interface BSJ{
  db: string
  species: string
  detectedCount: number
  totalCount: number
}

const otherDBData = ref([{
  db:"circAtlas",
  species:"Mouse",
  totalCount: 287654,
  detectedCount: 33041
},
  {
    db:"circAtlas",
    species:"Human",
    totalCount: 768987,
    detectedCount: 190067
  },
  {
    db:"circBase",
    species:"Human",
    totalCount: 92135,
    detectedCount: 34580
  },{
    db:"circBase",
    species:"Mouse",
    totalCount: 1903,
    detectedCount: 1494
  }
])
interface SpanMethodProps {
  row: BSJ
  column: TableColumnCtx<BSJ>
  rowIndex: number
  columnIndex: number
}
const objectSpanMethod = ({
                            row,
                            column,
                            rowIndex,
                            columnIndex,
                          }: SpanMethodProps) => {
  if (columnIndex === 0) {
    if (rowIndex % 2 === 0) {
      return {
        rowspan: 2,
        colspan: 1,
      }
    } else {
      return {
        rowspan: 0,
        colspan: 0,
      }
    }
  }
}
/*190067	768987
33041	287654
34580	92135
1494	1903*/
</script>

<template>
  <div>
    <el-row :gutter="10">
      <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
        <div class="grid-content ep-bg-purple" />
        <img src="/src/assets/circlogo.png" alt="" />
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-card>
          <div slot="header">Welcome to <el-text tag="b" size="large">circFulldb</el-text>!</div>
        </el-card>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="14">
        <el-card>
          <div slot="header">circRNAs included in <el-text tag="b" size="large">circFulldb</el-text></div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8"> <el-card>
        <div class="card-content">
          <el-text tag="b" size="large">circRNA</el-text>
          are a class of RNAs with covalently closed structure,
          widely existing in eukaryotes and playing a variety of biological
          functions. Currently, circRNAs included in existing databases
          were identified and reconstructed from short reads sequencing,
          which makes it difficult to distinguish the overlap regions
          with corresponding lineartranscripts and delineate their
          sequence composition. <br/><br/>
          Here, we developed a database named <el-text tag="b" size="large">circFulldb</el-text>, which aims to
          acquire known and novel full-length circRNAs identified by
          nanopore sequencing technology. circFulldb integrated the
          <el-text tag="b" size="large">full-length</el-text> circRNAs and their expression andisoforms and
          function profiles in human and mouse species, thus providing
          database users with an efficient and convenient way to
          investigate the biological function and sequence
          structures of circRNAs.
        </div>
      </el-card>
      </el-col>
      <el-col :span="8">
        <v-chart class="chart" :option="human_iso_option" :update-optionsoptions="updateopts" autoresize />
      </el-col>
      <el-col :span="8">
        <v-chart class="chart" :option="mouse_iso_option" :update-optionsoptions="updateopts" autoresize />
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="8">
        <el-card>
          <div slot="header">Function Analysis Results</div>
        </el-card>
      </el-col>
      <el-col :span="6"></el-col>

      <el-col :span="8"></el-col>
    </el-row>
    <el-row>
      <el-col :span="14">
        <el-table :data="functionData">
          <el-table-column prop="cORF" label ="cORF"></el-table-column>
          <el-table-column prop="nBSJORF" label="nBSJ-ORF"></el-table-column>
          <el-table-column prop="IRES" label="IRES"></el-table-column>
          <el-table-column prop="m6A" label="m6A binding site"></el-table-column>
          <el-table-column prop="RBP" label="RBP binding site"></el-table-column>
          <el-table-column prop="miRNA" label="miRNA binding site"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-card>
          <div slot="header">circRNAs also detected in <el-text tag="b" size="large">other dbs</el-text></div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="14">
        <el-table :data="otherDBData" :span-method="objectSpanMethod">
        <el-table-column prop="db" label="db"></el-table-column>
        <el-table-column prop="species" label="species"></el-table-column>
        <el-table-column prop="detectedCount" label="detectedCount"></el-table-column>
        <el-table-column prop="totalCount" label="totalCount"></el-table-column>
      </el-table></el-col>

    </el-row>
  </div>
</template>

<style lang="scss">
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
 .demo-radius .title {
   color: var(--el-text-color-regular);
   font-size: 18px;
   margin: 10px 0;
 }
.demo-radius .value {
  color: var(--el-text-color-primary);
  font-size: 16px;
  margin: 10px 0;
}
.demo-radius .radius {
  height: 40px;
  width: 70%;
  border: 1px solid var(--el-border-color);
  border-radius: 0;
  margin-top: 20px;
}
.card-header {
  text-align: left;
}
.card-content {
  padding: 20px;
  text-align: left;
}
</style>