/*!
 * ======================================================
 * FeedBack Template For MUI (http://dev.dcloud.net.cn/mui)
 * =======================================================
 * @version:1.0.0
 * @author:cuihongbao@dcloud.io
 */

var imgUrl = "";
(function() {
	var index = 1;
	var size = null;
	var imageIndexIdNum = 0;
	var starIndex = 0;
	//	var imgUrl = "";
	var feedback = {
		imageList: document.getElementById('image-list')
	};
	feedback.files = [];
	feedback.uploader = null;
	feedback.deviceInfo = null;
	mui.plusReady(function() {
		//设备信息，无需修改
		feedback.deviceInfo = {
			appid: plus.runtime.appid,
			imei: plus.device.imei, //设备标识
			images: feedback.files, //图片文件
			p: mui.os.android ? 'a' : 'i', //平台类型，i表示iOS平台，a表示Android平台。
			md: plus.device.model, //设备型号
			app_version: plus.runtime.version,
			plus_version: plus.runtime.innerVersion, //基座版本号
			os: mui.os.version,
			net: '' + plus.networkinfo.getCurrentType()
		}
	});
	/**
	 *提交成功之后，恢复表单项 
	 */
	//	feedback.clearForm = function() {
	//		feedback.question.value = '';
	//		feedback.contact.value = '';
	//		feedback.imageList.innerHTML = '';
	//		feedback.newPlaceholder();
	//		feedback.files = [];
	//		index = 0;
	//		size = 0;
	//		imageIndexIdNum = 0;
	//		starIndex = 0;
	//		//清除所有星标
	//		mui('.icons i').each(function (index,element) {
	//			if (element.classList.contains('mui-icon-star-filled')) {
	//				element.classList.add('mui-icon-star')
	//	  			element.classList.remove('mui-icon-star-filled')
	//			}
	//		})
	//	};
	feedback.getFileInputArray = function() {
		return [].slice.call(feedback.imageList.querySelectorAll('.file'));
	};
	feedback.addFile = function(path) {
		var headimg1 = new Image();
		headimg1.src = path;

		var timer = setInterval(function() {
			if(headimg1.complete) {
				var url = "http://172.27.35.1:8080/api/getPicture";
				fetchimages.getImagesForFeedback(headimg1, function(imgstream) {
					mui.ajax(url, {
						data: {
							img: imgstream
						},
						async: false,
						dataType: 'jsonp', //服务器返回json格式数据
						type: 'post', //HTTP请求类型
						timeout: 10000, //超时时间设置为10秒；
						success: function(result) {
							alert(11111111);
							if(res.code == 1) {
								// imgUrl = imgUrl + sysconfig.systempath + res.data + ",";
								imgUrl = imgUrl + res.data + ",";
							}
						},
						error: function(xhr, type, errorThrown) {
							alert(22222);
							plus.nativeUI.toast(xhr+"-=-="+type+"-=-="+errorThrown);
						}
					});


					/*$.ajax({
						type: "post",
						async: false,
						data: {
							img: imgstream
						},
						url: url,
						dataType: "jsonp",
						contentType: "application/json",
						jsonp: "callbackparam",
						success: function(result) {
							alert(1);
						},
						error: function() {
							alert(2);
						}
					});*/
				});
				clearInterval(timer);
			}
		}, 100);

		//		feedback.files.push({name:"images"+index,path:path});
		//		index++;
	};
	/**
	 * 初始化图片域占位
	 */
	feedback.newPlaceholder = function() {
		var fileInputArray = feedback.getFileInputArray();
		if(fileInputArray &&
			fileInputArray.length > 0 &&
			fileInputArray[fileInputArray.length - 1].parentNode.classList.contains('space')) {
			return;
		};
		imageIndexIdNum++;
		var placeholder = document.createElement('div');
		placeholder.setAttribute('class', 'image-item space');
		//删除图片
		var closeButton = document.createElement('div');
		closeButton.setAttribute('class', 'image-close');
		closeButton.innerHTML = '<strong>X</strong>';
		//小X的点击事件
		closeButton.addEventListener('tap', function(event) {
			setTimeout(function() {
				feedback.imageList.removeChild(placeholder);
			}, 0);
			return false;
		}, false);
		//
		var fileInput = document.createElement('div');
		fileInput.setAttribute('class', 'file');
		fileInput.setAttribute('id', 'image-' + imageIndexIdNum);
		fileInput.addEventListener('tap', function(event) {
			var self = this;
			var index = (this.id).substr(-1);

			plus.camera.getCamera().captureImage(function(e) {
				//				console.log("event:"+e);
				//				var name = "";
				//				plus.io.resolveLocalFileSystemURL(e, function(entry) {
				//					name = entry.toLocalURL() + "?version=" + new Date().getTime();
				//					name=entry.toLocalURL();
				//				});
				var name = e.substr(e.lastIndexOf('/') + 1);
				plus.zip.compressImage({
					src: e,
					dst: '_doc/' + name,
					overwrite: true,
					quality: 50
				}, function(zip) {
					feedback.addFile(zip.target);
					size += zip.size
					if(size > (10 * 1024 * 1024)) {
						return mui.toast('文件超大,请重新选择~');
					}
					if(!self.parentNode.classList.contains('space')) { //已有图片
						feedback.files.splice(index - 1, 1, {
							name: "images" + index,
							path: e
						});
					} else { //加号
						placeholder.classList.remove('space');
						feedback.newPlaceholder();
					}
					placeholder.style.backgroundImage = 'url(' + zip.target + ')';
				}, function(zipe) {
					mui.toast('压缩失败！');
				});
			}, function(e) {
				mui.toast(e.message);
			}, {});
		}, false);
		placeholder.appendChild(closeButton);
		placeholder.appendChild(fileInput);
		feedback.imageList.appendChild(placeholder);
	};
	feedback.newPlaceholder();
	//	feedback.submitBtn.addEventListener('tap', function(event) {
	//		//判断网络连接
	//		if(plus.networkinfo.getCurrentType()==plus.networkinfo.CONNECTION_NONE){
	//			return mui.toast("连接网络失败，请稍后再试");
	//		}
	//		feedback_send.send({
	//			phone_send: feedback.contact.value,
	//			questcontent: feedback.question.value,
	//			images_send: imgUrl
	//		}, function(msg) {
	//			plus.nativeUI.closeWaiting();
	//			//mui.toast('感谢您的建议~');
	//			mui.toast(msg);
	//			feedback.clearForm();
	//			mui.back();
	//		});
	//	}, false)
	//	feedback.send = function(content) {
	//		var content =content.questcontent||'';
	//			var phone =  content.phone||'' ;
	//			var pic='';
	//			var url=sysconfig.systempath+"feedback.ashx";	
	//			//var url="http://192.168.1.104/ynhealth/feedback.ashx";		
	//			mui.ajax(url, {
	//								data: {
	//								
	//								content:content,
	//								phone: phone,
	//								pic:pic
	//								},
	//								dataType: 'html', //服务器返回json格式数据
	//								type: 'get', //HTTP请求类型
	//								timeout: 10000, //超时时间设置为10秒；
	//								success: function(data) {
	//								var result=JSON.parse(data||'{}');
	//								var msg='感谢您的建议';
	//								if(result.Code==0)
	//									msg=result.msg;
	//								error: function(xhr, type, errorThrown) {
	//																
	//								}
	//						});		
	//		
	////		//添加上传数据
	////		mui.each(content, function(index, element) {
	////			if (index !== 'images') {
	//////				console.log("addData:"+index+","+element);
	////				feedback.uploader.addData(index, element)
	////			} 
	////		});
	////		//添加上传文件
	////		mui.each(feedback.files, function(index, element) {
	////			var f = feedback.files[index];
	////			feedback.uploader.addFile(f.path, {
	////				key: f.name
	////			});
	////		});
	//};
})();