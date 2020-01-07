import json, csv, math
from datetime import datetime as dt

raw_json = json.load(open('../data/data.json'))
start_list = []
end_list = []

suppress_list = []
for streamer in raw_json:
    if(raw_json[streamer]['streams'] == []):
        suppress_list.append(streamer)

for s in suppress_list:
    del raw_json[s]

json = json.dumps(raw_json, indent=4)
f = open('../data/data.json','w+')
f.write(json)
f.close()