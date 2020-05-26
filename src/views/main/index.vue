<template>
    <div class="main">
        <el-container>
            <el-header>
                <v-header :userInfo="userInfo"></v-header>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <v-menu v-if="menuList.length" :menuList="menuList"></v-menu>
                </el-aside>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script>
 

import VHeader from '../../components/common/VHeader';
import VMenu from '../../components/common/VMenu'
import Cookie from 'js-cookie'
// import * as API from "@/api/login";
export default {
    name: 'Main',
    components: {
        VHeader,
        VMenu
    },
    data () {
        return {
            menuList:[],
            userInfo:{
            }
        }
    },
    mounted () {
        let data={
            menuList: ['/home', '/doctorManagement', '/HosManagement', '/OfficeManagement', '/DoctorManagement',
                '/caseManagement', '/CaseManagement', '/InjectionRecord', '/feedBack', '/IdeaManagement', '/systyemManagement', '/AccountManagement', '/RoleManagement']
        };
        // this.menuList=data.menuList;
        console.log(this.menuList,99999)
    },
    methods: {
    },
    created(){
        this.userInfo = JSON.parse(Cookie.get('userInfo'))
        console.log(this.userInfo,'userinfo')
        this.menuList = this.userInfo && this.userInfo.backgroundAuthorityList ? this.userInfo.backgroundAuthorityList : [];
    }
}
</script>
<style lang="stylus">
.main
    width: 100%;
    height: 100%;
    .el-header
        padding: 0;
    .el-container
        width: 100%;
        height: 100%;
</style>
