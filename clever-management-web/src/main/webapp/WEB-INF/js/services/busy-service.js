angular.module('clever.management.services.busy', []).service('busyService', function() {
	var threads = [];
	var isBusy = false;
	this.getBusy = function(){
		return isBusy;
	};
	this.pushBusy = function(){
		var randomId = random();
		while(threads.indexOf(randomId)>0){
			ranmowId = random();
		}
		threads.push(randomId);
		isBusy = true;
		return randomId;
	};
	this.popBusy = function(id){
		var index = threads.indexOf(id);
		threads.splice(index,1);
		if(threads.length==0){
			isBusy = false;
		}
	};
	function random(){
		return 1;
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