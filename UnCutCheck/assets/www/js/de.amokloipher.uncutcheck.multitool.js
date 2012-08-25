(function($) {

	// URL - Constants needed to build up Ajax requests 
	
	var ofdbSearchResults_url = 'http://www.ofdb.de/view.php?page=suchergebnis';
	var ofdbBaseUrl = "http://www.ofdb.de/";
	var ofdbEANAPIUrl = "http://ofdbgw.org/searchean/";
	var ofdbFassungAPIUrl = "http://ofdbgw.org/fassung/";
	var ofdbFassungPageUrl = "http://www.ofdb.de/view.php?page=fassung&fid={id1}&vid={id2}";
	var extractedDirectUrl;
	
	
	var methods = {
		init : function(options) {
			// init stuff
		},
		
		gatherMovieInfo : function(ean) {
			
			var jqxhr = $.ajax({
				url		:	ofdbEANAPIUrl+ean,
				success	:	function(data){
					getFassung($("fassungid", data).text());
				}
			});
			
		}
	};

	function getFassung(id){
		var jqxhr = $.ajax({
			url			: 	ofdbFassungAPIUrl+id,
			success		:	function(data){
				alert($("titel", data).text()); //TODO: Remove 
				inquireIsCut(id);
			}
		});
	}
	
	function inquireIsCut(id){
		var stringParts = id.split(";");
		var gotoUrl = ofdbFassungPageUrl.replace("{id1}", stringParts[0]);
		gotoUrl = gotoUrl.replace("{id2}", stringParts[1]);
		var jqxhr = $.ajax({
			url			: 	gotoUrl,
			success		:	function(data){
				
				// FINALLY something to work with...
				alert($("td font.Daten b:first", data).text());
				
			}
		});
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