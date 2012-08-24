$(document).ready(function(){
	$('.start-scan').on('click', function(){
		var debug = 1;
		
		if(debug == 1){
			processScanResult({text : '4010232035455'});
		}else{
			
			window.plugins.barcodeScanner.scan( function(result) {
				
				
//			alert("We got a barcode\n" +
//                      "Result: " + result.text + "\n" +
//                      "Format: " + result.format + "\n" +
//                      "Cancelled: " + result.cancelled);
				
				
				processScanResult(result);
				
			}, function(error) {
				alert("Scanning failed: " + error);
			});
		}
		
	});
});

function processScanResult(result){
	if(result.cancelled == true){
		return;
	}
	
	$(document).uncut('gatherMovieInfo', result.text);
}