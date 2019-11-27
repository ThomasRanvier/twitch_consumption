import requests
import csv
from datetime import datetime

f = open('/home/etudiant/twitch_consumption/data/name_id.csv', newline='')
f_csv = csv.reader(f, delimiter=',')
content = []
for row in f_csv:
    res = requests.get('https://api.twitch.tv/helix/streams?user_id=' + row[1], headers={'Accept': 'application/vnd.twitchtv.v5+json', 'Client-ID': '9b5jewtemicj2fcbm818syf1bb3oqb'})
    infos = [row[0], res.json()['data']]
    content.append(infos)
f.close()
now = datetime.now()
f = open('/home/etudiant/twitch_consumption/data/collected_data/' + now.strftime('%Y_%m_%d-%H_%M_%S') + '.csv', 'w')
writer = csv.writer(f)
writer.writerows(content)
f.close()
