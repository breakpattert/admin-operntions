# 编译前端项目
npm run build:prod
# 拷贝编译好的 静态资源到  服务器的 指定目录
scp -r dist/* root@118.31.238.133:/deploy/tmp/admin
# 执行服务器上的脚本
ssh root@118.31.238.133 'sh /deploy/ssh/cp_admin_manager_web_html.sh'
