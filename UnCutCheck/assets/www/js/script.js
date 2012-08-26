$(document).on('infogathered', function(){
	var MovieInfo = $(document).uncut("getMovieInfo");
	$("#title-cell").html(MovieInfo.title);
	$("#label-cell").html(MovieInfo.label);
	$("#cut-cell").html(MovieInfo.isCut);
	$("#freigabe-cell").html(MovieInfo.freigabe);
	$("#index-cell").html(MovieInfo.indiziert);
	$("#laufzeit-cell").html(MovieInfo.laufzeit);
	
	$.mobile.changePage("#scan-result");
	hideModal();
});

$(document).on('ready', function(){
	$(".apage").each(function(index, element) {
//		console.debug($(element).attr("id"));
		$(element).live('pageshow', function(event){
			var windowheight = parseInt($(window).height());
			var headerHeight = parseInt($('#'+$(element).attr('id')+' .my-header').height());
			var footerHeight = parseInt($('#'+$(element).attr('id')+' .my-footer').height());
			
//			console.debug('window: '+ windowheight);
//			console.debug('header: '+ headerHeight);
//			console.debug('footer: '+ footerHeight);
//			
//			console.debug($(element).attr('id')+' content:'+ parseInt(windowheight-headerHeight-footerHeight));
			
			$('#'+$(element).attr('id') + ' .content').height(parseInt(windowheight - headerHeight - footerHeight)+"px");
		});
	});
});

function showModal(){
	  $("body").append('<div class="modalWindow"/>');
	  $.mobile.showPageLoadingMsg();
}
function hideModal(){
	 $(".modalWindow").remove();
	  $.mobile.hidePageLoadingMsg();

	}

