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
		$(element).live('pageshow', function(event){
			var windowheight = parseInt($(window).height());
			var headerHeight = parseInt($('#'+$(element).attr('id')+' .my-header').height());
			var footerHeight = parseInt($('#'+$(element).attr('id')+' .my-footer').height());
			
			$('#'+$(element).attr('id') + ' .content').height(parseInt(windowheight - headerHeight - footerHeight)+"px");
		});
	});
	
	$('#movie-list').live('pageshow', function(){
		UncutCheckR.gui.renderShelf($('#movie-list .list-container'));
	});
	
	$('.shelf-link').bind('tap', function(){
		config.database.modes.current = config.database.modes.shelf;
		$.mobile.changePage("#movie-list");
	});
	$('.wishlist-link').bind('tap', function(){
		config.database.modes.current = config.database.modes.wishlist;
		$.mobile.changePage("#movie-list");
	});
	
	$('#scan-result .shelf').bind('tap', function(){
		var movieInfo = $(document).uncut('getMovieInfo');
		UncutCheckR.database.addMovie(new Movie(
								movieInfo.ean,
								movieInfo.title,
								movieInfo.freigabe,
								movieInfo.isCut,
								movieInfo.indiziert,
								movieInfo.laufzeit,
								config.database.modes.shelf
							), function(tx, rs){
								alert(movieInfo.title + " added to shelf.");
							}, function(tx, error){
								alert("Error adding to shelf: "+error);
							});
	});
	
	$('#scan-result .wishlist').bind('tap', function(){
		var movieInfo = $(document).uncut('getMovieInfo');
		UncutCheckR.database.addMovie(new Movie(
								movieInfo.ean,
								movieInfo.title,
								movieInfo.freigabe,
								movieInfo.isCut,
								movieInfo.indiziert,
								movieInfo.laufzeit,
								config.database.modes.wishlist
							), function(tx, rs){
								alert(movieInfo.title + " added to Wishlist.");
							}, function(tx, error){
								alert("Error adding to Wishlist: "+error);
							});
	});

});

$("div[data-role=page]").live('pageshow', function(){
	$(".main-content", this).css("min-height", $(window).height()-$("div[data-role=header]", this).height()+"px");
})

$(document).bind('deviceready', function(){
	UncutCheckR.database.initializeDatabase();
	
	$(".movie .title").live('tap', function(){
		$(".details", $(this).parent()).slideToggle();
	})
});

function showModal(){
	  $("body").append('<div class="modalWindow"/>');
	  $.mobile.showPageLoadingMsg();
}
function hideModal(){
	 $(".modalWindow").remove();
	  $.mobile.hidePageLoadingMsg();

	}

