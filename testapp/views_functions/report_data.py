from django.db import connections
import collections

def report_data_func():
    obj_list = []
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

    return obj_list