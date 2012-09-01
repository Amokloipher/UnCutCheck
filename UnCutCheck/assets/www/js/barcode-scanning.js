$(document).ready(function(){
	$('.start-scan').on('tap', function(){
			
//		processScanResult({text: '4012019979686'});
		
		
		window.plugins.barcodeScanner.scan( function(result) {
			showModal();
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