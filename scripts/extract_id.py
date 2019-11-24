import requests
import csv

f = open('../data/most_popular_fr.txt')
content = f.readlines()
f.close()
csv_res = []

for raw_name in content:
    name = raw_name.strip('\n')
    res = requests.get('https://api.twitch.tv/helix/users?login=' + name, headers={'Accept': 'application/vnd.twitchtv.v5+json', 'Client-ID': '9b5jewtemicj2fcbm818syf1bb3oqb'})
    csv_res.append([name, res.json()['data'][0]['id']])

f = open('../data/name_id.csv', 'w')
writer = csv.writer(f)
writer.writerows(csv_res)
f.close()
