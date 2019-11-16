
# http://r-statistics.co/Top50-Ggplot2-Visualizations-MasterList-R-Code.html
library(ggplot2)
library(bigrquery)
library(treemap)
library(dplyr)

bq_auth(path = "My Project 47099-13c6aa62c8bf.json")
posts <- "exalted-gamma-253718"

sql <- "SELECT subreddit,author,COUNT(*) as numsub
FROM `fh-bigquery.reddit_posts.*`
WHERE ((_TABLE_SUFFIX BETWEEN '2016_01' AND '2019_08')
OR (_TABLE_SUFFIX = 'full_corpus_201512'))
AND author <> '[deleted]'
GROUP BY subreddit,author
ORDER BY num_submissions DESC
LIMIT 1000000"

tb <- bq_project_query(posts, sql)
df<-bq_table_download(tb) #, max_results = 10)
write.csv(df,'C:\\Users\\nwadhera\\capstonenw\\treemap.csv', row.names = FALSE)
df <- read.csv("C:\\Users\\nwadhera\\capstonenw\\data\\treemap.csv")
#by_red <- df %>% group_by(subreddit)

# res <- aggregate(df$numsub, by=list(subreddit=df$subreddit), FUN=sum)
# head(res[order(res$numsub)])
newdf <- df %>%
            group_by(subreddit) %>%
            summarize(sumsub=sum(numsub)) %>%
            arrange(desc(sumsub))
dffinal <- merge(df[c("subreddit","author","numsub")], newdf[c("subreddit","sumsub")], by.x="subreddit", by.y="subreddit")

# dforder <- dffinal[order(-dffinal$sumsub)]
# head(dforder, 30)
write.csv(dffinal,'C:\\Users\\nwadhera\\capstonenw\\data\\treemapgrouped.csv', row.names = FALSE)
head(df)
# reduce the rows to manageable
# sort data with sum descending
df <- read.csv("C:\\Users\\nwadhera\\capstonenw\\data\\treemapgroupedsmaller.csv")
# plot

png(filename = "treegrouped.png", width = 2000, height = 1000, res = 175)
treemap(df, #Your data frame object
        index=c("author"),  #A list of your categorical variables
        vSize = "numsub",  #This is your quantitative variable
        type="index",
        title="Reddit author classification", #Customize your title
        fontsize.title = 14, #Change the font size of the title
        fontsize.labels = c(15,12),
        fontcolor.labels=c("white","orange"),
        fontface.labels=c(2,4),
        bg.labels=c("transparent"),
        align.labels = list(c("centre","centre"),c("right","bottom")),
        overlap.labels=0, 
        inflate.labels=F,
        )
dev.off()


