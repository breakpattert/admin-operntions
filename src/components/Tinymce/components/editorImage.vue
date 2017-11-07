<template>
    <div class="upload-container">
        <el-button icon='upload' :style="{background:color,borderColor:color}" @click=" dialogVisible=true" type="primary">上传图片
        </el-button>
        <el-dialog v-model="dialogVisible" :modal="false">
            <el-upload
                    class="editor-slide-upload"
                    :action="action"
                    :data="dataObj"
                    :multiple="false"
                    :file-list="fileList"
                    :show-file-list="true"
                    list-type="picture-card"
                    :before-upload="beforeUpload"

                    :on-remove="handleRemove"
                    :on-success="handleImageScucess">
                <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </el-dialog>
    </div>
</template>
<script>
    import { getToken } from 'api/qiniu';
    import getOssObj from '@/utils/oss';
    import {get_random_filename} from '@/utils/oss';


    export default {
      name: 'editorSlideUpload',
      props: {
        color: {
          type: String,
          default: '#20a0ff'
        }
      },
      data() {
        return {
          action: '',
          dialogVisible: false,
          dataObj: {},
          list: [],
          fileList: [],
          filename: ''
        };
      },
      created() {
        var ossObj = getOssObj();
        this.action = ossObj.host;
        this.dataObj = ossObj;
      },
      methods: {
        handleSubmit() {
          const arr = this.list.map(v => v.url);
          this.$emit('successCBK', arr);
          this.list = [];
          this.fileList = [];
          this.dialogVisible = false;
        },
        handleRemove(file) {
          const key = file.response.key;
          for (let i = 0, len = this.list.length; i < len; i++) {
            if (this.list[i].key === key) {
              this.list.splice(i, 1);
              return
            }
          }
        },
        handleImageScucess(res, file) {
          var dataObj = this.dataObj;
          // var url = dataObj.host + '/' + dataObj.dir + file.name;
          var url = dataObj.host + '/' + dataObj.dir + this.filename;
          this.list.push({ url });
        },
        beforeUpload(file){
          this.filename = get_random_filename(file.name);
          this.dataObj.key = this.dataObj.dir + this.filename;
          console.log(this.filename);
        }
      }
    };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .upload-container {
        .editor-slide-upload {
            margin-bottom: 20px;
        }
    }
</style>
