<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form :inline="true" class="demo-form-inline">
        <el-input v-model="listQuery.mate_id" placeholder="情侣id" class="filter-item" style="width:130px"></el-input>
        
        <el-form-item label="审核状态:">
          <el-select clearable style="width: 130px" class="filter-item" v-model="listQuery.status" placeholder="审核状态">
            <el-option v-for="(item, index) in checkWithdrawStatusList" :key="item.status" :label="item.name" :value="item.status">
            </el-option>
          </el-select>
        </el-form-item>
        
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
      </el-form>
    </div>

    <el-table  :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row >
      <el-table-column align="center" label="序号" width="65" type="index">
      </el-table-column>

      <el-table-column width="80px" align="center" label="情侣id">
        <template scope="scope">
          <span>{{scope.row.mate_id}}</span>
        </template>
      </el-table-column>

      <el-table-column width="120" label="申请人">
        <template scope="scope">
          <span>{{scope.row.apply_user_name}}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="申请金额">
        <template scope="scope">
          <span>{{scope.row.amount}}</span>
        </template>
      </el-table-column>

      <el-table-column label="申请时间" width="180">
        <template scope="scope">
          <span>{{scope.row.gmt_created | parseTime}}</span>
        </template>
      </el-table-column>
      
      <el-table-column align="center" label="审核状态" width="120">
        <template scope="scope">
          <span>{{scope.row.status | checkWithdrawFilter}}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="后台审核时间">
        <template scope="scope">
          <span>{{scope.row.gmt_modified | parseTime}}</span>
        </template>
      </el-table-column>
      
      <el-table-column width="110px" align="center" label="银行流水">
        <template scope="scope">
          <span>{{scope.row.thirdparty_no}}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="操作" width="260">
        <template scope="scope">

          <el-button size="small" type="primary" @click="handleUpdate(scope.row)">查看</el-button>
          <template v-if="[0, 1, 2].indexOf(scope.row.status) >= 0">
            <el-button size="small" type="primary" @click="enable(scope.row, true)">审核通过</el-button>
            <el-button size="small" type="danger" @click="enable(scope.row, false)">审核驳回</el-button>
          </template>
          <template v-if="[3].indexOf(scope.row.status) >= 0">
            <el-button size="small" type="primary" @click="showStatement(scope.row)">编辑</el-button>
          </template>
        </template>
      </el-table-column>

    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog title="查看" :visible.sync="dialogFormVisible" size="large">
      <el-form class="small-space" :model="temp" label-position="left" label-width="120px" style='width: 80%; margin-left:50px;'>
        <el-form-item label="提现银行卡卡号">
          <span>{{temp.user_bank_card_d_t_o ? temp.user_bank_card_d_t_o.bank_card_no : ''}}</span>
        </el-form-item>

        <el-form-item label="预留手机号">
          <span>{{temp.user_bank_card_d_t_o ? temp.user_bank_card_d_t_o.bank_mobile : ''}}</span>
        </el-form-item>
        
        <el-form-item label="银行名称">
          <span>{{temp.user_bank_card_d_t_o ? temp.user_bank_card_d_t_o.bank_name : ''}}</span>
        </el-form-item>

        <el-form-item label="身份证号">
          <span>{{temp.user_bank_card_d_t_o ? temp.user_bank_card_d_t_o.identity_card : ''}}</span>
        </el-form-item>

        <el-form-item label="持卡人姓名">
          <span>{{temp.user_bank_card_d_t_o ? temp.user_bank_card_d_t_o.real_name : ''}}</span>
        </el-form-item>

        <el-form-item label="申请理由">
          <span>{{temp.apply_desc}}</span>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>

    </el-dialog>

    <el-dialog title="编辑" :visible.sync="dialogStatement" size="large">
      <el-form class="small-space" label-position="left" label-width="120px" style='width: 80%; margin-left:50px;'>
        <el-form-item label="银行流水">
          <el-input type="textarea" v-model="statement"></el-input>
        </el-form-item>
      </el-form> 

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogStatement = false">取 消</el-button>
        <el-button type="primary" @click="updateStatement">确 定</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
    import {list, update, audit, detail} from 'api/withdrawals';
    import { shelfStatusList, checkWithdrawStatusList, checkWithdrawFilter } from '@/filters';
    import { parseTime } from 'utils';
    import { Message } from 'element-ui';
    // import adminImage from 'components/Upload/adminImage';
    import adminImage from 'components/Upload/singleImage';

    export default {
      name: 'wish_banner',
      data() {
        return {
          statement: '',
          dialogStatement: false,
          dateSelect: [],
          shelfStatusList,
          checkWithdrawStatusList,
          list: null,
          total: null,
          listLoading: true,
          listQuery: {
            mate_id: null,
            status: null,
            begin_date: null,
            end_date: null,
            current_page: 1,
            page_size: 10
          },
          temp: {
            id: undefined,
            img_url: 'baidu.com'
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
        var now = Date.now(), lastWeek = now - 3600 * 1000 * 24 * 7;
        var s_time = parseTime(lastWeek), e_time = parseTime(now);
        this.dateSelect = [s_time, e_time];
        this.updateListQueryDate();
        this.getList();
      },
      filters: {
        parseTime,
        checkWithdrawFilter
      },
      methods: {
        updateListQueryDate(){
          var dateSelect = this.dateSelect;
          if(dateSelect.length == 2){
            this.listQuery.begin_date = parseTime(dateSelect[0]);
            this.listQuery.end_date = parseTime(dateSelect[1]);
          }
        },
        enable(row, isEnable){
          var status = isEnable ? 3 : 4, self = this;
          var reg = isEnable ? /\s*/ : /\S+/;
          var title = isEnable ? '审核通过' : '审核驳回';

          this.$prompt('请输入原因', title, {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              inputPattern: reg,
              inputErrorMessage: '原因不能为空'
            }).then(({ value }) => {

              audit({withdraw_id: row.id, status, audit_desc: value}).then(res => {
                if(res.data.success){
                  self.$message.success('操作成功')
                }else{
                  self.$message.error(res.data.msg)
                }
                self.getList();
              })

            }).catch((e) => {
              console.log(e)
              this.$message({
                type: 'info',
                message: '取消输入'
              });       
            });
          
        },
        getList() {
          this.listLoading = true;
          list(this.listQuery).then(res => {
            var d = res.data;
            if(d.data && d.data.page_mate_account_detail_d_t_o){
              this.list = d.data.page_mate_account_detail_d_t_o.withdrawal_d_t_o_s;
              this.total = d.data.page_mate_account_detail_d_t_o.count;
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
          this.listQuery.current_page = val;
          this.getList();
        },
        handleModifyStatus(row, status) {
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          row.status = status;
        },
        showStatement(row){
          var temp = this.temp, self= this;
          detail({withdraw_id: row.id}).then(res => {
            var d = res.data;
            if(d.data && d.data.withdraw){
              self.statement = d.data.withdraw.thirdparty_no;
              self.temp = d.data.withdraw;
              self.dialogStatement = true;
            }else{
              self.$message.error(d.msg || '操作失败')
            }
          })
        },
        updateStatement(){
          var self = this;
          update({withdraw_id: this.temp.id, thirdparty_no: this.statement}).then(res => {
            var d = res.data;
            console.log(d);
            self.$message.info(d.msg || '操作成功')
            self.dialogStatement = false;
            self.getList();
          })
        },
        handleUpdate(row) {
          var temp = this.temp, self= this;
          detail({withdraw_id: row.id}).then(res => {
            var d = res.data;
            console.log(d.data.withdraw)
            if(d.data && d.data.withdraw){
              self.temp = d.data.withdraw;
              self.temp.user_bank_card_d_t_o = self.temp.user_bank_card_d_t_o || {};
              this.dialogStatus = 'update';
              this.dialogFormVisible = true;
            }else{
              self.$message.error(d.msg || '操作失败')
            }
          })
        },
        update() {
          this.temp.timestamp = +this.temp.timestamp;
          for (const v of this.list) {
            if (v.id === this.temp.id) {
              const index = this.list.indexOf(v);
              this.list.splice(index, 1, this.temp);
              break;
            }
          }
          this.dialogFormVisible = false;
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          });
        }
      }
    }
</script>
