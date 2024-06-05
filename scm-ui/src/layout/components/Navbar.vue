<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" v-if="!topNav"/>
    <top-nav id="topmenu-container" class="topmenu-container" v-if="topNav"/>

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <search id="header-search" class="right-menu-item" />

        <el-popover
          placement="bottom"
          width="400"
          trigger="hover">
          <el-badge class="right-menu-item hover-effect" slot="reference">
            <i class="el-icon-message-solid" @click="toNoticePage"></i>
          </el-badge>
          <div v-for="(item,index) in noticeList">
            <el-link type="primary" @click="toNoticePage">
            <span>{{ item.noticeTitle }}</span>
            </el-link>
            <span style="float: right">发布于{{ item.createTime }}</span>
            <el-divider></el-divider>
          </div>
          <el-link type="primary" style="float: right" @click="toNoticePage">更多</el-link>
        </el-popover>

<!--        <el-tooltip content="源码地址" effect="dark" placement="bottom">-->
<!--          <ruo-yi-git id="scm-git" class="right-menu-item hover-effect" />-->
<!--        </el-tooltip>-->

<!--        <el-tooltip content="文档地址" effect="dark" placement="bottom">-->
<!--          <ruo-yi-doc id="scm-doc" class="right-menu-item hover-effect" />-->
<!--        </el-tooltip>-->

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>

      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/profile">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <el-dropdown-item @click.native="setting = true">
            <span>布局设置</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import TopNav from '@/components/TopNav'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import ScmGit from '@/components/Scm/Git'
import ScmDoc from '@/components/Scm/Doc'
import {Notification} from "element-ui"
import { listTop3 } from "@/api/system/notice"

export default {
  components: {
    Breadcrumb,
    TopNav,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search,
    ScmGit,
    ScmDoc
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ]),
    setting: {
      get() {
        return this.$store.state.settings.showSettings
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val
        })
      }
    },
    topNav: {
      get() {
        return this.$store.state.settings.topNav
      }
    }
  },
  data(){
    return{
      noticeContent:'',//通知内容
      noticeCount:0,//通知数量
      intervalId: null,
      url: "ws://localhost:8090/websocket/message",
      message: "",
      text_content: "",
      ws: null,
      noticeList: []
    }
  },
  mounted() {
    this.notice();
    const wsuri = this.url;
    this.ws = new WebSocket(wsuri);
    const self = this;

    this.ws.onopen = function (event) {
      self.text_content = self.text_content + "已经打开连接!" + "\n";
    };

    this.ws.onmessage = function (event) {
      //console.log(event)
      self.text_content = event.data + "\n";
      //let messageBody = JSON.parse(event.data);
      Notification.info({
        title: "通知",
        dangerouslyUseHTMLString: true,
        message: event.data,
        duration: 0,
        offset: 40,
        onClick: function () {
          self.$router.push({
            path: "/system/notice",
          });
        },
      });
    };

    this.ws.onclose = function (event) {
      self.text_content = self.text_content + "已经关闭连接!" + "\n";
    };
  },
  methods: {
    toNoticePage(){
      this.$router.push({
        path: "/system/notice",
      });
    },
    notice() {
      listTop3().then(response => {
        this.noticeList = response.rows;
      })
    },
    // join() {
    //
    // },
    exit() {
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }
    },
    send() {
      if (this.ws) {
        this.ws.send(this.message);
      } else {
        alert("未连接到服务器");
      }
    },
    warnDetailByWarnid(warnid) {
      // 跳转预警详情页面
      this.$router.push({
        path: "/XXX/XXX",
        query: {
          warnid: warnid,
        },
      });
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          location.href = '/index';
        })
      }).catch(() => {});
    },

  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
    ::v-deep .el-badge__content {
      margin-top: 9px;/* 调整一下上下左右你喜欢的位置 */
      margin-right: 7px;
    }

    //.badge-custom {
    //  animation: blink-animation 0.5s infinite alternate; /* 设置闪烁动画 */
    //}

    @keyframes blink-animation {
      0% { opacity: 1; } /* 定义动画起始状态 */
      100% { opacity: 0.1; } /* 定义动画结束状态 */
    }
  }
}
</style>
