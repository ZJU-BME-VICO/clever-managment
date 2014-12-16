angular.module('clever.management.services.busy', []).service('busyService', function() {

	var threads = [];
	var isBusy = false;
	this.getBusy = function(){
		return isBusy;
	};
	this.pushBusy = function(){
		var randomId = this.random();
		while(threads.indexOf(""+randomId)>=0){   //indexof某字符串在一串字符中第一次出现的位置
			ranmowId = this.random();
		}
		threads.push(""+randomId);
		isBusy = true;
		return randomId;
	};
	this.popBusy = function(id){
		var index = threads.indexOf(""+id);
		threads.splice(index,1);
		if(threads.length==0){
			isBusy = false;
			while(threads.length!=0){
				threads.pop();
			}
		}
	};
	this.random=function(){
		return Math.ceil(Math.random()*100);
	}
//	var s={
//
//		isBusy:false,
//
//		pushBusy:function(count){
//			Busy.push({busy:count});
//			this.isBusy=true;
//		},
//
//		popBusy:function(count){
//
//			/*由于splice这个释放，会减一个数组长度*/
//			var i=0;
//			if(before!=0){
//				i=_.filter(arrays,function(array){
//					return array.num<count;
//				}).length;
//			}
//			before++;
//
//			arrays.push({num:count});
//
//			Busy.splice(count-i,1);
//
//			if(Busy.length==0){
//				this.isBusy=false;
//				before=0;
//				while(arrays.length!=0)         
//					arrays.pop();
//			}
//		}
//	}
});