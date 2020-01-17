import json, csv, math
from datetime import datetime as dt
from pathlib import Path
import os 
import pandas as pd
import numpy as np
from statistics import mean 

dir_path = os.path.dirname(os.path.realpath(__file__))

path = Path(dir_path)
path = path.parent

files = [x for x in Path(path.as_uri()[8:len(path.as_uri())] + "/data/used_data").glob('**/*') if x.is_file()]

raw_json = json.load(open('../data/pre_data.json'))
streamers = json.load(open('../data/streamers.json'))
start_list = []
end_list = []

for streamer in raw_json:
    for stream in raw_json[streamer]['streams']:
        split_start = stream['start'].split('_')
        split_end = stream['end'].split('_')
        # print(tmp_start)
        stamp_start = dt.timestamp(dt(int(split_start[0]),int(split_start[1]),int(split_start[2]),int(split_start[3]),int(split_start[4]),int(split_start[5])))
        stamp_end = dt.timestamp(dt(int(split_end[0]),int(split_end[1]),int(split_end[2]),int(split_end[3]),int(split_end[4]),int(split_end[5])))
        # print(streamer)
        # print(stamp_start, stamp_end)
        start_list.append(stamp_start)
        end_list.append(stamp_end)

min_stamp = min(start_list)
max_stamp = max(end_list)

total_views = {}
dates = []
dates_datefm = []
for filename in files:
    sep = str(filename).split('_')
    year = sep[-5][-4:]
    month = sep[-4]
    day = sep[-3][:2]
    hour = sep[-3][3:]
    minute = sep[-2]
    second = sep[-1][:2]
    dates.append(dt.timestamp(dt(int(year),int(month),int(day),int(hour),int(minute),int(second))))
    dates_datefm.append(dt.timestamp(dt(int(year),int(month),int(day),int(hour),int(minute),int(second))))

suppress_list = []
for streamer in raw_json:
    if not(streamer in streamers):
        suppress_list.append(streamer)

for s in suppress_list:
    del raw_json[s]
s_id = 0
min_date = dates[0]
for d in range(len(dates)):
    dates[d] -= min_date
    total_views[dates_datefm[d]] = {}
#viewers_count = [0] * len(dates)
for streamer in raw_json:
    i=0
    streaming = False
    viewer_stream = []
    o_data = []
    total = 0
    nb = 0
    while i < len(raw_json[streamer]['streams']) and raw_json[streamer]['streams'][i]['stamp_end'] < dates[0]:
        i+=1
    if i < len(raw_json[streamer]['streams']):
        streaming = raw_json[streamer]['streams'][i]['stamp_start'] < dates[0]
        if streaming:
            raw_json[streamer]['streams'][i]['stamp_start'] = dates[0]
        j=0
        for h in range(len(dates)):
            if streaming:
                if raw_json[streamer]['streams'][i]['stamp_end'] < dates[h]:
                    streaming = False
                    o_data.append(raw_json[streamer]['streams'][i])
                    i+=1
                    if i >= len(raw_json[streamer]['streams']):
                        break
                    j=0
            else:
                if raw_json[streamer]['streams'][i]['stamp_start'] < dates[h]:
                    streaming = True 
            if streaming and j < len(raw_json[streamer]['streams'][i]['viewers']):
                viewer_stream.append(raw_json[streamer]['streams'][i]['viewers'][j])
                total += raw_json[streamer]['streams'][i]['viewers'][j]
                nb += 1
                #viewers_count[h] += raw_json[streamer]['streams'][i]['viewers'][j]
                j+=1
            else:
                viewer_stream.append(0)
            total_views[dates_datefm[h]][streamer] = viewer_stream[h]
        if streaming:
            raw_json[streamer]['streams'][i]['stamp_end'] = dates[h]
        if i < len(raw_json[streamer]['streams']):
            if (raw_json[streamer]['streams'][i]['stamp_start'] <= dates[h] and raw_json[streamer]['streams'][i]['stamp_end'] >= dates[h]):
                o_data.append(raw_json[streamer]['streams'][i])
        raw_json[streamer]['streams'] = {}
        raw_json[streamer]['streams']['viewers'] = viewer_stream
        
        for d in o_data:
            del d['viewers']
        raw_json[streamer]['streams']['data_stamp'] = o_data
        
    raw_json[streamer]['infos']['pp'] = 'https://thomasranvier.github.io/twitch_consumption/src/img/' + streamer + '.png'
    raw_json[streamer]['infos']['viewers_max'] = max(raw_json[streamer]['streams']['viewers'])
    if nb > 0:
        raw_json[streamer]['infos']['viewers_avg'] = total/nb
    else :
        raw_json[streamer]['infos']['viewers_avg'] = 0
    raw_json[streamer]['infos']['nb_streams'] = len(raw_json[streamer]['streams']['data_stamp'])
    total_time = 0
    for s in raw_json[streamer]['streams']['data_stamp']:
        total_time += (s['stamp_end'] - s['stamp_start'])
    hours = str(int(total_time / 3600))
    minutes = str(int((total_time - int(total_time / 3600) * 3600) / 60))
    raw_json[streamer]['infos']['total_time'] = hours + "h " + minutes + "min"
    raw_json[streamer]['infos']['color'] = (s_id**s_id%83)/83
    raw_json[streamer]['infos']['cat'] = streamers[streamer]
    s_id += 1
        # split_start = stream['start'].split('_')
        # split_end = stream['end'].split('_')
  
        # stream['stamp_start'] = dt.timestamp(dt(int(split_start[0]),int(split_start[1]),int(split_start[2]),int(split_start[3]),int(split_start[4]),int(split_start[5]))) - min_stamp
        # stream['stamp_end'] = dt.timestamp(dt(int(split_end[0]),int(split_end[1]),int(split_end[2]),int(split_end[3]),int(split_end[4]),int(split_end[5]))) - min_stamp

        # stream['angle_start'] = (stream['stamp_start']/stamp_scale)*math.pi*2
        # stream['angle_end'] = (stream['stamp_end']/stamp_scale)*math.pi*2
        
#         #print(stream['angle_end'])
# total_views = {}
# for h in range(len(dates)):

json_s = json.dumps(raw_json, indent=4)
f = open('../data/data.json','w+')
f.write(json_s)
f.close()

tv = pd.DataFrame(total_views)
tv = tv.T
tv = tv[streamers]
#tv['blank'] = [2000] * len(total_views)  
tv.to_csv('../data/total_views.csv')

# json_v = json.dumps(total_views, indent=4)
# f = open('../data/total_views.json','w+')
# f.write(json_v)
# f.close()
        
# print(raw_json['Squeezielive'])