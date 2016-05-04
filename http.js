  var request = require("request");
  var fs = require("fs");
  var cheerio = require("cheerio");
	  request({
	    url: "http://waterdata.usgs.gov/mi/nwis/uv?cb_00055=on&cb_00010=on&format=html&site_no=04119400&period=&begin_date=2016-05-03&end_date=2016-05-03",
	    method: "GET"
	  }, function(e,r,b) {
	    if(e || !b) { return; }
	    console.log(b);
	    var $ = cheerio.load(b);
	    var result = [];
	    var titles = $('table.tablesorter tbody td');
	    for(var index = 0;index < titles.length;index++){
	    	console.log($(titles[index]).text());
	    	result.push($(titles[index]).text());
	    }
	    fs.writeFileSync("result.json", JSON.stringify(result));
	  });
