from django.db import connection
from django.http import HttpResponse
import json
import collections
from django.shortcuts import render


def index(request):
    template = 'index.html'
    context = { }
    return render(request, template, context)


def query(request):
    cursor = connection.cursor()
    cursor.execute("""
        -- JOININNG ALL Data in One table

        SELECT
            date_trunc('day', TL.timestamp)::date AS date_aggr,
            TL.user_name,
            TLAC.lac_name AS operation_names,
            DN.name AS device_names,
            TL.exec_time
        FROM
            trans_log AS TL
            INNER JOIN trans_log_action_codes AS TLAC
                ON TL.action_code = TLAC.lac_id
            LEFT OUTER JOIN device_names AS DN
                ON TL.primary_device = DN.id


        WHERE
            timestamp > CURRENT_DATE - INTERVAL '20' day
            AND
                user_name != ''
        ORDER BY
            date_aggr desc
    """)
    rows = cursor.fetchall()


    obj_list = []

    for date_aggr, user_name, operation_names, device_names, exec_time in rows:
        d = collections.OrderedDict()
        d['date_aggr'] = str(date_aggr)
        d['user_names'] = user_name
        d['operation_names'] = operation_names
        d['device_names'] = device_names
        d['exec_time'] = exec_time
        obj_list.append(d)

    response = HttpResponse(json.dumps(obj_list))
    return response




# def query2(request):
#     cursor = connection.cursor()
#     cursor.execute("""
#         -- Connection attempts per user except root

#         SELECT
#             user_name,
#             COUNT(lac_name) as connection_count
#         FROM
#             trans_log as TL,
#             trans_log_action_codes as TLAC
#         WHERE
#             timestamp > CURRENT_DATE - INTERVAL '7' day
#             AND
#                 user_name != ''
#             AND
#                 user_name != 'root'
#             AND
#                 lac_name = 'User authorization'
#             AND
#                 TL.action_code = TLAC.lac_id
#         GROUP BY
#             user_name
#         ORDER BY
#             connection_count desc
#     """)
#     rows = cursor.fetchall()


#     obj_list = []

#     for user_name, connection_count in rows:
#         d = collections.OrderedDict()
#         d['user_name'] = user_name
#         d['connection_count'] = connection_count
#         obj_list.append(d)

#     response = HttpResponse(json.dumps(obj_list))
#     return response



# def query3(request):
#     cursor = connection.cursor()
#     cursor.execute("""
#         -- TOP 5 Number of connections per camera

#         SELECT
#             DN.name,
#             COUNT(TLAC.lac_name) as connection_count
#         FROM
#             trans_log as TL
#             INNER JOIN device_names as DN
#                 ON TL.primary_device = DN.id
#             INNER JOIN trans_log_action_codes as TLAC
#                 ON TL.action_code = TLAC.lac_id
#         WHERE
#             timestamp > CURRENT_DATE - INTERVAL '7' day
#             AND
#                 lac_name = 'Connection'
#         GROUP BY
#             DN.name
#         ORDER BY
#             connection_count desc
#         LIMIT
#             5
#     """)
#     rows = cursor.fetchall()


#     obj_list = []

#     for device_name, connection_count in rows:
#         d = collections.OrderedDict()
#         d['device_name'] = device_name
#         d['connection_count'] = connection_count
#         obj_list.append(d)

#     response = HttpResponse(json.dumps(obj_list))
#     return response




# def query4(request):
#     cursor = connection.cursor()
#     cursor.execute("""
#         -- Count of operations

#         SELECT
#             TLAC.lac_name,
#             COUNT(TLAC.lac_name) as operation_count
#         FROM
#             trans_log AS TL
#             INNER JOIN trans_log_action_codes AS TLAC
#                 ON TL.action_code = TLAC.lac_id
#         WHERE
#             timestamp > CURRENT_DATE - INTERVAL '7' day
#             AND
#                 user_name != ''
#         GROUP BY
#             TLAC.lac_name
#         HAVING
#             COUNT(TLAC.lac_name) >= 10
#         ORDER BY
#             operation_count desc
#     """)
#     rows = cursor.fetchall()


#     obj_list = []

#     for action_name, operation_count in rows:
#         d = collections.OrderedDict()
#         d['action_name'] = action_name
#         d['operation_count'] = operation_count
#         obj_list.append(d)

#     response = HttpResponse(json.dumps(obj_list))
#     return response





# def query5(request):
#     cursor = connection.cursor()
#     cursor.execute("""
#         -- Amount of user authentications for the last 60 days

#         SELECT
#             date_trunc('day', TL.timestamp)::date as date_aggr,
#             COUNT(lac_name) as auth_num
#         FROM
#             trans_log as TL,
#             trans_log_action_codes as TLAC

#         WHERE
#             timestamp > CURRENT_DATE - INTERVAL '60' day
#             AND
#                 user_name != ''
#             AND
#                 lac_name = 'User authorization'
#             AND
#                 TL.action_code = TLAC.lac_id
#         GROUP BY
#             date_aggr
#         ORDER BY
#             date_aggr
#     """)
#     rows = cursor.fetchall()


#     obj_list = []

#     for date_aggr, auth_num in rows:
#         d = collections.OrderedDict()
#         d['date_aggr'] = str(date_aggr)
#         d['auth_num'] = auth_num
#         obj_list.append(d)

#     response = HttpResponse(json.dumps(obj_list))
#     return response




# def query6(request):
#     cursor = connection.cursor()
#     cursor.execute("""
#         -- GENERAL SYSTEM SPEED for the last 30 days

#         SELECT
#             date_trunc('day', TL.timestamp)::date as date_aggr,
#             AVG(exec_time) as avg_exec_time
#         FROM
#             trans_log as TL,
#             trans_log_action_codes as TLAC,
#             device_names as DN

#         WHERE
#             timestamp > CURRENT_DATE - INTERVAL '30' day
#             AND
#                 user_name != ''
#             AND
#                 TL.action_code = TLAC.lac_id
#             AND
#                 TL.primary_device = DN.id
#         GROUP BY
#             date_aggr
#         ORDER BY
#             date_aggr
#     """)
#     rows = cursor.fetchall()


#     obj_list = []

#     for date_aggr, avg_exec_time in rows:
#         d = collections.OrderedDict()
#         d['date_aggr'] = str(date_aggr)
#         d['avg_exec_time'] = int(avg_exec_time)
#         obj_list.append(d)

#     response = HttpResponse(json.dumps(obj_list))
#     return response