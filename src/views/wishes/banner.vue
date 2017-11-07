<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.delete_mark" placeholder="启用状态">
        <el-option v-for="item in  bannerStatusList" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      
      <!-- <el-date-picker
          class="filter-item"
          v-model="dateSelect"
          type="daterange"
          align="right"
          placeholder="选择日期范围"
          >
      </el-date-picker> -->

      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">新增</el-button>
    </div>

    <el-table  :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号" width="65" type="index">
      </el-table-column>

      <el-table-column width="200px" align="center" label="banner">
        <template scope="scope">
          <img :src="scope.row.banner_url" width="100%">
        </template>
      </el-table-column>

      <el-table-column  label="创建时间">
        <template scope="scope">
          <span>{{scope.row.gmt_created | parseTime}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态" width="95">
        <template scope="scope">
          <span>{{ scope.row.delete_mark | bannerStatusListFilter}}</span>
        </template>
      </el-table-column>

       <el-table-column class-name="status-col" label="操作时间">
        <template scope="scope">
          <span>{{scope.row.gmt_modified | parseTime}}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="操作">
        <template scope="scope">
          <el-button size="small" type="primary" @click="changeShelfStatus(scope.row)">{{scope.row.delete_mark | bannerStatusListFilter(true)}}</el-button>
          <el-button size="small" type="primary" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <!-- <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div> -->

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="large">
      <el-form class="small-space" :model="temp" label-position="left" label-width="100px" style='width: 80%; margin-left:50px;'>
          <el-form-item label="banner图片">
            <adminImage v-model="temp.banner_url"></adminImage>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
        <el-button v-else type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
    import {list, update, create, enable, detail, remove} from 'api/wishBanner';
    import { shelfStatus, wishList, shelfStatusList, wishListFilter, 
            checkWithdrawFilter, bannerStatusList, bannerStatusListFilter } from '@/filters';
    import { parseTime } from 'utils';
    import { Message } from 'element-ui';
    // import adminImage from 'components/Upload/adminImage';
    import adminImage from 'components/Upload/adminSingleImage';

    export default {
      name: 'wish_banner',
      data() {
        return {
          content: '',
          shelfStatusList,
          bannerStatusList,
          list: null,
          total: null,
          listLoading: true,
          listQuery: {
            delete_mark: null
          },
          temp: {
            id: undefined,
            banner_url: 'baidu.com',
          },
          dialogFormVisible: false,
          dialogStatus: '',
          textMap: {
            update: '编辑',
            create: '创建'
          },
          tableKey: 0
        }
      },
      components: {
        adminImage
      },
      created() {
        this.getList();
      },
      filters: {
        parseTime,
        bannerStatusListFilter
      },
      methods: {
        getList() {
          this.listLoading = true;
          list(this.listQuery).then(res => {
            var d = res.data;
            if(d.data && d.data.wish_banner_list){
              this.list = d.data.wish_banner_list;
              this.total = this.list.length;
            }else{
              this.list = [];
              this.total = 0;
            }
            this.listLoading = false;
          })
        },
        changeShelfStatus(row){
          var params = {
            banner_id: row.id,
            delete_mark: row.delete_mark == 0 ? 1 : 0
          }
          enable(params).then(res => {
            var d = res.data;
            this.$message({
              message: d.msg || '操作成功',
              type: 'success'
            });

            this.getList();
          })
        },
        handleFilter() {
          this.getList();
        },
        handleSizeChange(val) {
          this.listQuery.limit = val;
          this.getList();
        },
        handleCurrentChange(val) {
          this.listQuery.page = val;
          this.getList();
        },
        handleModifyStatus(row, status) {
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          row.status = status;
        },
        handleCreate() {
          this.resetTemp();
          this.dialogStatus = 'create';
          this.dialogFormVisible = true;
        },
        handleUpdate(row) {
          var temp = this.temp, self= this;
          detail({banner_id: row.id}).then(res => {
            var d = res.data;
            if(d.data && d.data.wish_banner){
              var info = d.data.wish_banner;
              temp.id = info.id;
              temp.banner_url = info.banner_url;

              this.dialogStatus = 'update';
              this.dialogFormVisible = true;
            }else{
              self.$message.error(d.msg || '操作失败')
            }
          })
        },
        handleDelete(row) {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          });
          const index = this.list.indexOf(row);
          this.list.splice(index, 1);
        },
        create() {
          var url = this.temp.banner_url;
          if(url && url !== ''){
            create({banner_url: url}).then(res => {
              console.log(res)
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              });
              this.dialogFormVisible = false;
              this.getList();
            })
          }else{
            this.$notify({
              title: '失败',
              message: '请选择图片',
              type: 'error',
              duration: 2000
            });
          }
          
        },
        update() {
          console.log(this.temp);
          var params = {
            banner_id: this.temp.id,
            banner_url: this.temp.banner_url
          }
          update(params).then(res => {
            console.log(res);
            if(res.data.success){
              this.dialogFormVisible = false;
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              });
              this.getList();
            }else{
              this.$notify({
                title: '失败',
                message: res.data.msg,
                type: 'error',
                duration: 2000
              })
            }
            
          })
        },
        remove(row){
          const params = {
            banner_id: row.id,
          },self = this;
          remove(params).then(res => {
            var d = res.data;
            if(res.data.code == "10000"){
              self.$message.success(d.msg || '操作成功')
            }else{
              self.$message.error(d.msg || '操作失败')
            }
            self.getList();
          })
        },
        resetTemp() {
          this.temp = {
            id: undefined,
            banner_url: '',
          };
        }

      }
    }
</script>
