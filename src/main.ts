import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHashHistory } from 'vue-router';

import circRNA_search from './components/circRNA_search/circRNA_search.vue'
import circRNA_search_result from './components/circRNA_search_result/circRNA_search_result.vue'
import circRNA_identification_component from './components/circRNA_detail/circRNA_detail.vue'
import blast_root from './components/blast_root/blast_root.vue'
import mirna_detail from './components/mirna_detail/mirna_detail.vue'
import IRES_detail from "./components/IRES_detail/IRES_detail.vue";
// import "~/styles/element/index.scss";
// import ElementPlus from "element-plus";
// import all element css, uncommented next line
// import "element-plus/dist/index.css";
import { ref, reactive } from 'vue'

import "~/styles/index.scss";
import "uno.css";

import "element-plus/theme-chalk/src/message.scss";
import axios from "axios";
import ORF_detail from "~/components/ORF_detail/ORF_detail.vue";
import m6A_detail from "~/components/m6A_detail/m6A_detail.vue"
import RBP_detail from "~/components/RBP_detail/RBP_detail.vue";
import home_page from "~/components/home_page/home_page.vue";
import download from "~/components/download/download.vue";

const app = createApp(App);
const routes=[
    { path:'/circRNA_search', component:circRNA_search },
    { path:'/circRNA_search_result', component:circRNA_search_result },
    { path:'/circRNA_detail', component:circRNA_identification_component},
    { path:'/blast_root', component:blast_root},
    { path:'/mirna_detail', component:mirna_detail},
    { path:'/IRES_detail', component:IRES_detail},
    { path:'/ORF_detail', component:ORF_detail},
    { path:'/m6A_detail', component:m6A_detail},
    { path:'/RBP_detail', component:RBP_detail},
    { path:'/home_page', component:home_page},
    { path:'/download', component:download},
]
const router = createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: createWebHashHistory(),
    routes : routes, // short for `routes: routes`
})
//export const axios_server_root_url = ref('http://139.196.108.62:5000/api')//服务器版
export const axios_server_root_url = ref('http://localhost:5000/api') //本地调试版

//option是环形结构图的配置
export const option = reactive({
    backgroundColor: '#FAFAFA',
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
        //backgroundColor: '#100C2A',
        top: '5%',
        left: 'center',
        data: []//这里写exons和introns的名字
    },
    series: [
        {
            name: 'Specific Expression',
            type: 'pie',
            colorBy: 'data',
            radius: ['45%', '60%'],
            labelLine: {
                length: 30
            },
            label: {
                formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                backgroundColor: '#F6F8FC',
                borderColor: '#8C8D8E',
                borderWidth: 1,
                borderRadius: 4,
                rich: {
                    a: {
                        color: '#6E7079',
                        lineHeight: 22,
                        align: 'center'
                    },
                    hr: {
                        borderColor: '#8C8D8E',
                        width: '100%',
                        borderWidth: 1,
                        height: 0
                    },
                    b: {
                        color: '#4C5058',
                        fontSize: 14,
                        fontWeight: 'bold',
                        lineHeight: 33
                    },
                    per: {
                        color: '#fff',
                        backgroundColor: '#4C5058',
                        padding: [3, 4],
                        borderRadius: 4
                    }
                }
            },
            data: [] //value + name
        }
    ]
});
export const circRNA_search_results = ref([])
export const speciesPatterns = ref("1")

export const result_count = ref(0)
export const circRNA_isoform_relations = ref([])
export const circRNA_identification = ref(null)

export const circRNA_wholetable_page_sublist = ref([])
export const lastTimeWholeTableSearchParams = {
    ID : '',
    IDtype : '',
    pageSize : 5,
    pageNo : 1,
    patternCode : 0,
    isHuman : 1
}
export const searchPatterns = ref([])
export const ORFdetails = ref([])
export const ORFcount = ref(0)
export const miRNAdetails = ref([])
export const miRNAcount = ref(0)
export const IRESdetails = ref([])
export const IREScount = ref(0)
export const ORFloading = ref(false)

export const m6Aloading = ref(false)
export const m6Adetails = ref([])
export const m6Acount = ref(0)
export const RBPloading = ref(false)
export const currentBSJ_is_human = ref(true)

export const RBPcount = ref(0)
export const RBPdetails = ref([])

export const circRNA_expression = ref({})
export const concerned_BSJ_isos = ref([])
export const concerned_BSJID = ref('')
export const fullscreenLoading = ref(false)
export const concerned_expression = ref({})
export const refresh_whole_table = (SearchParams) =>{
    //getting correct request API url
    console.log('refresh_whole was activated')
    console.log(SearchParams)
    let url = ''
    if(typeof SearchParams.ID === "undefined" || SearchParams.ID.length == 0){
        //ID为空，查询所有的记录。对应
        url = axios_server_root_url.value + '/bsj/' + SearchParams.isHuman + '/' +
            + SearchParams.pageNo + '/' + SearchParams.pageSize + '/' + SearchParams.IDtype
            + '/' + SearchParams.patternCode;
    }
    else{
        url = axios_server_root_url.value + '/bsj/' + SearchParams.isHuman + '/' +
            + SearchParams.pageNo + '/' + SearchParams.pageSize + '/' + SearchParams.IDtype
            + '/' + SearchParams.patternCode + '/' + SearchParams.ID;
    }
    console.log(url)
    //calculated patternCode
    //sending Request
    return axios.get(url).then(res=>{
        //写入全局变量circRNA_search_results,即表格内容

        //修理人类的数据以匹配小鼠
        for(var item of res.data.result){
            if(item.hasOwnProperty('geneid')){
                let temp = item.geneid;
                delete item.geneid;
                item.gene_id = temp;
            }
            if(item.hasOwnProperty('genename')){
                let temp = item.genename;
                delete item.genename;
                item.gene_name = temp;
            }
            if(item.hasOwnProperty('RBPcount')){
                let temp = item.RBPcount;
                delete item.RBPcount;
                item.RBP_count = temp;
            }
            if(item.hasOwnProperty('ORFcount')){
                let temp = item.ORFcount;
                delete item.ORFcount;
                item.ORF_count = temp;
            }
            if(item.hasOwnProperty('m6Acount')){
                let temp = item.m6Acount;
                delete item.m6Acount;
                item.m6A_count = temp;
            }
            if(item.hasOwnProperty('miRNAcount')){
                let temp = item.miRNAcount;
                delete item.miRNAcount;
                item.miRNA_count = temp;
            }
            if(item.hasOwnProperty('ciriisoform_count') && item.hasOwnProperty('isocisoformcount')){
                item.isoform_count = item.ciriisoform_count + item.isocisoformcount;
            }
            item.IRES_count = 0;
        }

        circRNA_wholetable_page_sublist.value = res.data.result

        console.log(circRNA_wholetable_page_sublist.value);


        result_count.value = res.data.count
        fullscreenLoading.value = false


        router.push('./circRNA_search_result')
    })
}
//app.config.globalProperties.circRNA_search_results = ref([])
app.use(router).mount("#app");
