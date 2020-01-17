This project is a visualization of streaming consumption of the 30 streamers considered as the most populars in France. 
The ranking of the streamers is based on the one from the [twitchmetrics](https://www.twitchmetrics.net/channels/popularity?lang=fr&page=0) website as it was in november 2019.

This visualization highlights three main types of streamers:
* Ponctual streamers, they stream once or twice per week, ex : [Squeezie](https://www.twitch.tv/squeezielive/)
* Regular streamers, they stream almost everyday, ex : [Locklear](https://www.twitch.tv/locklear/) 
* Web TVs, they can be compared to television channels.
Streamers take turn in several shows on those channels, the stream is almost never interrupted on the whole week, ex : [Solary](https://www.twitch.tv/solary/)

The visualization is composed of a central circular timeline which displays the streaming times of each streamer. 
On that central graph we can see the different types of streamers appear, to simplify the visualization of those types we ordered them by type. 
The fact that the timeline is circular puts very well in light the different types of streamers. 
It also allows to easily visualize an entire week in a relatively small space, which would be harder on a linear chart.

There also is an area chart, in the upper right corner, which displays the number of viewers for each of the 30 streamers.

It is possible to select a streamer by clicking on one of its arcs on the timeline or on the area of its number of viewers on the area chart. 
Additional informations on the streamer are then displayed in the infobox on the bottom right corner. 
We can see the streamed hours number, the average and peak number of viewers, the number of streams and a bar plot with the number of viewers on the selected period.

Indeed, it is also possible to select a period, it either is of one week (by default) or one day. 
To select a day, you have to click on the corresponding day on the main timeline.
