<script setup>
const props = defineProps({
    title: String,
    frontoffset: Number
})
</script>
<template>
    <el-row>
        <el-col :span="12" :offset="props.frontoffset">
            <div class="bg-purple subfunction-title grid-content">
                {{props.title}}
            </div>
        </el-col>
   </el-row>
</template>