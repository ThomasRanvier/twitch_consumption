import os
import csv
import json

data = {}
for x in os.listdir('../data/collected_data/'):
    with open('../data/collected_data/' + x,encoding='utf-8') as f:
        reader = csv.DictReader(f, ['name', 'data'])
        print(x)
        for row in reader:
            raw_lst = eval(row['data'])
            if row['name'] not in data:
                data[row['name']] = [{'viewers': [], 'start':-1, 'end':-1}]
            if len(raw_lst) != 0:
                now = x.split('.')[0]
                lst = data[row['name']]
                # print(data[row['name']])
                lst[len(lst)-1]['viewers'].append(raw_lst[0]['viewer_count'])
                if lst[len(lst)-1]['start'] == -1:  
                    s_at = raw_lst[0]['started_at'].replace('-','_').replace(':','_').replace('T','_').replace('Z','')
                    lst[len(lst)-1]['start'] = s_at
                    lst[len(lst)-1]['end'] = now
                lst[len(lst)-1]['end'] = now

                # lst[len(lst)-1]['viewers'].append(raw_lstrow['viewer_count'])

                data[row['name']] = lst

            elif len(raw_lst) == 0 and data[row['name']][len(data[row['name']])-1]['start'] != -1:
                data[row['name']].append({'viewers': [], 'start':-1, 'end':-1})
for key in data:
    data[key].pop()
json = json.dumps(data, indent=4)
f = open("../data/data.json","w+")
f.write(json)
f.close()