(function($) {

	// URL - Constants needed to build up Ajax requests 
	
	var ofdbSearchResults_url = 'http://www.ofdb.de/view.php?page=suchergebnis';
	var ofdbBaseUrl = "http://www.ofdb.de/";
	
//	var ofdbEANAPIUrl = "http://ofdbgw.scheeper.de/searchean/";
	var ofdbEANAPIUrl = "http://ofdbgw.home-of-root.de/searchean/";
	
//	var ofdbFassungAPIUrl = "http://ofdbgw.scheeper.de/fassung/";
	var ofdbFassungAPIUrl = "http://ofdbgw.home-of-root.de/fassung/";
	
	var ofdbFassungPageUrl = "http://www.ofdb.de/view.php?page=fassung&fid={id1}&vid={id2}";
	var extractedDirectUrl;
	var eanMember;
	var MovieInfo = new Object();
	var fassungRetries = 0;
	var firstRetries = 0;
	
	
	var methods = {
		init : function(options) {
			// init stuff
		},
		
		gatherMovieInfo : function(ean) {
			fassungRetries = 10;
			firstRetries = 10;
			var success = false;
			success = checkOFDB(ean);
			return success;
		},
		
		getMovieInfo : function(){
			return MovieInfo;
		}
	};
	
	function checkOFDB(ean){
		firstRetries--;
		eanMember = ean;
		console.log("|||"+ean+"|||");
		var jqxhr = $.ajax({
			url		:	ofdbEANAPIUrl+ean,
			cache		: false,
			success	:	function(data){
				if($("rcode", data).text()!='0'){
					console.error("Fehler beim Finden der Fassung! rc:"+$("rcode", data).text());
					if(firstRetries>0){
						setTimeout(checkOFDB(ean), 2000);
						return null;
					}else{
						hideModal();
					}
				}
				return getFassung($("fassungid:first", data).text());
			}
		});
	}

	function getFassung(id){
		fassungRetries--;
		var jqxhr = $.ajax({
			url			: 	ofdbFassungAPIUrl+id,
			cache		: false,
			success		:	function(data){
				if($("rcode", data).text()!='0' || $("titel", data).text().length==0){
					console.error("Fehler beim Aufruf der Fassung! rc:"+$("rcode", data).text());
					if(fassungRetries>0){
						setTimeout(getFassung(id), 2000);
						return null;
					}else{
						hideModal();
					}
				}else{
//					alert($("titel", data).text()+" - EAN: "+eanMember); //TODO: Remove 
					// Fill relevant information into return object
					MovieInfo.title = $("titel", data).text();
					MovieInfo.label = $("label", data).text();
					MovieInfo.freigabe = $("freigabe", data).text();
					MovieInfo.indiziert = $("indiziert", data).text();
					MovieInfo.laufzeit = $("laufzeit", data).text();
					
					inquireIsCut(id);
					return true;
				}
			}
		});
	}
	
	function inquireIsCut(id){
		var stringParts = id.split(";");
		var gotoUrl = ofdbFassungPageUrl.replace("{id1}", stringParts[0]);
		gotoUrl = gotoUrl.replace("{id2}", stringParts[1]);
		var jqxhr = $.ajax({
			url			: 	gotoUrl,
			cache		: false,
			success		:	function(data){
				
				// FINALLY something to work with...
//				console.debug($("td font.Daten b:first", data).text());
				MovieInfo.isCut = ($("td font.Daten b:first", data).text()).substr(0, $("td font.Daten b:first", data).text().length-1); //TODO: Remove Colon
				$(document).trigger('infogathered');
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