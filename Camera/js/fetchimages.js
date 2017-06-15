(function($, owner) {
	owner.getImages = function(img, callback) {

		var imgrul = img.src || '';
		if(imgrul.indexOf("head.jpg?version=") < 1 && imgrul.indexOf("head1.jpg?version=") < 1 && imgrul.indexOf("head2.jpg?version=") < 1 && imgrul.indexOf("head3.jpg?version=") < 1) {
			return callback('');
		}
		var type = 1;
		if(imgrul.indexOf("?type=1") < 1) {
			type = 2;
		}
		//生成比例 
		var w = img.width,
			h = img.height,
			scale = w / h;
		//w = 480 || w; //480 你想压缩到多大
		//h = w / scale;
		//生成canvas
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		canvas.width = w;
		canvas.height = h;
		ctx.drawImage(img, 0, 0, w, h);
		var imgbase = canvas.toDataURL('image/jpeg', 1 || 1); //1z 表示图片质量，越低越模糊。
		imgbase = imgbase || '';
		if(imgbase)
			return callback(imgbase, type);
	}

	owner.getImagesForFeedback = function(img, callback) {

		var imgrul = img.src || '';
		//生成比例 
		var w = img.width,
			h = img.height,
			scale = w / h;
		w = 480 || w; //480 你想压缩到多大
		h = w / scale;
		//生成canvas
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		canvas.width = w;
		canvas.height = h;
		ctx.drawImage(img, 0, 0, w, h);
		var imgbase = canvas.toDataURL('image/jpeg', 1 || 1); //1z 表示图片质量，越低越模糊。
		imgbase = imgbase || '';
		//alert(imgbase);
		if(imgbase)
			return callback(imgbase);
	}

	owner.getImagestream = function(img, callback) {
		plus.io.resolveLocalFileSystemURL(img, function(entry) {
			var reader = null;
			entry.file(function(file) {
				reader = new plus.io.FileReader();
				reader.onloadend = function(e) {

					//alert(e.target.result);
					return callback(e.target.result);
				};
				reader.readAsDataURL(file);
			}, function(e) {
				//alert( e.message );
			});
		}, function(e) {
			//alert( "Resolve file URL failed: " + e.message );
		});
	}

}(mui, window.fetchimages = {}));