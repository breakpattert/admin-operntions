<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select clearable style="width: 130px" class="filter-item" v-model="listQuery.category" placeholder="愿望类型">
        <el-option v-for="item in wishList" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>

      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.status" placeholder="上下架状态">
        <el-option v-for="item in  shelfStatusList" :key="item.status" :label="item.name" :value="item.status">
        </el-option>
      </el-select>
      
      <el-date-picker
          class="filter-item"
          v-model="dateSelect"
          type="daterange"
          align="right"
          placeholder="选择日期范围"
          format="yyyy-MM-dd"
          @change="updateListQueryDate"
          :default-value="dateSelect"
          :editable="false"
          :clearable="false"
          >
      </el-date-picker>

      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">新增</el-button>
    </div>

    <el-table  :key='tableKey' index="index" :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号" width="65" type="index">
      </el-table-column>

      <el-table-column width="80px" align="center" label="愿望id">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="180px" label="愿望名称">
        <template scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.wish_name}}</span>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" label="愿望类型">
        <template scope="scope">
          <span>{{scope.row.category | wishListFilter}}</span>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" label="所需金额">
        <template scope="scope">
          <span>{{scope.row.amount}}</span>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" label="愿望顺序">
        <template scope="scope">
          <span>{{scope.row.sort}}</span>
        </template>
      </el-table-column>


      <el-table-column  label="创建时间">
        <template scope="scope">
          <span>{{scope.row.gmt_created | parseTime}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态" width="95">
        <template scope="scope">
          <span>{{ scope.row.status | shelfStatusFilter('name')}}</span>
        </template>
      </el-table-column>

       <el-table-column class-name="status-col" label="操作时间">
        <template scope="scope">
          <span>{{scope.row.gmt_modified | parseTime}}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="操作">
        <template scope="scope">
          <el-button size="small" @click="changeShelfStatus(scope.row)" type="primary">{{scope.row.status | shelfStatusFilter('operationName')}}</el-button>
          <el-button size="small" type="primary" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"  :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="large">
    <!-- <el-dialog :title="textMap[dialogStatus]" v-if="dialogFormVisible" size="large"> -->
      <el-form class="small-space" :model="temp" label-position="left" label-width="70px" style='width: 80%; margin-left:50px;'>
        <el-form-item label="愿望名称">
          <el-input v-model="temp.wish_name" placeholder="请输入内容"></el-input>
        </el-form-item>

        <el-form-item label="愿望标签">
          <template>
            <el-radio class="radio" v-model="temp.category" v-for="wish in wishList" :label="wish.id" :key="wish.id">{{wish.name}}</el-radio>
          </template>
        </el-form-item>

        <el-form-item label="愿望图片">
          <adminImage v-model="temp.img_url"></adminImage>
        </el-form-item>

        <el-form-item label="愿望详情">
          <Tinymce :height=200 
                :customButton="['editorImage']" 
                v-model="temp.wish_content"
                ></Tinymce>
        </el-form-item>

        <el-form-item label="愿望金额">
          <el-input-number v-model="temp.amount" :min="0"></el-input-number>
        </el-form-item>

        <el-form-item label="愿望顺序">
          <el-input-number v-model="temp.sort" :min="0"></el-input-number>
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
    import { fetchWishList, createWish, changeShelfStatus, fetchWishById, updateWish, remove } from 'api/wish';
    import { Message } from 'element-ui';
    import { parseTime} from 'utils';
    import { shelfStatus, wishList, shelfStatusList, wishListFilter, checkWithdrawFilter } from '@/filters';
    import Tinymce from 'components/Tinymce';
    import adminImage from 'components/Upload/adminImage';


    export default {
      name: 'table_demo',
      data() {
        return {
          content: '',
          // 愿望类型
          wishList,
          shelfStatusList,
          content: '',

          dateSelect: [],
          list: null,
          total: null,
          listLoading: true,
          listQuery: {
            category: null,
            current_page: 1,
            page_size: 10,
            status: null,
            begin_date: '2017-09-17 00:00:00',
            end_date: '2017-09-26 00:00:00'
          },
          temp: {
            id: undefined,
            category: 0,
            wish_name: '',
            wish_content: '',
            wish_sort: '',
            amount: 0,
            sort: 1,
            img_url: []
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
        Tinymce,
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
        shelfStatus,
        wishListFilter,
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
        getList() {
          this.listLoading = true;
          fetchWishList(this.listQuery).then(res => {
            var d = res.data;
            if(d.data && d.data.page_wish_market_d_t_o){
              this.list = d.data.page_wish_market_d_t_o.market_d_t_o_s;
              this.total = d.data.page_wish_market_d_t_o.count;
            }else{
              this.list = [];
              this.total = 0;
            }
            this.listLoading = false;
          })
        },
        changeShelfStatus(row){
          var status = row.status == 0 ? 1 : 0, self = this;
          var params = {
            wish_id: row.id,
            status: status
          }
          changeShelfStatus(params).then(res => {
            var d = res.data;
            Message({
              message: d.msg,
              type: 'success',
              duration: 3000
            })
            self.getList();
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
        handleCreate() {
          this.resetTemp();
          this.dialogStatus = 'create';
          this.$nextTick(() => {
            this.dialogFormVisible = true;
          })
        },
        handleUpdate(row) {
          const self = this;
          fetchWishById({wish_id: row.id}).then(res => {
            var wish = res.data.data.wish;
            try{
              var imgUrls = JSON.parse(wish.img_url);
              wish.img_url = imgUrls.map(item => {
                return {url: item}
              })
            }catch(e){
              wish.img_url = [];
            }
            // console.log('wish.img_url', wish.img_url);

            self.temp = Object.assign({}, wish)

            this.dialogStatus = 'update';
            this.dialogFormVisible = true;
          })
        },
        checkTemp(){
          var temp = this.temp;
          if(!temp.name || temp.name == ""){
            Message({message: "请输入愿望名称", type: 'error', duration: 3 * 1000})
          }

        },
        create() {
          var self = this, temp = this.temp;
          var imgs = JSON.stringify(temp.img_url.map(item => item.url));

          var params = {
            wish_name: temp.wish_name,
            category: temp.category,
            img_urls: imgs,
            amount: temp.amount,
            sort: temp.sort,
            wish_content: temp.wish_content
          }
          createWish(params).then(res => {
            self.dialogFormVisible = false;
            self.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            });
            self.getList();
          })
        },
        update() {
          var temp = this.temp, self = this;
          var imgs = JSON.stringify(temp.img_url.map(item => item.url));
          var params = {
            wish_id: temp.id,
            wish_name: temp.wish_name,
            category: temp.category,
            img_urls: imgs,
            amount: temp.amount,
            sort: temp.sort,
            wish_content: temp.wish_content
          }
          updateWish(params).then(res => {
            self.dialogFormVisible = false;

            self.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            });

            self.getList();
          })
        },
        remove(row){
          const params = {
            wish_id: row.id,
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
            category: 4,
            wish_name: '',
            wish_content: '',
            amount: 0,
            sort: 1,
            img_url: []
          };
        }
      }
    }
</script>
