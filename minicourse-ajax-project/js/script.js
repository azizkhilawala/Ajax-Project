function loadData() {

  var $bgImg = $('#bgImg');
  var $body = $('body');
  var $wikiElem = $('#wikipedia-links');
  var $nytHeaderElem = $('#nytimes-header');
  var $nytElem = $('#nytimes-articles');
  var $greeting = $('#greeting');

  var $streetName = $.trim($("#street").val());
  var $cityName = $.trim($("#city").val());


  function stringTokenizer(data){
    if($(data).has(" ")){
      var splitData = data.split(' ');
      var joinData  = splitData.join('+');
      data = joinData;
      return data;
    }
    else{
      return data;
    }
  };

  var newStreetName  = stringTokenizer($streetName);
  var newCityName =  stringTokenizer($cityName);

  $greeting.text('So you want to live at '+$streetName+', '+$cityName+' ?');


  // load streetview

var  $imgSrc = $.trim("http://maps.googleapis.com/maps/api/streetview?size=600x400&location="+newStreetName+ "," +newCityName);
  $($bgImg).attr("src",$imgSrc).addClass("bgimg");

  // clear out old data before new request
  $wikiElem.text("");
  $nytElem.text("");

  var nyTimesUrl = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=new+york+times&fq=glocations:"+'("'+$cityName+'")'+"&sort=newest&api-key=69145763600df668a53d2431b71d4d26:0:74541354";


  $.getJSON(nyTimesUrl,function(data){
    $nytHeaderElem.text("New York Times Articles About "+$cityName);
    for(var dataJson in data.response.docs){
      if(data.response.docs[dataJson]){
      $($nytElem).append('<li class="article article-list"><a href='+data.response.docs[dataJson].web_url+'>'+data.response.docs[dataJson].web_url+'</a>'+ '<br><p>'+data.response.docs[dataJson].snippet+'</p><br/></li>');
      }
    }
  });


  return false;

};

$('#form-container').submit(loadData);


// new york times API key
// 69145763600df668a53d2431b71d4d26:0:74541354
