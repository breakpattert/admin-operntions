<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.mate_id" placeholder="情侣id" class="filter-item" style="width:130px"></el-input>

      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.account_detail_type" placeholder="流水类型">
        <el-option v-for="item in journalList" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>

      <el-date-picker
          class="filter-item"
          v-model="dateSelect"
          type="daterange"
          align="right"
          placeholder="创建时间"
          format="yyyy-MM-dd"
          @change="updateListQueryDate"
          :default-value="dateSelect"
          :editable="false"
          :clearable="false"
          >
      </el-date-picker>

      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>

    </div>

    <el-table  :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号" width="65" type="index">
      </el-table-column>

      <el-table-column width="200px" align="center" label="情侣id">
        <template scope="scope">
          <span>{{scope.row.mate_id}}</span>
        </template>
      </el-table-column>

      <el-table-column  label="用户">
        <template scope="scope">
          <span>{{scope.row.user_name}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="流水类型" width="95">
        <template scope="scope">
          <span>{{ scope.row.type | journalListFilter}}</span>
        </template>
      </el-table-column>

       <el-table-column class-name="status-col" label="交易金额">
        <template scope="scope">
          <span>{{scope.row.amount}}</span>
        </template>
      </el-table-column>

      <el-table-column  label="交易方式">
        <template scope="scope">
          <span>{{scope.row.transaction_type | paymentListFilter}}</span>
        </template>
      </el-table-column>

      <el-table-column  label="第三方流水号">
        <template scope="scope">
          <span>{{scope.row.thirdparty_no}}</span>
        </template>
      </el-table-column>

      <el-table-column  label="创建时间">
        <template scope="scope">
          <span>{{scope.row.gmt_created | parseTime}}</span>
        </template>
      </el-table-column>

    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"  :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
    import {list} from 'api/journal';
    import { journalList, paymentList, journalListFilter, paymentListFilter } from '@/filters';
    import { parseTime } from 'utils';
    import { Message } from 'element-ui';

    export default {
      name: 'account_journal',
      data() {
        return {
          journalList,
          paymentList,
          dateSelect: [],
          list: null,
          total: null,
          listLoading: true,
          listQuery: {
            begin_date: null,
            end_date: null,
            mate_id: null,
            account_detail_type: null,
            page_size: 10,
            current_page: 1,
            limit: 10
          },
          tableKey: 0
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
        journalListFilter,
        paymentListFilter
      },
      methods: {
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
            if(d.data && d.data.pagination_d_t_o){
              this.list = d.data.pagination_d_t_o.datas;
              this.total = d.data.pagination_d_t_o.total_count;
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
