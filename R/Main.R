if(!require(rvest)){
	install.packages("rvest")
	library(rvest)
}
if(!require(stringr)){
	install.packages("stringr")
}
#library(rvest)
if(!require(rjson)){
	install.packages("rjson")
	library(rjson)
}


D_calc <- function(V,I){
	3.6*V*I
}

#C.idella Anonymous 1970
I_calc1 <- function(x){
	233855*x^(-2.4915)
}

#C.idella Guo 1980
I_calc2 <- function(x){
	18779*x^(-1.979)
}

#H.molitrix Guo 1980
I_calc3 <- function(x){
	22456*x^(-2.0989)
}

#Tsuchiya 1980
I_calc4 <- function(x){
	21311*x^(-2.8057)
}

#Chang 1966
I_calc5 <- function(x){
	233855*x^(-2.822)
}

count_average_data <- function(temperature)
{
  total <- 0
  error_num <- 0
  for(x in 1:NROW(temperature)){
    tryCatch({
	aNumber <- as.double(temperature[x])
	total <-  total + aNumber;
    }, error = function(e) {
	error_num <- error_num+1
    })
  }
  if(length(temperature) == error_num)
    return(0)
  return(total/(length(temperature)-error_num));
}

url_format <<- function(date){
	paste("http://waterdata.usgs.gov/ny/nwis/uv?cb_00055=on&cb_00010=on&format=html&site_no=04231600&period=&begin_date=",date,"&end_date=",date,sep="")
}
total_avg_temperature <<- 0;
get_one_day_data <- function(date){
	#http://waterdata.usgs.gov/ny/nwis/uv?cb_00055=on&cb_00010=on&format=html&site_no=04231600&period=&begin_date=2016-04-22&end_date=2016-04-22
	#web_url <- paste("http://waterdata.usgs.gov/ny/nwis/uv?cb_00055=on&cb_00010=on&format=html&site_no=04231600&period=&begin_date=",date,"&end_date=",date,sep="")
	web_url <- url_format(date)
	web_page <- read_html(web_url, encoding="UTF-8")
	#find<tag>
	#tr class=ui-state-default ui-widget-content
	#table <- web_page %>% html_nodes('.tablesorter > tbody') %>% html_text() %>% iconv(from='UTF-8', to='UTF-8')
	row_data <- web_page %>% html_nodes('.tablesorter > tbody')
	#row_text <- row_data %>% html_nodes('tr') %>% html_text() %>% iconv(from='UTF-8', to='UTF-8')
	time <- row_data %>% html_nodes('td:nth-child(1)') %>% html_text() %>% iconv(from='UTF-8', to='UTF-8')
	time <- substr(time,13,17)
	veloc <- row_data %>% html_nodes('td:nth-child(2)') %>% html_text() %>% iconv(from='UTF-8', to='UTF-8')
	veloc <- gsub("P\U00A0\U00A0","",veloc)
	veloc <- gsub("A\U00A0\U00A0","",veloc)
	avg_veloc <- count_average_data(veloc)
	temperature <- row_data %>% html_nodes('td:nth-child(3)') %>% html_text() %>% iconv(from='UTF-8', to='UTF-8')
	temperature <- gsub("P\U00A0\U00A0","",temperature)
	temperature <- gsub("A\U00A0\U00A0","",temperature)
	avg_temperature <- count_average_data(temperature)
	if(avg_temperature > 15){
		total_avg_temperature <- total_avg_temperature+avg_temperature
	}
	#make table to display
	#web_result <- data.frame(Time = time, Temperature = temperature)
	#View(web_result)
	output_text <- paste("{\"time\":\"",time,"\",\"veloc\":\"",veloc,"\",\"temperature\":\"",temperature,"\"}",sep="")
	output_text <- paste(output_text, collapse="," )
	output_text <- paste("\"data\"",":[",output_text,"]",sep="")
	output_text <- paste("\"avg_temperature\":\"",avg_temperature,"\",",output_text,sep="")
	output_text <- paste("\"avg_veloc\":\"",avg_veloc,"\",",output_text,sep="")
	d_value_text <- paste("\"C_idella\":\"",D_calc(avg_veloc,I_calc1(avg_temperature)),"\",",sep="")
	d_value_text <- paste(d_value_text,"\"C_idella2\":\"",D_calc(avg_veloc,I_calc2(avg_temperature)),"\",",sep="")
	d_value_text <- paste(d_value_text,"\"H.molitrix\":\"",D_calc(avg_veloc,I_calc3(avg_temperature)),"\",",sep="")
	d_value_text <- paste(d_value_text,"\"H.molitrix2\":\"",D_calc(avg_veloc,I_calc4(avg_temperature)),"\",",sep="")
	d_value_text <- paste(d_value_text,"\"M.piceus\":\"",D_calc(avg_veloc,I_calc5(avg_temperature)),"\"",sep="")
	output_text <- paste("\"d_value\":{",d_value_text,"},",output_text,sep="")
	output_text <- paste("\"",date,"\":{",output_text,"}",sep="")
}


getData <- function(place_name, lat=0, long=0, start_date=as.Date("2016-1-1"), end_date=as.Date("2016-1-3"), file_name=place_name){
	#place_structure

	date <- seq.Date(start_date, end_date, "days")
	#date <- seq.Date(as.Date("2016-1-1"), Sys.Date(), "days")
	output_text <- lapply(date,get_one_day_data)
	output_text <- paste(output_text, collapse="," )
	output_text <- paste("\"place_data\":{",output_text,"}",sep="")
	output_text <- paste("\"temperature_sum\":\"",total_avg_temperature,"\",",output_text,sep="")
	location_text <- paste("\"lat\":\"",lat,"\"",sep="")
	location_text <- paste("\"long\":\"",long,"\",",location_text,sep="")
	output_text <- paste("\"place_location\":{",location_text,"},",output_text,sep="")
	output_text <- paste("\"place_name\":\"",place_name,"\",",output_text,sep="")
	output_text <- paste("{",output_text,"}",sep="")

	write(output_text,paste(file_name,".json",sep=""))
}

#dates <- seq.Date(x.Date, Sys.Date(), "days")
#seq.Date(x.Date, x.Date+2, "days")