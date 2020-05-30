<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="查询时间">
              <a-date-picker
                format="YYYY-MM-DD"
                v-model="startTime"
                placeholder="Start"
              />
              <a-date-picker
                format="YYYY-MM-DD"
                placeholder="End"
                v-model="endTime"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="操作类型">
              <a-input placeholder="请输入" v-model="keywords"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="getLogList(null)">查询</a-button>
               <a-popconfirm
                 title="删除七天前的日志?"
                 @confirm="deleteLog"
                 okText="确定"
                 cancelText="取消"
               >
              <a-button style="margin-left: 8px" type="danger">删除</a-button>
               </a-popconfirm>
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
      :loading = "loading"
    >
    </a-table>

  </a-card>
</template>

<script>
import { STable } from '@/components'
import { logList, deleteLog } from '@/api/log'
import moment from 'moment'
export default {
  name: 'TableList',
  components: {
    STable
  },
  data () {
    return {
      dateFormat: 'YYYY/MM/DD',
      startTime: moment(),
      endTime: moment(),
      keywords: '',
      description: '',
      visible: false,
      loading: false,
      form: null,
      mdl: {},

      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '用户名',
          dataIndex: 'userName'
        },
        {
          title: '操作类型',
          dataIndex: 'actionType'
        },
        {
          title: '具体操作',
          dataIndex: 'remark',
          sorter: true
        },
        {
          title: 'Ip地址',
          dataIndex: 'userIp'
        },
        {
          title: '操作时间',
          dataIndex: 'addTime'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: [],

      selectedRowKeys: [],
      selectedRows: [],
      pagination: {
        pageNo: 1,
        pageSize: 10, // 默认每页显示数量
        showSizeChanger: true, // 显示可改变每页数量
        pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
        onShowSizeChange: (current, pageSize) => this.changeSize(current,pageSize), // 改变每页数量时更新显示
        onChange:(page,pageSize)=>this.changePage(page,pageSize),//点击页码事件
        total:0 //总条数
      }
    }
  },
  created(){
    this.getLogList({
      pageIndex: 1,
      pageSize: 10,
      startTime: this.startTime,
      endTime: this.endTime,
      keywords: this.keywords,
      dateSort: 1
    })
  },
  methods: {
    moment,
    changePage(page,pageSize){
      this.getLogList({
        pageIndex: page,
        pageSize: pageSize,
        startTime: this.startTime,
        endTime: this.endTime,
        keywords: this.keywords,
        dateSort: 1
      })
    },
    changeSize(current, size){
     this.getLogList({
       pageIndex: current,
       pageSize: size,
       startTime: this.startTime,
       endTime: this.endTime,
       keywords: this.keywords,
       dateSort: 1
     })
    },
    getLogList(params){
      this.loading = true
      if(!params){
        params = {
          pageIndex: 1,
          pageSize: 10,
          startTime: this.startTime,
          endTime: this.endTime,
          keywords: this.keywords,
          dateSort: 1
        }
      }
      logList(params).then(res=>{
        this.loadData = res.data.list
        this.pagination.total = res.data.totalCount
        this.loading = false
      }).catch(err=>{
        this.loading = false
      })
    },
    deleteLog(){
      deleteLog().then(res=>{
        this.$notification.open({
          message: '结果',
          description: res.msg,
        })
        this.getLogList(null)
      }).catch(err=>{

      })
    }
  },
  watch: {
    startTime(val) {
      console.log('startValue', val)
    },
    endTime(val) {
      console.log('endValue', val)
    },
  }
}
</script>
