<html>
<head>

<link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
<script src="//code.jquery.com/jquery-1.10.2.js"></script>
<script src="hotdrink.min.js"></script>
<script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>


<script>
$( document ).ready(function() {
	$("#locationTextHd").attr('autocomplete', 'off');
	$("#locationTextHd").keyup(function(e){
		
		
		keywordHd = $("#locationTextHd").val();
		var p = new hd.Promise();
		var q = p.then(
			
				function fetch(keywordHd){
				var x = new hd.Promise();
				$.ajax({
				      url: 'webapi/locations/'+ keywordHd,
				      error: function() {
				         //$('#info').html('<p>An error has occurred</p>');
				      },
				      dataType: 'json',
				      success: function(data) {
						var cities = [];  
				    	for(i=0;i<data.length;i++)
				    	{ cities.push(data[i].cityName); }
				    	x.resolve( cities );
				    	
				      },
				      type: 'GET'
				   })
				   return x;
			}
		
		);
		
		
		q.then(
				function populate(citiesHd)
				{	
					$("#locationTextHd").autocomplete({
			    	     source: citiesHd
			    	   });
					$("#locationTextHd").attr('autocomplete', 'on');
					
				}
		);	
		
			
	
	p.resolve(keywordHd);	
	});
	
	
	
	$("#locationTextNm").keydown(function(){
		$.ajax({
		      url: 'webapi/locations/'+ $("#locationTextNm").val(),
		      error: function() {
		         //$('#info').html('<p>An error has occurred</p>');
		      },
		      dataType: 'json',
		      success: function(data) {
				var cities = [];  
		    	for(i=0;i<data.length;i++)
		    	{ cities.push(data[i].cityName); }
		    	$( "#locationTextNm" ).autocomplete({
		    	     source: cities
		    	   });	
		      },
		      type: 'GET'
		   })
		});
	
});	
	
	
	
</script>



</head>
<body>
    <h2>Testing of HotDrink!</h2>
     <div id="info"></div>
 <div class="ui-widget">   
 <table>
 <tr>
 <td>
 	<i>Input Box with HotDrink capabilities</i><br/><br/>
    <label for="locationTextHd"></label>
   <input id="locationTextHd"  value=""/>
 </td>
 
 <td>
 &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
 </td>
 
 <td>
  	<i>Input Box without HotDrink capabilities</i><br/><br/>
    <label for="locationTextNm"></label>
   <input id="locationTextNm"  value=""/>
 </td>
 
 
 
 </tr>
 </table>
 </div>  
   <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
 
   
 
</body>
</html>
