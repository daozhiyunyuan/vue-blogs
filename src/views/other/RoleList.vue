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
      size="default"
      :columns="columns"
      :data="loadData"
      :showPagination="false"
      :rowKey="record => record.Id"
      ref="role"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
    >
      <span slot="IsSys" slot-scope="text">
        {{ text | isSysFilter }}
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
              <a href="javascript:;" @click="handleAuth(record.id)">授权</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;" @click="handleDelete(record.id)">删除</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
    </s-table>

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
          label="角色名称"
          hasFeedback
        >
          <a-input placeholder="起一个名字" v-model="mdl.name" id="role_name"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="角色编码"
          hasFeedback
        >
          <a-input placeholder="起一个名字" v-model="mdl.code" id="role_code"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="排序"
          hasFeedback
        >
          <a-input
            placeholder=""
            id="seq"
            v-decorator="[
              'seq',
              {
                initialValue: mdl.seq,
                rules: [{ required: true, message: '排序不能为空,且必须是数字',pattern:'^[0-9]*$'}],
              }
            ]"
          />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="系统管理员">
          <a-switch checkedChildren="是" unCheckedChildren="否" v-model="mdl.isSystem"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="描述"
          hasFeedback
        >
          <a-textarea :rows="5" v-model="mdl.description" placeholder="..." id="describe"/>
        </a-form-item>
      </a-form>
    </a-modal>
    <user-role-modal ref="modalUserRole"></user-role-modal>
  </a-card>
</template>

<script>
  import { STable } from '@/components'
  import UserRoleModal from '@/components/Role/UserRoleModal'
  import { modifyRole, authRole, getRoles, addRole, deleteRole } from '@/api/manage'
  import qs from 'qs'

  export default {
    name: 'TableList',
    components: {
      STable,
      UserRoleModal
    },
    data () {
      return {
        description: '',
        visible: false,
        author: false,
        type: 0,
        checkAll: false,
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
            title: '角色名称',
            dataIndex: 'name'
          },
          {
            title: '角色编码',
            dataIndex: 'code'
          },
          {
            title: '创建时间',
            dataIndex: 'createTime'
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
            title: '排序',
            dataIndex: 'seq',
            sorter: (a, b) => a.seq - b.seq
          },
          {
            title: '操作',
            width: '150px',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' }
          }
        ],
        // 加载数据方法 必须为 Promise 对象
        loadData: () => {
          return getRoles()
            .then(res => {
              console.log('getRoleList', res)
              const roles = {
                data: res.result
              }
              return roles
            }).catch(err => {
              return err
            })
        },
        selectedRowKeys: []
      }
    },
    filters: {
      isSysFilter: function (isSys) {
        const isSysMap = {
          0: '否',
          1: '是'
        }
        return isSysMap[isSys]
      }
    },
    created () {
    },
    methods: {
      handleEdit (record) {
        this.mdl = Object.assign({}, record)
        if (this.mdl.seq) {
          this.mdl.seq = String(this.mdl.seq)
        }
        this.type = 2
        this.visible = true
      },
      onSelectChange (selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys
      },
      handleOk () {
        const {
          form: { validateFields },
          mdl
        } = this
        validateFields({ force: true }, (errs, values) => {
          if (!errs) {
            this.visible = false
            const param = {}
            param.id = mdl.id
            param.name = mdl.name
            param.code = mdl.code
            param.seq = values.seq
            param.description = mdl.description
            if (this.type === 1) {
              addRole(param).then(res => {
                this.notice(res)
                this.$refs.role.refresh(true)
              }).catch(err => {

              })
            } else if (this.type === 2) {
              modifyRole(param).then(res => {
                this.notice(res)
                this.$refs.role.refresh(true)
              }).catch(err => {

              })
            } else if (this.type === 3) {
              const auth = {}
              this.author = false
              auth.rId = mdl.id
              auth.resources = this.selectedRowKeys
              console.log(auth)
              authRole(auth).then(res => {
                this.notice(res)
                this.$refs.role.refresh(true)
              }).catch(err => {

              })
            }
          }
        })
      },
      handleAdd () {
        this.mdl = {}
        this.visible = true
        this.type = 1
      },
      clearAll(){
        this.selectedRowKeys = []
      },
      handleAuth (roleId) {
        this.$refs.modalUserRole.show(roleId)
      },
      handleDelete (roleId) {
        deleteRole(qs.stringify({ rId: roleId })).then(res => {
          this.notice(res)
          this.$refs.role.refresh(true)
        }).catch(err => {

        })
      },
      toggleAdvanced () {
        this.advanced = !this.advanced
      },
      notice (res) {
        this.$notification.success({
          message: '结果',
          description: res.msg
        })
      }
    },
    watch: {}
  }
</script>
