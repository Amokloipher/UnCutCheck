$(document).ready(function(){
	$('.start-scan').on('click', function(){
			
		window.plugins.barcodeScanner.scan( function(result) {
			processScanResult(result);
			
		}, function(error) {
			alert("Scanning failed: " + error);
		});
		
	});
});

function processScanResult(result){
	if(result.cancelled == true){
		return;
	}
	
	$(document).uncut('gatherMovieInfo', result.text);
}