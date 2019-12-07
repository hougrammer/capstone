
# http://r-statistics.co/Top50-Ggplot2-Visualizations-MasterList-R-Code.html
library(ggplot2)
library(bigrquery)
library(treemap)
library(dplyr)
library(d3treeR)

# bq_auth(path = "My Project 47099-13c6aa62c8bf.json")
# posts <- "exalted-gamma-253718"

# sql <- "SELECT subreddit,author,COUNT(*) as numsub
# FROM `fh-bigquery.reddit_posts.*`
# WHERE ((_TABLE_SUFFIX BETWEEN '2016_01' AND '2019_08')
# OR (_TABLE_SUFFIX = 'full_corpus_201512'))
# AND author <> '[deleted]'
# GROUP BY subreddit,author
# ORDER BY num_submissions DESC
# LIMIT 1000000"

# tb <- bq_project_query(posts, sql)
# df<-bq_table_download(tb) #, max_results = 10)
# write.csv(df,'C:\\Users\\nwadhera\\capstonenw\\treemap.csv', row.names = FALSE)
# df <- read.csv("C:\\Users\\nwadhera\\capstonenw\\data\\treemap.csv")
# #by_red <- df %>% group_by(subreddit)

# # res <- aggregate(df$numsub, by=list(subreddit=df$subreddit), FUN=sum)
# # head(res[order(res$numsub)])
# newdf <- df %>%
#             group_by(subreddit) %>%
#             summarize(sumsub=sum(numsub)) %>%
#             arrange(desc(sumsub))
# dffinal <- merge(df[c("subreddit","author","numsub")], newdf[c("subreddit","sumsub")], by.x="subreddit", by.y="subreddit")

# # dforder <- dffinal[order(-dffinal$sumsub)]
# # head(dforder, 30)
# write.csv(dffinal,'C:\\Users\\nwadhera\\capstonenw\\data\\treemapgrouped.csv', row.names = FALSE)
#head(df)
df <- read.csv("C:\\Users\\nwadhera\\capstonenw\\data\\treemapgroupedsmall.csv")
df <- df %>% filter(!is.na(numsub)) %>% filter(!is.na(sumsub)) %>% filter(numsub>1000)
df[, c(3,4)] <- sapply(df[, c(3,4)], as.numeric)
head(df)
# plot

#png(filename = "treegrouped.png", width = 2000, height = 1000, res = 175)
tm <- treemap(df, #Your data frame object
        index=c("subreddit","author"),  #A list of your categorical variables
        vSize ="sumsub",  #This is your quantitative variable
        type="value", #shows value on hover
        vColor="numsub",#This is your quantitative variable for next level
        title="Subreddit-author mapping", #Customize your title
        title.legend="Subreddit submissions",
        fontsize.title = 14, #Change the font size of the title
        fontsize.labels = 0,
        fontsize.legend=10,
        fontcolor.labels=c("orange","orange"),
        position.legend="bottom",
        format.legend = list(scientific = FALSE, big.mark = " "),
        lowerbound.cex.labels=1,
        border.col=c("white","white"),             # Color of borders of groups, of subgroups, of subsubgroups ....
        border.lwds=c(2,2),                         # Width of colors
#         fontface.labels=c(2,4),
        palette="Set1",
        bg.labels=c("transparent"),
        align.labels = list(c("centre","centre"),c("right","bottom")),
        overlap.labels=0,
        force.print.labels=TRUE,
        inflate.labels=F,
        )
d3tree2(tm,rootname = "Reddit")
#dev.off()








