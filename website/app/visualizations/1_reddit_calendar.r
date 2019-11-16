
# http://margintale.blogspot.in/2012/04/ggplot2-time-series-heatmaps.html
library(ggplot2)
library(plyr)
library(scales)
library(zoo)
library(lubridate)
library(bigrquery)
library(plotly)
library(htmlwidgets)

# bq_auth(path = "My Project 47099-13c6aa62c8bf.json")
# posts <- "exalted-gamma-253718"

# sql <- "SELECT DATE(TIMESTAMP_SECONDS(created_utc)) as date,
# COUNT(*) as num_submissions
# FROM `fh-bigquery.reddit_posts.*`
# WHERE (_TABLE_SUFFIX BETWEEN '2016_01' AND '2019_08')
# OR (_TABLE_SUFFIX = 'full_corpus_201512')
# GROUP BY date
# ORDER by date"

# tb <- bq_project_query(posts, sql)
# df<-bq_table_download(tb) #, max_results = 10)
# write.csv(df,'C:\\Users\\nwadhera\\capstone\\calendar.csv', row.names = FALSE)
df <- read.csv("data/calendar.csv")
df$year = year(df$date)
df$month = month(df$date, label = TRUE, abbr = TRUE)
df$weekday = wday(df$date, label = TRUE, abbr = TRUE)
df$monthday = mday(df$date)
df$monthweek = ceiling(df$monthday / 7)
df$monthf<-factor(df$month)
df$weekdayf<-factor(df$weekday)
df$yearmonth<-as.yearmon(df$date)
df$yearmonthf<-factor(df$yearmonth)
df$week <- as.numeric(format(as.Date(df$date),"%W"))

df <- df[, c("year", "yearmonthf", "monthf", "week", "monthweek", "weekdayf", "num_submissions")]
head(df)

m <- ggplot(df, aes(monthweek, weekdayf, fill = num_submissions))
m <- m + geom_tile(colour = "white")
m <- m + facet_grid(year~monthf)
m <- m + scale_fill_gradient(low="maroon", high="green")
m <- m + labs(x="Week of Month", 
              y="",
              title="Time-Series Calendar Heatmap",
              subtitle="Reddit Submissions",
              fill = "number of submissions")
m <- m + theme(axis.text=element_text(size = 6)) 
m <- m + theme(plot.title=element_text(size=25, hjust=0.5, face="bold", colour="maroon", vjust=-1))
m <- m + theme(plot.subtitle=element_text(size=18, hjust=0.5, face="italic", color="black"))
m <- m + theme(legend.background = element_rect(fill="lightblue",
                                  size=0.5, linetype="solid", 
                                  colour ="darkblue"))
m <- m + theme(legend.position="top")
# m
# dev.copy(png,'calendar.png')
# dev.off()
gg <- ggplotly(m)

#save as HtmlWigdet
htmlwidgets::saveWidget(as.widget(gg), "./calendar.html", FALSE)


