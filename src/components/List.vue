<template>
<div class="list">
  <mu-appbar title="人员管理">
    <mu-text-field icon="search" v-model="searchName" class="appbar-search-field" slot="right" hintText="请输入搜索内容" @keydown.native.enter="searchUser"/>
    <mu-float-button icon="add" secondary mini slot="right" class="add-button" @click="open('bottom')"/>
  </mu-appbar>
  <mu-list>
    <mu-list-item v-for="(item, index) in userList" :key="index" :title="item.name" @click="showDetail(item._id)">
      <mu-avatar :src="item.avatar" slot="leftAvatar"/>
      <mu-icon value="delete" slot="right" @click.stop="deleteUser(item._id)"/>
      <mu-icon value="mode_edit" slot="right" @click.stop="editUser(item._id)"/>
    </mu-list-item>
  </mu-list>
  
  <!-- user详情部分 -->
  <mu-popup position="left" popupClass="user-detail-card" :open="leftPopup" @close="close('left')">
    <mu-content-block>
      <mu-paper class="demo-paper" circle :zDepth="2">
        <img :src="userInfoDetail.avatar" style="width:100px;height:100px;">
      </mu-paper>
      <mu-text-field label="姓名" v-model="userInfoDetail.name" type="text" icon="assignment_ind" fullWidth labelFloat/><br/>
      <mu-text-field label="年龄" v-model="userInfoDetail.age" type="number" icon="date_range" fullWidth labelFloat/><br/>
      <mu-text-field label="家庭住址" v-model="userInfoDetail.homeAddress" type="text" icon="home" fullWidth labelFloat/><br/>
      <mu-text-field label="电话号码" v-model="userInfoDetail.telNo" type="number" icon="phone" fullWidth labelFloat/><br/>
    </mu-content-block>
  </mu-popup>

  <!-- 添加user部分 -->
  <mu-popup position="bottom" popupClass="demo-popup-bottom" :open="bottomPopup" @close="close('bottom')">
    <mu-appbar title="新增">
      <mu-flat-button slot="right" label="关闭" color="white" @click="close('bottom')"/>
    </mu-appbar>
    <mu-content-block>
      <mu-text-field label="姓名" v-model="addUserInfo.name" type="text" icon="assignment_ind" fullWidth labelFloat/><br/>
      <mu-text-field label="头像" v-model="addUserInfo.avatar" type="text" icon="face" fullWidth labelFloat/><br/>
      <mu-text-field label="年龄" v-model="addUserInfo.age" type="number" icon="date_range" fullWidth labelFloat/><br/>
      <mu-text-field label="家庭住址" v-model="addUserInfo.homeAddress" type="text" icon="home" fullWidth labelFloat/><br/>
      <mu-text-field label="电话号码" v-model="addUserInfo.telNo" type="number" icon="phone" fullWidth labelFloat/><br/>
      <div class="btn-group">
        <mu-raised-button label="取消" icon="undo" @click="cancelAdd"/>
        <mu-raised-button label="确定" icon="check" primary @click="addUser" />
      </div>
    </mu-content-block>
  </mu-popup>

  <!-- 修改user部分 -->
  <mu-popup position="bottom" popupClass="demo-popup-bottom" :open="bottomEditPopup" @close="close('bottomEdit')">
    <mu-appbar title="新增">
      <mu-flat-button slot="right" label="关闭" color="white" @click="close('bottomEdit')"/>
    </mu-appbar>
    <mu-content-block>
      <mu-text-field label="姓名" v-model="editUserInfo.name" type="text" icon="assignment_ind" fullWidth labelFloat/><br/>
      <mu-text-field label="头像" v-model="editUserInfo.avatar" type="text" icon="face" fullWidth labelFloat/><br/>
      <mu-text-field label="年龄" v-model="editUserInfo.age" type="number" icon="date_range" fullWidth labelFloat/><br/>
      <mu-text-field label="家庭住址" v-model="editUserInfo.homeAddress" type="text" icon="home" fullWidth labelFloat/><br/>
      <mu-text-field label="电话号码" v-model="editUserInfo.telNo" type="number" icon="phone" fullWidth labelFloat/><br/>
      <div class="btn-group">
        <mu-raised-button label="取消更新" icon="undo" @click="cancelEdit"/>
        <mu-raised-button label="确定更新" icon="check" primary @click="confirmEdit(editUserInfo._id)" />
      </div>
    </mu-content-block>
  </mu-popup>

</div>
</template>
<script>
export default {
  data () {
    return {
      searchName: '',
      userList: [],
      leftPopup: false,
      bottomPopup: false,
      bottomEditPopup: false,
      editUserInfo: {},
      addUserInfo: {
        name: '',
        avatar: '',
        age: '',
        homeAddress: '',
        telNo: ''
      },
      userInfoDetail: {
        name: '',
        avatar: '',
        age: '',
        homeAddress: '',
        telNo: ''
      }
    }
  },
  created () {
    this.getUser()
  },
  methods: {
    open (position) {
      this[position + 'Popup'] = true
    },
    close (position) {
      this[position + 'Popup'] = false
    },
    showDetail (id) {
      // 根据id显示人员信息
      this.open('left')
      this.$http.get(`/api/user/${id}`)
        .then(res => {
          console.log(res)
          Object.assign(this.userInfoDetail, res.data[0])
        })
    },

    // 获取列表所有的user
    getUser () {
      this.$http.get('/api/user')
        .then(res => {
          this.userList = res.data
        })
    },
    addUser () {
      this.isEdit = false
      this.$http.post('/api/user', {
        addUserInfo: this.addUserInfo
      })
      .then(res => {
        if (res) {
          this.clearUserInfo()
          this.toastr.success('添加成功')
        } else {
          this.toastr.error('添加失败')
        }
        this.getUser()
        this.close('bottom')
      })
      .catch(error => {
        console.log(error)
      })
    },
    deleteUser (id) {
      this.$http.delete(`/api/user/${id}`)
        .then(res => {
          if (res.status === 200) {
            this.toastr.success('删除成功')
            this.getUser()
          } else {
            this.toastr.error('删除失败')
          }
        })
    },
    editUser (id) {
      this.open('bottomEdit')
      this.$http.get(`/api/user/${id}`)
        .then(res => {
          this.editUserInfo = res.data[0]
        })
    },
    confirmEdit (id) {
      this.$http.put(`/api/user/${id}`, {
        editUserInfo: this.editUserInfo
      })
      .then(res => {
        console.log(res)
        if (res.status === 200) {
          this.toastr.success('更新成功')
          this.getUser()
          this.bottomEditPopup = false
        } else {
          this.toastr.error('更新失败')
        }
      })
    },
    searchUser () {
      if (this.searchName) {
        this.$http.get(`api/users/${this.searchName}`)
          .then(res => {
            if (res.data.length >= 0) {
              this.userList = res.data
            } else {
              this.userList = []
            }
            this.searchName = ''
          })
      } else {
        return false
      }
    },
    cancelAdd () {
      this.clearUserInfo()
      this.close('bottom')
    },
    cancelEdit () {
      this.clearUserInfo()
      this.close('bottomEdit')
    },
    clearUserInfo () {
      Object.keys(this.addUserInfo).map(item => {
        this.addUserInfo[item] = ''
      })
    }
  }
}
</script>

<style lang="less">
.appbar-search-field{
  color: #FFF;
  margin-bottom: 0;
  &.focus-state {
    color: #FFF;
  }
  .mu-text-field-hint {
    color: fade(#FFF, 54%);
  }
  .mu-text-field-input {
    color: #FFF;
  }
  .mu-text-field-focus-line {
    background-color: #FFF;
  }
}
.add-button {
  margin-left: 20px;
}
.mu-item-right
  & > i + i{
    margin-left: 10px;
}
.mu-popup-bottom {
  bottom: 10px;
  min-width: 375px;
}
.btn-group {
  display: flex;
  justify-content: center;
}
.user-detail-card {
  display: flex;
  width: 85%;
  max-width: 375px;
  height: 100%;
  align-items: center;
  padding: 24px;
}
.demo-paper {
  display: inline-block;
  height: 100px;
  width: 100px;
  margin: 20px;
  text-align: center;
  overflow: hidden;
}
</style>