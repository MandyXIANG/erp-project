<template>
  <div class="tag-nav">
    <scroll-bar ref="scrollBar" style="height:100%">
      <router-link
        ref="tag"
        class="tag-nav-item"
        :class="isActive(item) ? 'cur' : ''"
        v-for="(item, index) in tagNavList"
        :to="{ path: item.path, query: item.query }"
        :key="index"
        style="display:inline-block; "
        @contextmenu.prevent.native="openMenu(item, index, $event)"
      >
        {{ item.title }}
        <span
          class="close-icon"
          v-if="tagNavList.length > 1"
          @click.prevent.stop="closeTheTag(item, index)"
          ><i class="el-icon-close"></i
        ></span>
      </router-link>
    </scroll-bar>
    <ul
      :style="{ left: left + 'px', top: top + 'px' }"
      class="contextmenu"
      v-if="tagNavList.length > 1 && visible"
    >
      <li @click="closeTheTag(selectedTag, selectIndex)">关闭当前</li>
      <li @click="closeOtherTags(selectedTag)">关闭其他</li>
      <li @click="closeAll">关闭所有</li>
    </ul>
  </div>
</template>
<script>
import ScrollBar from './ScrollBar.vue'
export default {
  components: {
    ScrollBar
  },
  data () {
    return {
      defaultPage: '/main',
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      selectIndex: null
    }
  },
  computed: {
    tagNavList () {
      return this.$store.state.multitab.openedPageList
    }
  },
  mounted () {
    // 首次加载时将默认页面加入缓存
    this.addTagNav()
  },
  watch: {
    $route () {
      this.addTagNav()
      this.scrollToCurTag()
    },
    visible (value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  methods: {
    addTagNav () {
      this.$store.dispatch('multitab/initPageList')
      // 如果需要缓存则必须使用组件自身的name，而不是router的name
      if (this.$route.meta && this.$route.meta.tabName) {
        this.$store.commit('multitab/addTagNav', {
          name: this.$route.name,
          path: this.$route.path,
          title: this.$route.meta.tabName,
          fullpath: this.$route.fullPath,
          query: this.$route.query
        })
      }
    },
    isActive (item) {
      // 根据当前路由访问更新当前访问标签页面数据
      if (item.path === this.$route.path) {
        this.$store.commit('multitab/setCurrentTagNav', item)
      }
      return item.path === this.$route.path
    },
    closeTheTag (item, index) {
      // 当关闭当前页面的Tag时，则自动加载前一个Tag所属的页面
      // 如果没有前一个Tag，则加载默认页面
      this.$store.commit('multitab/removeTagNav', item)
      if (this.$route.path === item.path) {
        // 去掉当前页面之后，还有已打开的tab页面时
        if (this.tagNavList.length !== 0) {
          // 关闭的页面不为已打开页面的首个tab页面
          if (index !== 0) {
            this.$router.push({
              path: this.tagNavList[index - 1].path,
              query: this.tagNavList[index - 1].query
            })
          } else {
            // 关闭首个tab页面
            this.$router.push({
              path: this.tagNavList[index].path,
              query: this.tagNavList[index].query
            })
          }
        } else {
          // 已经没有已打开的tab页面，默认打开首页
          this.$router.push(this.defaultPage)
        }
      }
      this.visible = false
      this.scrollToCurTag()
    },
    // 根据当前访问页面滚动到相应标签位置
    scrollToCurTag () {
      if (this.$refs.tag) {
        this.$nextTick(() => {
          for (const item of this.$refs.tag) {
            if (item.to.path === this.$route.path) {
              this.$refs.scrollBar.scrollToCurTag(item.$el)
              break
            }
          }
        })
      }
    },
    openMenu (item, index, e) {
      this.left = e.clientX + 15
      this.top = 25
      this.selectedTag = item
      this.selectIndex = index
      this.visible = true
    },
    closeMenu () {
      this.visible = false
    },
    closeOtherTags (item) {
      this.$store.commit('multitab/deleteOtherTags', item)
      this.$router.push({
        path: item.path,
        query: item.query
      })
      this.scrollToCurTag()
    },
    closeAll () {
      this.$store.dispatch('multitab/clearAllTag')
      this.$router.push(this.defaultPage)
      this.addTagNav()
    }
  }
}
</script>
<style lang="scss" scoped>
.tag-nav {
  width: 100%;
  .tag-nav-item {
    margin-right: $padding-md;
    color: $--color-primary-light-5;
    height: 40px;
    line-height: 40px;
    padding: 0 5px;
    border-radius: 3px;
    text-decoration: none;
    .close-icon {
      opacity: 0;
    }
    &:hover {
      background: $--color-primary-light-2;
      .close-icon {
        opacity: 1;
      }
    }
  }
  .cur {
    color: #fff !important;
  }

  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>
