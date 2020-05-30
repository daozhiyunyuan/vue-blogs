<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="用户名">
              <a-input v-model="keywords" placeholder="请输入"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="角色">
              <a-select v-model="mdl.roleId">
                <a-select-option :value="item.id" v-for="item in roles" :key="item.id">{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="getUserList(null)">查询</a-button>
              <a-button style="margin-left: 8px" @click="handleAdd">新增</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <a-table
      ref="table"
      size="default"
      :columns="columns"
      :dataSource="loadData"
      :rowKey="record => record.id"
      :pagination="pagination"
      :loading="loading"
      :bordered="true"
    >
       <span slot="sex" slot-scope="text">
        {{ text | sexFilter }}
      </span>
      <span slot="status" slot-scope="text, record">
         <a-switch checkedChildren="正常" unCheckedChildren="禁用" v-model="record.status" :disabled="true"/>
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical"/>
        <a-dropdown>
          <a class="ant-dropdown-link">
            更多 <a-icon type="down"/>
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
                <a href="javascript:;" @click="deleteUser(record.id)">删除</a>
                <a v-if="record.status" href="javascript:;" @click="lockAccount(record.id,false)">禁用</a>
                <a v-else href="javascript:;" @click="lockAccount(record.id,true)">启用</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
    </a-table>

    <a-modal
      title="操作"
      style="top: 20px;"
      :width="800"
      v-model="visible"
      @ok="handleOk"
      :destroyOnClose="true"
    >
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="用户名"
          hasFeedback
        >
          <a-input placeholder="起一个名字" v-model="mdl.account" id="user_account"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="昵称"
          hasFeedback
        >
          <a-input placeholder="起一个呢称" v-model="mdl.name" id="user_name"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="性别"
          hasFeedback
        >
          <a-radio-group name="sex" v-model="mdl.sex">
            <a-radio :value="1">男</a-radio>
            <a-radio :value="2">女</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="用户头像"
          hasFeedback
        >
          <a-upload
            name="file"
            listType="picture-card"
            class="avatar-uploader"
            :showUploadList="false"
            action="/system/user/upload"
            :headers="headers"
            :beforeUpload="beforeUpload"
            @change="handleChange"
          >
            <img v-if="mdl.avatar" :src="mdl.avatar" alt="avatar" style="height:104px;max-width:300px"/>
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'"/>
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="密码"
          hasFeedback
        >
          <a-input placeholder="请输入密码" type="password" v-model="mdl.password" id="pass_word"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="角色"
          hasFeedback
        >
          <a-select v-model="mdl.roleId">
            <a-select-option :value="item.id" v-for="item in roles" :key="item.id">{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="状态">
          <a-switch checkedChildren="正常" unCheckedChildren="禁用" v-model="mdl.status"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
  import Vue from 'vue'
  import { STable } from '@/components'
  import { getUserList, modifyUser, addUser, selectRoles,deleteUser ,lockAccount} from '@/api/user'
  import { ACCESS_TOKEN } from '@/store/mutation-types'
  import qs from 'qs'
  function getBase64 (img, callback) {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  }

  export default {
    name: 'TableList',
    components: {
      STable
    },
    data () {
      return {
        isSystem: false,
        status: true,
        headers: {},
        imagePath: '',
        imageUrl: '',
        description: '',
        keywords: '',
        visible: false,
        form: this.$form.createForm(this),
        mdl: {},
        roles: [],
        type: 0,
        loading: false,
        // 表头
        columns: [
          {
            title: '用户名',
            dataIndex: 'name'
          },
          {
            title: '性别',
            dataIndex: 'sex',
            scopedSlots: { customRender: 'sex' }
          },
          {
            title: '邮箱',
            dataIndex: 'email'
          },
          {
            title: '创建时间',
            dataIndex: 'createTime',
            sorter: false
          },
          {
            title: '修改时间',
            dataIndex: 'modifyTime'
          },
          {
            title: '创建者',
            dataIndex: 'createBy'
          },
          {
            title: '修改者',
            dataIndex: 'modifyBy'
          },
          {
            title: '状态',
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' }
          },
          {
            title: '操作',
            width: '150px',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' }
          }
        ],
        // 加载数据方法 必须为 Promise 对象
        loadData: [],
        pagination: {
          pageNo: 1,
          pageSize: 10, // 默认每页显示数量
          showSizeChanger: true, // 显示可改变每页数量
          pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
          onShowSizeChange: (current, pageSize) => this.changeSize(current, pageSize), // 改变每页数量时更新显示
          onChange: (page, pageSize) => this.changePage(page, pageSize),//点击页码事件
          total: 0 //总条数
        },
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        selectedRowKeys: [],
        selectedRows: [],
      }
    },
    created () {
      const token = Vue.ls.get(ACCESS_TOKEN)
      this.headers = { 'Authorization': 'bearer ' + token }
      this.getUserList({
        pageNo: 1,
        pageSize: 10
      })
    },
    mounted () {
      selectRoles().then(res => {
        if(res.result){
          this.roles = res.result
        }
      })
    },
    filters: {
      sexFilter: function (sex) {
        const roleMap = {
          1: '男',
          2: '女'
        }
        return roleMap[sex]
      }
    },
    methods: {
      handleChange (info) {
        if (info.file.status === 'uploading') {
          this.loading = true
          return
        }
        if (info.file.status === 'done') {
          // Get this url from response in real world.
          this.imagePath = info.file.response.result
          console.log(info.file.response.result)
          getBase64(info.file.originFileObj, imageUrl => {
            this.mdl.avatar = imageUrl
            this.loading = false
          })
        }else{
          this.loading = true
          return
        }
      },
      beforeUpload (file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
        if (!isJpgOrPng) {
          this.$message.error('You can only upload JPG file!')
        }
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
          this.$message.error('Image must smaller than 2MB!')
        }
        return isJpgOrPng && isLt2M
      },
      handleEdit (record) {
        this.mdl = Object.assign({}, record, { password: '0|0|0|0|0|0' })
        this.type = 1
        this.visible = true
      },
      handleAdd () {
        this.mdl = {
          status: true,
          sex: 1
        }
        this.visible = true
        this.type = 2
      },
      handleOk () {
        const { mdl } = this
        if(this.imagePath){
          mdl.avatar = this.imagePath
        }
        if (this.type === 1) {
          this.modifyUser(mdl)
        } else if (this.type === 2) {
          this.addUser(mdl)
        }
        this.visible = false
      },
      changePage (page, pageSize) {
        this.getUserList({
          pageIndex: page,
          pageSize: pageSize,
          keywords: this.keywords
        })
      },
      changeSize (current, size) {
        this.getUserList({
          pageIndex: current,
          pageSize: size,
          keywords: this.keywords
        })
      },
      getUserList (params) {
        this.loading = true
        getUserList(params).then(res => {
          this.loadData = res.result.list
          this.pagination.total = res.result.total
          this.loading = false
        }).catch(err => {
          this.loading = false
        })
      },
      modifyUser (params) {
        console.log('修改用户',params)
        modifyUser(params).then(res => {
          this.$notification.success({
            message: '结果',
            description: res.msg
          })
          this.refresh()
        }).catch(err => {

        })
      },
      addUser (params) {
        console.log('添加用户',params)
        addUser(params).then(res => {
          this.$notification.success({
            message: '结果',
            description: res.msg
          })
          this.refresh()
        }).catch(err => {

        })
      },
      deleteUser(userId){
        console.log("删除用户",userId)
        deleteUser(userId).
        then(res=>{
          this.$notification.success({
            message: '结果',
            description: res.msg
          })
          this.refresh()
        }).catch(err => {

        })
      },
  lockAccount(id,status){
        console.log("修改用户状态",{id,status})
        lockAccount(qs.stringify({id:id,isLock:status})).
        then(res=>{
          this.$notification.success({
            message: '结果',
            description: res.msg
          })
          this.refresh()
        }).catch(err => {

        })
      },
      refresh () {
        console.log('刷新')
        this.getUserList({
          pageNo: 1,
          pageSize: 10
        })
      }
    }
    ,
    watch: {}
  }
</script>
