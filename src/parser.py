import json, csv, math
from datetime import datetime as dt

raw_json = json.load(open('../data/pre_data.json'))
start_list = []
end_list = []


for streamer in raw_json:
    print(streamer)
    raw_json[streamer] = {'infos':{}, 'streams':raw_json[streamer]}
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

min_global = 1575241200
max_global = 1575846000

# print(min_stamp, max_stamp)
# print(min_global, max_global)

stamp_scale = max_global - min_global

with open('../data/pic_and_color.csv', encoding='utf-8') as f:
    reader = csv.reader(f, delimiter=',')
    for row in reader:
        raw_json[row[0]]['infos']['pp'] = row[1]
        raw_json[row[0]]['infos']['color'] = row[2]



for streamer in raw_json:
    for stream in raw_json[streamer]['streams']:
        split_start = stream['start'].split('_')
        split_end = stream['end'].split('_')
  
        stream['stamp_start'] = dt.timestamp(dt(int(split_start[0]),int(split_start[1]),int(split_start[2]),int(split_start[3]),int(split_start[4]),int(split_start[5]))) - min_global
        stream['stamp_end'] = dt.timestamp(dt(int(split_end[0]),int(split_end[1]),int(split_end[2]),int(split_end[3]),int(split_end[4]),int(split_end[5]))) - min_global

        stream['angle_start'] = (stream['stamp_start']/stamp_scale)*math.pi*2
        stream['angle_end'] = (stream['stamp_end']/stamp_scale)*math.pi*2
        
        # print(stream['angle_end'])

json = json.dumps(raw_json, indent=4)
f = open('../data/pre_data.json','w+')
f.write(json)
f.close()

        
print(raw_json['Squeezielive'])