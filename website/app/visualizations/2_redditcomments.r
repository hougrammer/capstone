
options(warn=-1)

# IMPORTANT: This assumes that all packages in "Rstart.R" are installed,
# and the fonts "Source Sans Pro" and "Open Sans Condensed Bold" are installed
# via extrafont. If ggplot2 charts fail to render, you may need to change/remove the theme call.

library(tidyr)
library(methods) # needed for query_exec in Jupyter: https://github.com/hadley/bigrquery/issues/32
library(wordcloud)
library(digest)
library(dplyr)
library(scales)
library(ggplot2)
library(grid)
library(RColorBrewer)
library(bigrquery)
library(plotly)
library(htmlwidgets)

options(repr.plot.mimetypes = 'image/png', repr.plot.width=4, repr.plot.height=3, repr.plot.res=300)

install.packages("tmap",dependencies=TRUE)

#uses standard sql
# dataframe for generating the num_submissions against 
# date_submissions plot

bq_auth(path = "My Project 47099-13c6aa62c8bf.json")
posts <- "exalted-gamma-253718"

sql <- "SELECT word, COUNT(*) as num_words, AVG(score) as avg_score
FROM(FLATTEN((
  SELECT SPLIT(LOWER(REGEXP_REPLACE(body, r'[\\.\\\",*:()\\[\\]/|\\n]', ' ')), ' ') word, score
  FROM [fh-bigquery:reddit_comments.2015_08] 
  WHERE author NOT IN (SELECT author FROM [fh-bigquery:reddit_comments.bots_201505])
    AND subreddit=\"AskReddit\"
  ), word))
GROUP EACH BY word
HAVING num_words >= 10000
ORDER BY num_words DESC"
tb <- bq_project_query(posts, sql, use_legacy_sql = TRUE)
df<-bq_table_download(tb) #, max_results = 10)
df %>% tail(10)

stop_words <- unlist(strsplit("a,able,about,across,after,all,almost,also,am,among,an,and,any,are,as,at,be,because,been,but,by,can,cannot,could,dear,did,do,does,either,else,ever,every,for,from,get,got,had,has,have,he,her,hers,him,his,how,however,i,if,in,into,is,it,its,just,least,let,like,likely,may,me,might,most,must,my,neither,no,nor,not,of,off,often,on,only,or,other,our,own,rather,said,say,says,she,should,since,so,some,than,that,the,their,them,then,there,these,they,this,tis,to,too,twas,us,wants,was,we,were,what,when,where,which,while,who,whom,why,will,with,would,yet,you,your,id,item,it\'s,don\'t",","))
df_nostop <- df %>% filter(!(word %in% stop_words))

png(filename = "wordcloud.png", width = 1280, height = 1000, res= 300)

wordcloud(toupper(df_nostop$word),
          df_nostop$num_words,
#use.r.layout=TRUE,colors=brewer.pal(6,"Dark2"),random.order=FALSE)
#scale=c(8,.3),min.freq=2,max.words=100, random.order=T, rot.per=.15, colors=pal, vfont=c("sans serif","plain"))
            scale=c(8,.2),min.freq=3,
            max.words=Inf, random.order=FALSE, rot.per=.15, colors=brewer.pal(6,"Dark2"))

# pdf('reddit-bigquery-2.pdf')
# print(plot)
dev.off()
plot


