# Twitch consumption visualization

[Visualization](https://thomasranvier.github.io/twitch_consumption/)

[Wiki](https://github.com/ThomasRanvier/twitch_consumption/wiki)

## Description française

Ce projet permet de visualiser la consommation de streaming sur les 30 streamers considérés comme étant les plus populaires en France.
Le classement des streamers est basé sur le classement du site [twitchmetrics](https://www.twitchmetrics.net/channels/popularity?lang=fr&page=0) au mois de novembre 2019.

Cette visualisation permet de mettre en évidence 3 patterns différents de streamers :
* Les streamers ponctuels, ils diffusent du contenu une à deux fois par semaine, ex : [Squeezie](https://www.twitch.tv/squeezielive/)
* Les streamers réguliers, ils diffusent du contenu quasiment tous les jours, ex : [Locklear](https://www.twitch.tv/locklear/)
* Les Web TVs, elles sont similaires à des chaînes de télévision.
Sur celles-ci des streamers se relaient dans diverses émissions.
Le flux de diffusion est alors très peu interrompu sur l’ensemble de la semaine, ex : [Solary](https://www.twitch.tv/solary/)

La visualisation est composée d’une timeline circulaire et centrale qui affiche les temps de streaming de chacun.
On peut y voir apparaître les patterns décrits ci-dessus, afin d’en simplifier la visualisation nous avons organisé les streamers par type.
Le fait que cette timeline soit circulaire permet de particulièrement bien mettre en avant les différents types de streamers.
Cela permet également de pouvoir visualiser une semaine complète sur un espace restreint, contrairement à une visualisation linéaire.

La visualisation présente également un area chart annexe, en haut à droite, qui permet de voir le nombre de viewers sur l’ensemble des 30 streamers et pour chacun d’entres-eux.

Il est possible de sélectionner un streamer en particulier en cliquant sur un de ses arcs sur la timeline ou sur l’aire de son nombre de viewers dans l’area chart.
Des informations complémentaires concernant ce streamer s’affichent alors au sein de l'infobox en bas à droite.
On y voit apparaître le nombre d’heures streamées, le nombre de viewers moyens et au maximum, le nombre de streams et un bar-plot du nombre de viewers sur la période sélectionnée.

En effet, il est possible de sélectionner une période, soit d’une semaine (par défaut), soit d’un jour.
Pour sélectionner un jour il faut cliquer sur le jour correspondant sur la timeline principale.

## English description

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
