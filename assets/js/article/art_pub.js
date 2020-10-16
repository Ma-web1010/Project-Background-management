$(function () {

  var layer = layui.layer;
  var form = layui.form;

  // 1. 定义加载文章分类的方法
  function initCate() {
    // 1.1 向服务器请求数据
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('初始化文章分类失败!');
        }
        layer.msg('初始化文章分类成功!');
        // 1.2 调用模板引擎渲染分类的下拉菜单
        var htmlStr = template('tpl-cate', res);
        $('[name=cate_id]').html(htmlStr);
        // 一定要记得调用 form.render 方法
        form.render();
      }
    })
  };
  initCate();
  // 调用富文本编辑器
  initEditor();


  // 2.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
  // 2.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }
  // 2.3 创建裁剪区域
  $image.cropper(options)

  
  // 3. 为选选择封面的按钮绑定点击事件处理函数
  $('#btnChooseImage').on('click', function () {
    $('#coverFile').click();
  });
  

  // 4. 监听 隐藏文件框的 change 事件，获取用户选择的文件列表
  $('#coverFile').on('click', function (e) {
    // 4.1 获取到文件的列表按钮
    var files = e.target.files;
    // 4.2 判断用户是否选择了文件
    if (files.length == 0) {
      return
    }
    // 4.3 根据文件 创建对应的 url地址
    var newImgURL = URL.createObjectURL(files[0]);

    // 4.4 为裁剪区域重新设置图片
    $image
      .cropper('destroy')      // 销毁旧的裁剪区域
      .attr('src', newImgURL)  // 重新设置图片路径
      .cropper(options)        // 重新初始化裁剪区域
  });

  // 定义文章的发布状态
  var art_state = '已发布';

  // 5. 为存为草稿按钮，绑定点击事件处理函数
  $('#btnSave2').on('click', function () {
    art_state = '草稿';
  });


  // 6. 为表单绑定 submit 提交事件
  $('#form-pub').on('submit', function (e) {
    // 6.1 阻止表单的默认提交事件
    e.preventDefault();

    // 6.2 基于 form 表单，快速创建一个 FormData数据对象
    var fd = new FormData($(this)[0]);

    // 6.3 将文章的发布状态存到 fd 中
    fd.append('state', art_state);
    // 将封面裁剪过后的图片输出为一个文件对象
    $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // 6.4 将文件对象，存储到 fd 中
        fd.append('cover_img', blob)
        // 6.5 发起 ajax 数据请求
        publishArticle(fd);
      });
  });

  // 定义一个发布文章的方法
  function publishArticle(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: fd,
      // 注意 ： 如果向服务器提交的是 formdate 的数据，必须添加以下两个配置项
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('发布文章失败!');
        }
        layer.msg('发布文章成功!');
        // 发布文章成功后，跳转到文章列表页面
        location.href = '../../../article/art_list.html';
      }
    });
  };


  // 入口函数结尾
});
