function loadData() {

  var $bgImg = $('#bgImg');
  var $body = $('body');
  var $wikiElem = $('#wikipedia-links');
  var $nytHeaderElem = $('#nytimes-header');
  var $nytElem = $('#nytimes-articles');
  var $greeting = $('#greeting');

//collect input values
  var $streetName = $.trim($("#street").val());
  var $cityName = $.trim($("#city").val());


//string tokenizer for google streetview data
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

//string tokenizer for wikipedia data
  function wikiStringTokenizer(data){
    if($(data).has(" ")){
      var splitData = data.split(' ');
      var joinData  = splitData.join('_');
      data = joinData;
      return data;
    }
    else{
      return data;
    }
  };

  var newStreetName  = stringTokenizer($streetName);
  var newCityName =  stringTokenizer($cityName);
  var wikiCityName = wikiStringTokenizer($cityName);

//changing greeting text
  $greeting.text('So you want to live at '+$streetName+', '+$cityName+' ?');


// load streetview -- google streetview api
var $imgSrc = $.trim("http://maps.googleapis.com/maps/api/streetview?size=600x400&location="+newStreetName+ "," +newCityName);
  $($bgImg).attr("src",$imgSrc).addClass("bgimg");

  // clear out old data before new request
  $wikiElem.text("");
  $nytElem.text("");

///new york times api call starts here

  var nyTimesUrl = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=new+york+times&fq=glocations:"+'("'+$cityName+'")'+"&sort=newest&api-key=69145763600df668a53d2431b71d4d26:0:74541354";

  $.getJSON(nyTimesUrl,function(data){
    if(data.response.meta.hits!= 0){
    $nytHeaderElem.text("New York Times Articles About "+$cityName);
    }
    else {
      $nytHeaderElem.text("New York Times Articles About "+$cityName+ " was not found");
    }
    for(var dataJson in data.response.docs){
      if(data.response.docs[dataJson]){
      $($nytElem).append('<li class="article article-list"><a href='+data.response.docs[dataJson].web_url+'>'+data.response.docs[dataJson].web_url+'</a>'+ '<br><p>'+data.response.docs[dataJson].snippet+'</p><br/></li>');
      }
    }
  }).fail(function(jqxhr,textStatus,error) {
    var error1 = " was not found";
    $nytHeaderElem.text("New York Times Articles About "+$cityName+ error1);
  });
//new york times api call ends here

///wikipedia api ajax call starts here

//setting timeout for wiki request
var wikiRequestTimeout  = setTimeout(function(){
  $wikiElem.text("failed to get response from wikipedia");
},8000);

  $.ajax({
    url: "https://en.wikipedia.org/w/api.php?action=opensearch&search="+wikiCityName+"&format=json",
    contentType: 'application/json',
    dataType: 'jsonp',
    jsonpCallback : 'jsonCallback',
    crossDomain : true,
    success: function(data){
      var linkTitle = data[1];
      var links = data[3];
      for(var i=0;i<linkTitle.length;i++){
        $($wikiElem).append('<li class="article article-list"><a href='+links[i]+'>'+linkTitle[i]+'</a></li><br/>');
    }
    //clear timeout upon ajax call success
    clearTimeout(wikiRequestTimeout);
  },
    error:function(jqxhr,textStatus,error){
      console.log("error is "+error+" "+textStatus);
      $wikiElem.text("<p>Relevant wikipedia articles for "+$cityName+ " were not found</p>");
    }
  });

///wikipedia api ajax call ends here

    return false;

};

$('#form-container').submit(loadData);


// new york times API key
// 69145763600df668a53d2431b71d4d26:0:74541354
