import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHashHistory } from 'vue-router';

import circRNA_search from './components/circRNA_search/circRNA_search.vue'
import circRNA_search_result from './components/circRNA_search_result/circRNA_search_result.vue'
import circRNA_identification_component from './components/circRNA_detail/circRNA_detail.vue'
// import "~/styles/element/index.scss";
// import ElementPlus from "element-plus";
// import all element css, uncommented next line
// import "element-plus/dist/index.css";
import { ref } from 'vue'

import "~/styles/index.scss";
import "uno.css";

// If you want to use ElMessage, import it.
import "element-plus/theme-chalk/src/message.scss";

const app = createApp(App);
const routes=[
    { path:'/circRNA_search', component:circRNA_search },
    { path:'/circRNA_search_result', component:circRNA_search_result },
    { path:'/circRNA_detail', component:circRNA_identification_component}
]
const router = createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: createWebHashHistory(),
    routes : routes, // short for `routes: routes`
})
export const axios_server_root_url = ref('http://localhost:5000/api')
export const circRNA_search_results = ref([])

export const result_count = ref(0)
export const circRNA_isoform_relations = ref([])
export const circRNA_identification = ref(null)
//app.config.globalProperties.circRNA_search_results = ref([])
app.use(router).mount("#app");
