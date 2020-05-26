<template>
    <div class="v-menu">
        <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
            <el-radio-button :label="false">展开</el-radio-button>
            <el-radio-button :label="true">收起</el-radio-button>
        </el-radio-group> -->
        <!-- 导航菜单 -->
        <el-menu :default-active="defaultActive" class="el-menu-vertical-demo" unique-opened router>
            <template v-for="(item,i) in menu">
                <el-menu-item v-if="item.index=='/home'" :index="item.index" :key="i">
                    <template>
                        <i :class="item.icon"></i>
                        <span slot="title">{{item.title}}</span>
                    </template>
                </el-menu-item>
                <!-- 下拉菜单 -->
                <template v-else-if="item.subs">
                    <el-submenu :index="item.index" :key="i">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{item.title}}</span>
                        </template>
                        <!-- <el-menu-item-group> -->
                        <!-- <span slot="title">分组一</span> -->
                        <el-menu-item v-for="(sub,j) in item.subs" :index="sub.index" :key="j">{{sub.title}}
                        </el-menu-item>
                        <!-- </el-menu-item-group> -->
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="i">
                        <i :class="item.icon"></i>
                        <span slot="title">{{item.title}}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
export default {
    props: {
        menuList: {
            type: Array,
            default: () => {
                let arr = ['/home', '/doctorManagement', '/HosManagement', '/OfficeManagement', '/DoctorManagement',
                    '/caseManagement', '/CaseManagement', '/InjectionRecord', '/feedBack', '/IdeaManagement', '/systyemManagement', '/AccountManagement', '/RoleManagement'];
                return arr;
            }
        }
    },
    data() {
        return {
            menu: this.menuList,
        };
    },
    computed: {
        defaultActive() {
            return this.$route.path || '/';
        }
    },
    created() {
        // this.getSideTitle();
        console.log(this.menu,222222)
    },
    methods: {
        getSideTitle() {
            let titleList = [
                {
                    icon: 'el-icon-s-home',
                    index: '/home',
                    title: '首页',
                    display: true
                },
                {
                    icon: 'el-icon-s-management',
                    index: '/doctorManagement',
                    title: '医生管理',
                    display: true,
                    subs: [
                        {
                            index: '/HosManagement',
                            title: '· 医院管理',
                            display: true
                        },
                        {
                            index: '/OfficeManagement',
                            title: '· 科室管理',
                            display: true
                        },
                        {
                            index: '/DoctorManagement',
                            title: '· 医生管理',
                            display: true
                        },
                    ]
                },
                {
                    icon: 'el-icon-office-building',
                    index: '/caseManagement',
                    title: '患者管理',
                    display: true,
                    subs: [
                        {
                            index: '/CaseManagement',
                            title: '· 患者管理',
                            display: true
                        }, {
                            index: '/InjectionRecord',
                            title: '· 注射记录',
                            display: true
                        }
                    ]
                },
                {
                    icon: 'el-icon-search',
                    index: '/IdeaManagement',
                    title: '意见反馈',
                    display: true
                },
                {
                    icon: 'el-icon-reading',
                    index: '/systyemManagement',
                    title: '系统管理',
                    display: true,
                    subs: [
                        {
                            index: '/AccountManagement',
                            title: '· 账号管理',
                            display: true
                        }, {
                            index: '/RoleManagement',
                            title: '· 角色管理',
                            display: true
                        }
                    ]
                },
            ];
            if (this.menuList.indexOf('/home') == -1) {
                this.menuList.push('/home')
            }
            // this.menuList.push('/dial-mng')
            // this.menuList.push('/videoBack')
            // this.menuList.push('/insuranceList')
            // this.menuList.push('/dailyRecommend')
            let arr = titleList.map((item) => {
                let index = item.index;
                let itemObj;
                if (this.menuList.indexOf(index) != -1) {
                    itemObj = new Object;
                    itemObj = {
                        icon: item.icon,
                        index: item.index,
                        title: item.title,
                        display: item.display,
                        subs: []
                    };
                    if (item.subs && item.subs.length) {
                        item.subs.forEach(i => {
                            if (this.menuList.indexOf(i.index) != -1) {
                                itemObj.subs.push(i)
                            }
                        })
                    }
                }
                if (itemObj)
                    return itemObj
            });
            arr = arr.filter(item => {
                if (item)
                    return item
            });
            this.menu = arr;
        }
    }
}
</script>

<style lang="stylus">
    .v-menu
        height: 100%;
        user-select: none;

        .el-menu-vertical-demo:not(.el-menu--collapse)
            width: 200px;
            height: 100%;

        .el-menu-item
            &.is-active
                background: #ecf5ff
</style>
