from django.db import connection
from django.http import HttpResponse
import json
import collections
from django.shortcuts import render

def index(request):
    template = 'index.html'
    context = { }
    return render(request, template, context)


def query(request, interval, limit):
    if interval is None:
        return HttpResponseBadRequest()
    cursor = connection.cursor()
    cursor.execute("""
        -- JOININNG ALL Data in One table

        SELECT
            date_trunc('""" + interval + """', TL.timestamp) AS date_aggr,
            TL.user_name,
            TLAC.lac_name AS operation_name,
            DN.name AS device_name,
            TL.exec_time
        FROM
            trans_log AS TL
            INNER JOIN trans_log_action_codes AS TLAC
                ON TL.action_code = TLAC.lac_id
            LEFT OUTER JOIN device_names AS DN
                ON TL.primary_device = DN.id


        WHERE
            timestamp > CURRENT_DATE - INTERVAL '""" + limit + """' day
            AND
                user_name != ''
            AND
                user_name != 'road'
            AND
                user_name != 'root'
            AND
                DN.name != ''
        ORDER BY
            date_aggr desc


    """)
    rows = cursor.fetchall()


    obj_list = []

    for date_aggr, user_name, operation_name, device_name, exec_time in rows:
        d = collections.OrderedDict()
        d['date_aggr'] = str(date_aggr)
        d['user_name'] = user_name
        d['operation_name'] = operation_name
        d['device_name'] = device_name
        d['exec_time'] = exec_time
        obj_list.append(d)

    response = HttpResponse(json.dumps(obj_list))
    return response