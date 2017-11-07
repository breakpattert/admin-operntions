<template>
    <div>
        <el-upload
                :data="dataObj"
                :multiple="false"
                list-type="picture-card"
                :action="action"
                :file-list="fileList"
                :on-success="handleImageScucess"
                :on-error="handleImageError"
                :on-preview="handlePictureCardPreview"
                :before-upload="beforeUpload"
                :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog v-model="dialogVisible" size="large" :modal="false">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>
<script>
    import { getOssSingature } from 'api/login';
    import getOssObj from '@/utils/oss';
    import {get_random_filename} from '@/utils/oss';

    export default {
      name: 'singleImageUpload',
      props: {
        value: Array
      },
      computed: {
        imageUrl() {
          return this.value
        }
      },
      data() {
        return {
          dialogVisible: false,
          dialogImageUrl: '',
          fileList: [],
          action: '',
          dataObj: { },
          isChange: false,
          filename: ''
        };
      },
      watch: {
      	value: function(val, oldVal){
      		if(!this.isChange){
	      		this.fileList = val;
	      		this.isChange = false;
      		}
      		// console.log(val, oldVal);
      	}
      },
      created() {
      	this.fileList = this.value;
      	this.init();
      },
      methods: {
      	init(){
      		this.getSignature();

      	},
      	getSignature(){
      		var ossObj = getOssObj();
      		this.action = ossObj.host;
      		this.dataObj = ossObj;
      	},
        beforeUpload(file){
          this.filename = get_random_filename(file.name);
          this.dataObj.key = this.dataObj.dir + this.filename;
          console.log(this.filename);
        },
      	handleRemove(file, fileList) {
    			var url = file.url;
    			var index = this.value.findIndex((item) => {
    				return item.url == url;
    			})
    			this.value.splice(index, 1);
  	    },
  	    handlePictureCardPreview(file) {
  	       this.dialogImageUrl = file.url;
  	       this.dialogVisible = true;
  	    },
        handleImageScucess(res, file){
        	var dataObj = this.dataObj;
          // var url = dataObj.host + '/' + dataObj.dir + file.name;
    			var url = dataObj.host + '/' + dataObj.dir + this.filename;
    			// console.log('success url', url);
    			this.isChange = true;
    			this.value.push({url});
        },
        handleImageError(e){
    			console.log('handleImageError')
    			console.log(arguments)
        }
      }
    };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/mixin.scss";
    .upload-container {
        width: 100%;
        position: relative;
        @include clearfix;
        .image-uploader {
            width: 60%;
            float: left;
        }
        .image-preview {
            width: 200px;
            height: 200px;
            position: relative;
            border: 1px dashed #d9d9d9;
            float: left;
            margin-left: 50px;
            .image-preview-wrapper {
                position: relative;
                width: 100%;
                height: 100%;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .image-preview-action {
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                cursor: default;
                text-align: center;
                color: #fff;
                opacity: 0;
                font-size: 20px;
                background-color: rgba(0, 0, 0, .5);
                transition: opacity .3s;
                cursor: pointer;
                text-align: center;
                line-height: 200px;
                .el-icon-delete {
                    font-size: 36px;
                }
            }
            &:hover {
                .image-preview-action {
                    opacity: 1;
                }
            }
        }
    }
	.el-upload-list--picture-card .el-upload-list__item {
		width: 300px;
		height: 200px;
	}
</style>
