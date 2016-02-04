from django.db import connections
from django.http import HttpResponse
import collections

import time
import datetime

import urllib
import json


def data_query_func(request):

    params_string = request.GET.get('queryParams')
    params_dict = json.loads(params_string)

    result = {
        'data': [],
        'axis': {
            'categoryAxis': {'field': 'date'},
            'valueAxis': []
        }
    }


    # List of vars needed for SQL query
    list_of_vars = [
        'granularity',
        'start_time',
        'end_time',
        'graph_id',
        'average',
        'maximum',
        'user_name',
        'result_code',
        'device_id',
        'action_code'
    ]

    # Catching if some of the needed vars were not sent by user
    if set(list_of_vars).issubset(set(params_dict.keys())):
        granularity         = str(params_dict['granularity'])
        start_time          = str(params_dict['start_time'])
        end_time            = str(params_dict['end_time'])
        graph_id            = str(params_dict['graph_id'])
        average             = str(params_dict['average'])
        maximum             = str(params_dict['maximum'])
        user_name           = str(params_dict['user_name'])
        result_code         = str(params_dict['result_code'])
        device_id           = str(params_dict['device_id'])
        action_code         = str(params_dict['action_code'])

    else:
        # Default values to be assigned if none were sent from UI
        granularity         = str(params_dict['granularity'])
        start_time          = str(params_dict['start_time'])
        end_time            = str(params_dict['end_time'])
        graph_id            = str(params_dict['graph_id'])
        average             = str(params_dict['average'])
        maximum             = str(params_dict['maximum'])
        user_name   = 'all'
        device_id   = 'all'
        result_code = '999'
        action_code = '999'


    cursor = connections['VMXLogs'].cursor()
    if graph_id == "1":
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

        obj_list = []

        for date, cmd_count, err_count, exec_time_avg, exec_time_max in rows:

            a = str(date).split()
            dateStr = a[0] + 'T' + a[1] + 'Z'

            dateUnix = time.mktime(datetime.datetime.strptime(str(date), "%Y-%m-%d %H:%M:%S").timetuple())


            obj = (
                # ('date', dateUnix * 1000 + 1000 * 3600),
                ('date', dateStr),
                ('command_count', cmd_count),
                ('error_count', err_count),
            )
            d = collections.OrderedDict(obj)

            if exec_time_avg >= 0:
                d['execution_time_avg'] = float(exec_time_avg)
            if exec_time_max >= 0:
                d['execution_time_max'] = float(exec_time_max)

            obj_list.append(d)

        result['data'] = obj_list
        x = result['data'][0].keys()[0]
        result['axis']['categoryAxis']['field'] = x

        for y_axis in result['data'][0].keys()[1:]:
            result['axis']['valueAxis'].append({
                'field': y_axis,
                'title': y_axis.replace('_', ' ').title()
            })


    elif graph_id == "2":
        cursor.execute("""
            SELECT
                user_name as user_name
                ,COUNT(TL.action_code) as cmd_count
                ,COUNT(CASE WHEN TL.result_code = 1 THEN 1 END) as err_count

            FROM
                trans_log AS TL

            WHERE
                    date_trunc('""" + granularity + """', TL.timestamp) >= '""" + start_time + """'
                AND
                    date_trunc('""" + granularity + """', TL.timestamp) <= '""" + end_time + """'
                AND
                    user_name != ''
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
                user_name

            --ORDER BY
            --    cmd_count desc

        """)
        rows = cursor.fetchall()


        obj_list = []

        # first element in obj belongs to x_axis
        for user_name, cmd_count, err_count in rows:
            obj = (
                ('user_name', user_name),
                ('command_count', cmd_count),
                ('error_count', err_count),
            )

            d = collections.OrderedDict(obj)
            obj_list.append(d)

        result['data'] = obj_list
        x = result['data'][0].keys()[0]
        result['axis']['categoryAxis']['field'] = x

        for y_axis in result['data'][0].keys()[1:]:
            result['axis']['valueAxis'].append({
                'field': y_axis,
                'title': y_axis.replace('_', ' ').title()
            })


    elif graph_id == "3":
        cursor.execute("""
            SELECT
                DN.name AS device_name
                ,COUNT(TL.action_code) AS cmd_count
                ,COUNT(CASE WHEN TL.result_code = 1 THEN 1 END) AS err_count

            FROM
                trans_log AS TL
                INNER JOIN device_names AS DN
                    ON TL.primary_device = DN.id

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
                device_name

            -- ORDER BY
            --    cmd_count desc


        """)
        rows = cursor.fetchall()


        obj_list = []

        for device_name, cmd_count, err_count in rows:
            obj = (
                ('device_name', device_name),
                ('command_count', cmd_count),
                ('error_count', err_count),
            )

            d = collections.OrderedDict(obj)
            obj_list.append(d)

        result['data'] = obj_list
        x = result['data'][0].keys()[0]
        result['axis']['categoryAxis']['field'] = x

        for y_axis in result['data'][0].keys()[1:]:
            result['axis']['valueAxis'].append({
                'field': y_axis,
                'title': y_axis.replace('_', ' ').title()
            })



    elif graph_id == "4":
        obj_list = []
        result['data'] = obj_list
        tables = [
            ("t_system_object", "sobj_system_id", "All Objects"),
            ("t_logical_group", "lgrp_system_id", "Logical Group"),
            ("t_users", "usr_id", "Users"),
            ("t_user_groups", "grp_id", "User groups"),
            ("t_service_host", "host_system_id", "Service Host"),
            ("t_alarm_service", "alarm_srv_system_id", "Alarm Service"),
            ("t_metrics_service", "metrics_system_id", "Metrics Service"),
            ("t_auth_service", "auth_srv_system_id", "Authorisation Service"),
            ("t_automation_gateway", "ag_system_id", "Automation Gateway"),
            ("t_conf_service", "conf_srv_system_id", "Configuration Service"),
            ("t_system_server", "srv_system_id", "System Server"),
            ("t_universal_proxy", "px_system_id", "Universal Proxy"),
            ("t_telemetry_controller", "tcx_system_id", "Telemetry Controller"),
            ("t_translog_service", "translog_system_id", "Transaction Log Service"),
            ("t_event_notification_service", "event_srv_system_id", "Event notification service"),
            ("t_camera", "cam_system_id", "All Cameras"),
            ("t_camera_positioner", "cpos_camera_id", "PTZ"),
            ("t_camera", "cam_system_id", "IP"),
            ("t_camera", "cam_system_id", "Fixed"),
            ("t_proxy_device", "prx_system_id", "Proxy Device"),
            ("t_encoding_channel", "tec_system_id", "Encoding Channel"),
            ("t_reflector", "r_system_id", "Reflector"),
            ("t_media_reflector", "mr_system_id", "Media Reflector"),
            ("t_transmitter", "tx_system_id", "Transmitter"),
            ("t_telemetry", "tel_id", "Telemetry"),
            ("t_preset", "id", "Presets"),
            ("t_display", "dsp_system_id", "Display"),
            ("t_dynamic_video_wall", "dvw_system_id", "Dynamic Video Wall"),
            ("t_multiplexer", "mux_system_id", "Multiplexer"),
            ("t_receiver", "rx_system_id", "Receiver"),
            ("t_video_wall", "vw_id", "Video Wall"),
            ("t_loop_storage", "lsx_system_id", "Loop Storage"),
            ("t_video_player", "vpt_system_id", "Video Player"),
            ("t_video_recorder", "vr_system_id", "Video Recorder"),
            ("t_video_storage", "vst_system_id", "Video Storage"),
            ("t_external_device", "ed_system_id", "External Device"),
            ("t_snmp_agent", "sa_system_id", "SNMP Agent"),
        ]



        cursor = connections['VMXConfig'].cursor()


        for x in tables:
            table = x[0]
            column = x[1]
            name = x[2]

            # Check if camers have associated proxy device for streaming
            if name == "All Cameras":
                cursor.execute("""
                    SELECT
                        COUNT(CASE WHEN so.sobj_enabled = 't' THEN 1 END) AS enabled
                        ,COUNT(CASE WHEN so.sobj_enabled = 'f' THEN 1 END) AS disabled
                    FROM
                        t_camera AS a
                        INNER JOIN t_proxy_assoc AS pa
                            ON a.cam_system_id = pa.pas_moris_dev_id
                        INNER JOIN t_system_object AS so
                            ON a.cam_system_id = so.sobj_system_id
                """)

                rows = cursor.fetchall()

                result_tuple = rows[0]

                d = collections.OrderedDict()
                d['object_name'] = name
                d['enabled'] = result_tuple[0]
                d['disabled'] = result_tuple[1]
                obj_list.append(d)

            elif name == "PTZ":
                cursor.execute("""
                   SELECT
                        COUNT(CASE WHEN so.sobj_enabled = 't' THEN 1 END) AS enabled
                        ,COUNT(CASE WHEN so.sobj_enabled = 'f' THEN 1 END) AS disabled

                    FROM
                        t_camera_positioner AS a
                        INNER JOIN t_proxy_assoc AS pa
                            ON a.cpos_camera_id = pa.pas_moris_dev_id
                        INNER JOIN t_system_object AS so
                            ON a.cpos_camera_id = so.sobj_system_id
                """)

                rows = cursor.fetchall()

                result_tuple = rows[0]

                d = collections.OrderedDict()
                d['object_name'] = name
                d['enabled'] = result_tuple[0]
                d['disabled'] = result_tuple[1]

                obj_list.append(d)

            elif name in ["IP", "Fixed"]:
                cursor.execute("""
                   SELECT
                        COUNT(CASE WHEN so.sobj_enabled = 't' THEN 1 END) AS enabled
                        ,COUNT(CASE WHEN so.sobj_enabled = 'f' THEN 1 END) AS disabled

                    FROM
                        t_camera AS a
                        LEFT OUTER JOIN t_camera_positioner AS cp
                            ON a.cam_system_id = cp.cpos_camera_id
                        INNER JOIN t_proxy_assoc AS pa
                            ON a.cam_system_id = pa.pas_moris_dev_id
                        INNER JOIN t_system_object AS so
                            ON a.cam_system_id = so.sobj_system_id
                    WHERE
                        CASE WHEN '""" + name + """' = 'Fixed'
                        THEN
                            cp.cpos_camera_id is NULL
                        ELSE
                            a.cam_ip_type = TRUE
                        END
                """)

                rows = cursor.fetchall()

                result_tuple = rows[0]

                d = collections.OrderedDict()
                d['object_name'] = name
                d['enabled'] = result_tuple[0]
                d['disabled'] = result_tuple[1]

                obj_list.append(d)

            else:
                cursor.execute("""
                   SELECT
                        COUNT(CASE WHEN so.sobj_enabled = 't' THEN 1 END) AS enabled
                        ,COUNT(CASE WHEN so.sobj_enabled = 'f' THEN 1 END) AS disabled

                    FROM
                        """ + table + """ AS a
                        INNER JOIN t_system_object AS so
                            ON a.""" + column + """ = so.sobj_system_id

                """)

                rows = cursor.fetchall()

                result_tuple = rows[0]

                d = collections.OrderedDict()
                d['object_name'] = name
                d['enabled'] = result_tuple[0]
                d['disabled'] = result_tuple[1]

                obj_list.append(d)

    elif graph_id == "5":
        cursor = connections['VMXMetrics'].cursor()
        cursor.execute("""
            SELECT
                date_trunc('minute', mt_startdate) as date
                ,COUNT(CASE WHEN online = 1 THEN 1 END) AS offline
                ,COUNT(CASE WHEN online = 0 THEN 1 END) AS online
            FROM
                t_online
            WHERE
                    mt_startdate >= '2016-02-02 10:00:00'
                AND
                    mt_startdate <= '2016-02-02 12:00:00'
            GROUP BY
                date
            ORDER BY
                date desc

        """)

        rows = cursor.fetchall()

        obj_list = []

        for date, offline, online in rows:
            a = str(date).split()
            dateStr = a[0] + 'T' + a[1] + 'Z'
        #     dateUnix = time.mktime(datetime.datetime.strptime(str(date), "%Y-%m-%d %H:%M:%S").timetuple())

            obj = (
                # ('date', dateUnix * 1000 + 1000 * 3600),
                ('date', dateStr),
                ('devices_offline', offline),
                ('devices_online', online),
            )
            d = collections.OrderedDict(obj)

            obj_list.append(d)

        result['data'] = obj_list
        x = result['data'][0].keys()[0]
        result['axis']['categoryAxis']['field'] = x

        for y_axis in result['data'][0].keys()[1:]:
            result['axis']['valueAxis'].append({
                'field': y_axis,
                'title': y_axis.replace('_', ' ').title()
            })

    return result