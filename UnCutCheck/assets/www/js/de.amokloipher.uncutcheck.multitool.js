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
		MovieInfo.ean = ean;
		var jqxhr = $.ajax({
			url			:	ofdbEANAPIUrl+ean,
			cache		:	false,
			contentType	:	"application/xml;charset=iso-8859-1",	
			success		:	function(data){
				if($("rcode", data).text()!='0'){
					if($("rcode", data).text() == '3'){
						alert("Invalid Barcode!");
						firstRetries= 0;
					}else if($("rcode", data).text() == '4'){
						alert("This Movie is not listed in ofdb");
						firstRetries= 0;
					}
					console.error("Fehler beim Finden der Fassung! rc:"+$("rcode", data).text());
					if(firstRetries>0){
						setTimeout(function(){checkOFDB(ean)}, 3000);
						return null;
					}else{
						alert("Movie not found in time. Please scan again.");
						hideModal();
					}
				}else{
					return getFassung($("fassungid:first", data).text());
				}
			}
		});
	}

	function getFassung(id){
		fassungRetries--;
		var jqxhr = $.ajax({
			url			: 	ofdbFassungAPIUrl+id,
			cache		: false,
			contentType	:	"application/xml;charset=iso-8859-1",
			success		:	function(data){
				if($("rcode", data).text()!='0' || $("titel", data).text().length==0){
					if($("rcode", data).text() == '3'){
						alert("Invalid Movie-Version-ID!");
						fassungRetries= 0;
					}else if($("rcode", data).text() == '4'){
						alert("This Version is not listed in ofdb!");
						fassungRetries= 0;
					}else{
					console.error("Fehler beim Aufruf der Fassung! rc:"+$("rcode", data).text());
						if(fassungRetries>0){
							setTimeout(function(){getFassung(id)}, 2000);
							return null;
						}else{
							alert("Movie not found in time. Please scan again.");
							hideModal();
						}
					}
				}else{
//					alert($("titel", data).text()+" - EAN: "+eanMember); //TODO: Remove 
					// Fill relevant information into return object
					MovieInfo.title = filterEncoding($("titel", data).text());
					MovieInfo.label = filterEncoding($("label", data).text());
					MovieInfo.freigabe = filterEncoding($("freigabe", data).text());
					MovieInfo.indiziert = filterEncoding($("indiziert", data).text());
					MovieInfo.laufzeit = filterEncoding($("laufzeit", data).text());
					
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
			cache		: 	false,
			contentType	:	"text/html;charset=utf-8",
			success		:	function(data){
				
				// FINALLY something to work with...
//				console.debug($("td font.Daten b:first", data).text());
				var cutString = ($("td font.Daten b:first", data).text()).substr(0, $("td font.Daten b:first", data).text().length-1); //TODO: Remove Colon
				
				MovieInfo.isCut = filterEncoding(cutString);
				$(document).trigger('infogathered');
			}
		});
	}

	function filterEncoding(encString){
//		var i;
//		for(i=0; i < encString.length; i++){
//			if(encString.charCodeAt(i) == 252){
//				encString = encString.replace(encString.charAt(i), "ue");
//			}else if(encString.charCodeAt(i) == 246){
//				encString = encString.replace(encString.charAt(i), "oe");
//			}else if(encString.charCodeAt(i) == 228){
//				encString = encString.replace(encString.charAt(i), "ae");
//			}else if(encString.charCodeAt(i) == 220){
//				encString = encString.replace(encString.charAt(i), "Ue");
//			}else if(encString.charCodeAt(i) == 214){
//				encString = encString.replace(encString.charAt(i), "Oe");
//			}else if(encString.charCodeAt(i) == 196){
//				encString = encString.replace(encString.charAt(i), "Ae");
//			}else if(encString.charCodeAt(i) == 223){
//				encString = encString.replace(encString.charAt(i), "sz");
//			}
//		}
		return encString;
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