<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <a-button @click="handleAdd()" type="primary" icon="plus">新增</a-button>
      <a-button
        @click=""
        v-if="selectedRowKeys.length > 0"
        ghost
        type="primary"
        icon="delete">批量删除
      </a-button>
    </div>
    <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
      <i class="anticon anticon-info-circle ant-alert-icon"></i>已选择&nbsp;<a style="font-weight: 600">{{
      selectedRowKeys.length }}</a>项&nbsp;&nbsp;
      <a style="margin-left: 24px" @click="clearAll()">清空</a>
    </div>
    <s-table
      :bordered="true"
      :columns="columns"
      :data="loadData"
      :rowKey="record => record.id"
      ref="menu"
      :showPagination="false"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
    >

      <span slot="status" slot-scope="text">
        {{ text | statusFilter }}
      </span>
      <span slot="type" slot-scope="text">
        {{ text | typeFilter }}
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
              <a href="javascript:;" @click="handleInfo(record)">详情</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;" @click="deleteMenu(record.id)">删除</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
    </s-table>
    <permission-modal ref="modalForm" :tree-data="ResourceName" @refresh="refreshMenu()"></permission-modal>
  </a-card>
</template>

<script>
  import PermissionModal from './modules/PermissionModal'
  import { STable } from '@/components'
  import { mapActions } from 'vuex'
  import qs from 'qs'

  export default {
    name: 'TableList',
    components: {
      STable,
      PermissionModal
    },
    data () {
      return {
        description: '',
        display: true,
        disable: false,
        visible: false,
        type: 0,
        isMenu: '',
        ResourceName: [],
        linkUrl: '',
        iconChooseVisible: false,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        form: this.$form.createForm(this),
        mdl: {},

        // 高级搜索 展开/关闭
        advanced: false,
        // 查询参数
        queryParam: {},
        // 表头
        columns: [
          {
            title: this.$t('menuList.columns[0]'),
            dataIndex: 'title'
          },
          {
            title: this.$t('menuList.columns[2]'),
            dataIndex: 'component'
          },
          {
            title: this.$t('menuList.columns[4]'),
            dataIndex: 'hidden',
            scopedSlots: { customRender: 'status' }
          },
          {
            title: this.$t('menuList.columns[5]'),
            dataIndex: 'seq'
          },
          {
            title: this.$t('menuList.columns[7]'),
            dataIndex: 'path'
          },
          {
            title: this.$t('menuList.columns[8]'),
            dataIndex: 'icon'
          },
          {
            title: this.$t('menuList.columns[3]'),
            dataIndex: 'type',
            scopedSlots: { customRender: 'type' }
          },
          {
            title: this.$t('menuList.columns[6]'),
            width: '150px',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' }
          }
        ],
        // 加载数据方法 必须为 Promise 对象
        loadData: () => {
          return this.Permission().then(res => {
            console.log(res)
            const result = res.result
            console.log(result)
            this.ResourceName = this.getResources(result, [])
            this.ResourceName.push({ key: 0, value: '0', title: '一级菜单' })
            console.log('资源菜单', this.ResourceName)
            const permission = {
              data: result
            }
            console.log(permission)
            return permission
          }).catch(err => {
            return err
          })
        },
        loading: false,
        selectedRowKeys: [],
        selectedRows: []
      }
    },
    filters: {
      statusFilter (status) {
        const statusMap = {
          1: '隐藏',
          0: '显示'
        }
        return statusMap[status]
      },
      typeFilter (type) {
        const statusMap = {
          1: '菜单',
          2: '按钮'
        }
        return statusMap[type]
      }
    },
    created () {
    },
    methods: {
      ...mapActions(['Permission', 'Verification', 'DeleteMenu']),
      handleEdit (record) {
        this.$refs.modalForm.edit(record)
        this.$refs.modalForm.title = '编辑'
        this.$refs.modalForm.disableSubmit = false
      },
      clearAll(){
        this.selectedRowKeys = []
      },
      handleInfo (record) {
        this.$refs.modalForm.edit(record)
        this.$refs.modalForm.title = '详情'
        this.$refs.modalForm.disableSubmit = true
      },
      handleAdd () {
        this.$refs.modalForm.add()
        this.$refs.modalForm.title = '新增'
        this.$refs.modalForm.disableSubmit = false
      },
      selectIcons () {
        this.iconChooseVisible = true
      },
      handleCancel () {
        this.disable = false
      },
      handleIconCancel () {
        this.iconChooseVisible = false
      },
      handleIconChoose (value) {
        console.log(value)
        this.mdl.icon = value
        this.iconChooseVisible = false
      },
      onSelectChange (selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys
      },
      toggleAdvanced () {
        this.advanced = !this.advanced
      },
      refreshMenu () {
        this.$refs.menu.refresh(true)
      },
      deleteMenu (id) {
        this.loading = true
        console.log('id', qs.stringify({ mId: id }))
        this.DeleteMenu(qs.stringify({ mId: id })).then(res => {
          this.notice(res)
        }).catch(err => {

        })
        setTimeout(() => {
          this.loading = false
          this.selectedRowKeys = []
        }, 1000)
      },
      checkComponent (rule, value, callback) {
        console.log('参数', value)
        this.Verification({ checkName: 'component', checkValue: value }).then(res => {
          if (this.type === 2) {
            callback()
          }
          if (res.result) {
            callback()
          } else {
            console.log(res.msg)
            callback(res.msg)
          }
        }).catch(err => {
          console.log(err)
        })
      },
      notice (res) {
        this.$notification.success({
          message: '结果',
          description: res.msg
        })
      },
      getResources (result, tree) {
        for (let res of result) {
          let item = {
            key: res.id,
            title: res.title,
            value: String(res.id),
            children: []
          }
          if (res.children) {
            this.getResources(res.children, item.children)
          }
          tree.push(item)
        }
        return tree
      }
    },
    computed: {
      hasSelected () {
        return this.selectedRowKeys.length > 0
      }
    },
    watch: {}
  }
</script>
