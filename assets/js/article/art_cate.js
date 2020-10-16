$(function () {

  var layer = layui.layer;
  var form = layui.form;

  // 1. 获取文章分类的列表
  function initArtCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        console.log(res);
        var htmlStr = template('tpl-table', res);
        $('tbody').html(htmlStr);
      }
    });
    // 函数结尾
  };
  initArtCateList();


  // 2. 为添加类别按钮绑定点击事件
  var indexAdd = null;
  $('#btnAddCate').on('click', function () {
    indexAdd = layer.open({
      // type 和 area 设置都在文档里面,area指定宽和高，type指定什么类型
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dialog-add').html()
    });     
      
  });


  // 3. 通过代理的方式为 form-add 绑定submit事件
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault();
    // console.log('ok');
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('新增分类失败!');
        }
        initArtCateList();
        layer.msg('新增分类成功!');
        // 根据索引关闭对应的弹出层
        layer.close(indexAdd);
      }


    });
  });


  // 4. 通过代理的形式，为 btn-edit 编辑按钮绑定点击事件
  var indexEdit = null;
  $('tbody').on('click', '.btn-edit', function () {
    // console.log('ok');
    // 4.1 弹出一个修改文章分类信息的层 用一个变量接收,就是索引
    indexEdit = layer.open({
      // type 和 area 设置都在文档里面,area指定宽和高，type指定什么类型
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章分类',
      content: $('#dialog-edit').html()
    });     

    // 4.2 拿到编辑按钮-我们自定义的属性 
    var id = $(this).attr('data-id');
    // 4.3 发起请求，获取对应分类的数据
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function (res) {
        // 4.3 给指定的form表单填充数据
        form.val('form-edit', res.data);
      }
    });
  });

  // 5. 通过代理的形式，为修改了分类的表单绑定 submit 事件
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新分类数据失败!');
        }
        layer.msg('更新分类数据成功!');
        // 根据索引关闭弹出层
        layer.close(indexEdit);
        initArtCateList();
      }
    });
  });

  // 6. 通过代理的形式，为删除按钮绑定点击事件
  $('tbody').on('click', '.btn-delete', function () {
    // 6.1 获取到当前的按钮 id 值，通过获取自定义值 data-id来获取
    var id = $(this).attr('data-id');
    // 6.2 提示用户是否要删除
    layer.confirm('确认删除?', {icon: 3, title:'提示'},function(index){
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除分类失败!');
          }
          layer.msg('删除分类成功!');
          layer.close(index);
          // 刷新列表的数据
          initArtCateList();
        }
      });
    });       
  });


  // 入口函数结尾
});