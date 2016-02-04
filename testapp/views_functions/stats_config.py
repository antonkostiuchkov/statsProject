import time
import stats_list
import collections

from . import filter_queries
import json

def stats_config_func(id):


    stats_configuration = (
        ('title', 'Chart title'),
        ('description', 'Chart description'),
        ('view', {
            'chart': 'Chart view',
            'table': {}
        }),
        ('editMode', True),
        ('data', {}),
    )

    # params = (
    #     ('granularity', {
    #         'label': 'Granularity',
    #         'type': 'select',
    #         'options': ['Minute', 'Hour', 'Day', 'Week', 'Month', 'Quarter', 'Year'],
    #         'value': 'Hour'
    #     }),
    #     ('startTime', {
    #         'label': 'From:',
    #         'type': 'select',
    #         'value': '2016-01-01'
    #     }),
    #     ('endTime', {
    #         'label': 'From:',
    #         'type': 'select',
    #         'value': time.strftime('%Y-%m-%d')
    #     }),
    # )

    parameters = [{
        'granularity': {
            'label': 'Granularity',
            'type': 'select',
            'options': ['Minute', 'Hour', 'Day', 'Week', 'Month', 'Quarter', 'Year'],
            'value': 'Hour'
        }}, {
        'startTime': {
            'label': 'From:',
            'type': 'select',
            'value': '2016-01-01'
        }}, {
        'endTime': {
            'label': 'From:',
            'type': 'select',
            'value': time.strftime('%Y-%m-%d')
        }}

    ]

    stats_configuration = collections.OrderedDict(stats_configuration)
    # stats_configuration['params'] = collections.OrderedDict(params)
    stats_configuration['params'] = parameters


    # Accessing all instances of the class Graph
    for instance in stats_list.Graph.instances:
        instance_dict = instance.__dict__
        instance_id = instance_dict['id']
        selected_id = int(id)


        if instance_id == selected_id:
            stats_configuration['title'] = instance_dict['title']
            stats_configuration['description'] = instance_dict['description']
            stats_configuration['view']['chart'] = instance_dict['type']
            # stats_configuration['axis']['categoryAxis']['field'] = instance_dict['x_axis']

            for filter in instance_dict['filters']:
                filterParams = {filter: {
                    'label': filter.replace('_', ' ').title(),
                    'type': 'multiselect',
                    'value': ''
                }}

                if filter == 'event':
                    getFilter = getattr(filter_queries, 'get_'+filter)
                    filterParams = {filter: {
                        'label': filter.replace('_', ' ').title(),
                        'type': 'multiselect',
                        'options': getFilter(),
                        'value': ''
                    }}
                elif filter == 'result_code':
                    getFilter = getattr(filter_queries, 'get_'+filter)
                    filterParams = {filter: {
                        'label': filter.replace('_', ' ').title(),
                        'type': 'multiselect',
                        'options': getFilter(),
                        'value': ''
                    }}
                elif filter == 'average_time' or filter == 'maximum_time':
                    filterParams = {filter: {
                        'label': filter.replace('_', ' ').title(),
                        'type': 'checkbox',
                        'value': ''
                    }}


                parameters.append(filterParams)



            #     # getFilter = getattr(filter_queries, 'get_event')
            #     # print getFilter
            #     # functions = dir(filter_queries)
            #     # print [x for x in functions if 'get_' + filter in x][0]

            #     stats_configuration['params'][filter] = {
            #         'label': filter.replace('_', ' ').title(),
            #         'type': 'multiselect',
            #         # 'options': getFilter(),
            #         'value': ''
            #     }


                # if filter == 'event':
                #     getFilter = getattr(filter_queries, 'get_'+filter)
                #     filterParams = {filter: {
                #         'label': filter.replace('_', ' ').title(),
                #         'type': 'multiselect',
                #         'options': getFilter(),
                #         'value': ''
                #     }}
                #     # parameters.append(filterParams)
                #     # item for item in stats_configuration['params']

                #     for item in stats_configuration['params']:
                #         if
                #         print item


                    # stats_configuration['params'][filter] = {
                    #     'label': filter.replace('_', ' ').title(),
                    #     'type': 'multiselect',
                    #     'options': getFilter(),
                    #     'value': ''
                    # }
            #     elif filter == 'result_code':
            #         getFilter = getattr(filter_queries, 'get_'+filter)
            #         stats_configuration['params'][filter] = {
            #             'label': filter.replace('_', ' ').title(),
            #             'type': 'multiselect',
            #             'options': getFilter(),
            #             'value': ''
            #         }

        # if selected_id == 1:
        #     stats_configuration['params']['avg_max'] = True
        # if selected_id == 4:
        #     stats_configuration['params']['startTime'] = False
        #     stats_configuration['params']['endTime'] = False
        #     stats_configuration['params']['granularity'] = False


    return stats_configuration
