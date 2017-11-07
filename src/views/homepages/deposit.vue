<template>
  <div class="app-container">
    <!-- <div class="filter-container">
      <el-input v-model="listQuery.mobile" placeholder="手机号" class="filter-item" style="width:130px"></el-input>

      <el-date-picker
          class="filter-item"
          v-model="dateSelect"
          type="daterange"
          align="right"
          placeholder="创建时间"
          @change="updateListQueryDate"
          >
      </el-date-picker>

      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>

    </div> -->

    <el-table  :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号" width="65" type="index">
      </el-table-column>

      <el-table-column width="200px" align="center" label="平均存款">
        <template scope="scope">
          <span>{{scope.row.avg_amount}}</span>
        </template>
      </el-table-column>

      <el-table-column  label="添加时间">
        <template scope="scope">
          <span>{{scope.row.gmt_modified | parseTime}}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="操作" width="260">
        <template scope="scope">
          <el-button size="small" type="primary" @click="editor(scope.row)">编辑</el-button>
        </template>
      </el-table-column>

    </el-table>
    

    <el-dialog title="编辑" :visible.sync="dialogStatement" size="large">
      
      <el-form class="small-space" label-position="left" label-width="120px" style='width: 80%; margin-left:50px;'>
        <el-form-item label="平均存款">
          <el-input-number v-model="temp.avg_amount"></el-input-number>
        </el-form-item>
      </el-form> 

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogStatement = false">取 消</el-button>
        <el-button type="primary" @click="updateDeposit">确 定</el-button>
      </div>

    </el-dialog>


    <!-- <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10]"
        :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div> -->

  </div>
</template>

<script>
    import {list, editor} from 'api/deposit';
    import { genderListFilter } from '@/filters';
    import { parseTime } from 'utils';
    import { Message } from 'element-ui';

    export default {
      name: 'users',
      data() {
        return {
          dateSelect: [],
          list: null,
          total: null,
          listLoading: true,
          listQuery: {
            begin_date: null,
            end_date: null,
            mobile: null,
            page_size: 10,
            current_page: 1
          },
          temp: {
            avg_amount: 0,
            day_sort: 0
          },
          tableKey: 0,
          dialogStatement: false
        }
      },
      components: {
      },
      created() {
        var now = Date.now(), lastWeek = now - 3600 * 1000 * 24 * 7;
        var s_time = parseTime(lastWeek), e_time = parseTime(now);
        this.dateSelect = [s_time, e_time];
        this.updateListQueryDate();
        this.getList();
      },
      filters: {
        parseTime,
        genderListFilter
      },
      methods: {
        editor(row){
          this.temp = {
            avg_amount: row.avg_amount,
            day_sort: row.day_sort
          }
          this.dialogStatement = true;
        },
        updateDeposit(){
          const self = this;
          editor(this.temp.day_sort, this.temp.avg_amount).then(res => {
            console.log(res.data);
            self.getList();
            this.dialogStatement = false;
          })
        },
        updateListQueryDate(){
          var dateSelect = this.dateSelect;
          if(dateSelect.length == 2){
            this.listQuery.begin_date = parseTime(dateSelect[0]);
            this.listQuery.end_date = parseTime(dateSelect[1]);
          }
        },
        getList() {
          this.listLoading = true;
          list(this.listQuery).then(res => {
            var d = res.data;
            console.log(d)
            if(d.data && d.data.day_avg_topup){
              var data = d.data.day_avg_topup;
              this.list = data;
            }else{
              this.list = [];
              this.total = 0;
            }
            this.listLoading = false;
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
          this.listQuery.current_page = val;
          this.getList();
        }

      }
    }
</script>
