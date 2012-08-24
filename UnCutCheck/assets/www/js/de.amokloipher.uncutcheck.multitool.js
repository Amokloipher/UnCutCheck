(function($) {

	// URL - Constants needed to build up Ajax requests 
	
	var ofdbSearchResults_url = 'http://www.ofdb.de/view.php?page=suchergebnis';
	var ofdbBaseUrl = "http://www.ofdb.de/";
	var extractedDirectUrl;
	var MovieInformation;
	
	
	var methods = {
		init : function(options) {
			// init stuff
		},
		
		gatherMovieInfo : function(ean) {
//			alert(ofdbSearchResults_url +' '+ean);
			
			var jqxhr = $.ajax({
				type	:	'POST',
				url		:	ofdbSearchResults_url,
				data	:	{
					'Kat'	:	'EAN',
					'SText'	:	ean
				},
				success	:	function(data){
					followUpUrlAjax($("td .Normal a:last",data).attr('href'));
				}
			});
			
		},
		
		getMovieInformation	:	function(){
			return MovieInformation;
		}
	};

	
	function followUpUrlAjax(followUpUrl){
		var jqxhr = $.ajax({
			url		:	ofdbBaseUrl+followUpUrl,
			success	:	function(data){
				MovieInformation.title = $("#IMBar + table table tr[valign] font b").text();
				
			}
		});
		
		alert(ofdbBaseUrl+followUpUrl);
	}
	
	$.fn.uncut = function(method) {

		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.tooltip');
		}

	};
})(jQuery);