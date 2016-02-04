from django.db import connections
import collections
import time

def sql_date_func(params_list):

    print params_list

    obj_list = []

    cursor = connections['VMXLogs'].cursor()
    if grouping in params_list and grouping == "date":
        cursor.execute("""
            SELECT
                date_trunc('""" + granularity + """', TL.timestamp) AS date
                ,COUNT(TL.action_code) AS cmd_count
                ,COUNT(CASE WHEN TL.result_code = 1 THEN 1 END) AS err_count
                ,CASE WHEN """ + average + """ THEN round(AVG(TL.exec_time), 2) END AS exec_time_avg
                ,CASE WHEN """ + maximum + """ THEN MAX(TL.exec_time) END AS exec_time_max
            FROM
                trans_log AS TL


            WHERE
                    date_trunc('""" + granularity + """', TL.timestamp) >= '""" + start_time + """'
                AND
                    date_trunc('""" + granularity + """', TL.timestamp) <= '""" + end_time + """'

                AND
                    CASE
                        WHEN '""" + user_name + """' = 'all' THEN user_name = user_name
                        ELSE user_name = '""" + user_name + """'
                    END

                AND
                    CASE
                        WHEN '""" + result_code + """' = '999' THEN result_code = result_code
                        ELSE result_code = '""" + result_code + """'
                    END

                AND
                    CASE
                        WHEN '""" + device_id + """' = 'all' THEN primary_device = primary_device
                        ELSE primary_device = '""" + device_id + """'
                    END

                AND
                    CASE
                        WHEN '""" + action_code + """' = '999' THEN action_code = action_code
                        ELSE action_code = '""" + action_code + """'
                    END


            GROUP BY
                date
            ORDER BY
                date

        """)
        rows = cursor.fetchall()

        # obj_list = []

        for date, cmd_count, err_count, exec_time_avg, exec_time_max in rows:

            a = str(date).split()
            dateStr = a[0] + 'T' + a[1] + '+01:00'

            d = collections.OrderedDict()
            d['date'] = dateStr
            d['cmd_count'] = cmd_count
            d['err_count'] = err_count
            if exec_time_avg >= 0:
                d['exec_time_avg'] = float(exec_time_avg)
            if exec_time_max >= 0:
                d['exec_time_max'] = float(exec_time_max)

            obj_list.append(d)


    return obj_list