$( document ).ready(function() {
	var move =0;
  	$('.circle').mouseenter(function(t){
  		if(move==0){
			move=1;
  		}else{
			$('.tri').css({display:'none'});
			$('.detail').css({display:'none'});
  		}
  		var here = $(this);
		$('.tri').css({
			left:here.position().left-15,
			top:here.position().top+20,
			display:'block'
		});
		$('.detail').css({
			left:here.position().left-80,
			top:here.position().top+45,
			display:'block'
		});
		$('#location').text('location:locate!');
		$('#flood').text('flood:fllflflfl');

	});	
});


