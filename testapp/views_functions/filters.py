from django.db import connections

def filter_func(table, keycode):

    if table == 'user':
        return get_user(keycode)

    elif table == 'device':
        return get_device(keycode)

    elif table == 'event':
        return get_event(keycode)

    elif table == 'result':
        return get_result_code(keycode)



def get_user(keycode):
    cursor = connections['VMXLogs'].cursor()

    # get all user names
    cursor.execute("""
        SELECT DISTINCT
            user_name AS user_name

        FROM
            trans_log AS TL

        WHERE
            user_name LIKE '%""" + keycode + """%'
    """)
    rows = cursor.fetchall()

    name_list = []

    for user_name in rows:
        name_list.append(user_name[0])

    return name_list


def get_device(keycode):
    cursor = connections['VMXLogs'].cursor()

    cursor.execute("""
        SELECT DISTINCT
            TL.primary_device AS primary_device
            ,DN.name AS device_name
        FROM
            trans_log AS TL
            INNER JOIN device_names AS DN
                ON TL.primary_device = DN.id
        WHERE
            DN.name LIKE '%""" + keycode + """%'
    """)
    rows = cursor.fetchall()

    device_list = []

    for device in rows:
        device_list.append(device[1])

    return device_list



def get_event(keycode):
    cursor = connections['VMXLogs'].cursor()

    cursor.execute("""
        SELECT DISTINCT
            TL.action_code AS action_code
            ,TLAC.lac_name AS operation_name

        FROM
            trans_log AS TL
            INNER JOIN trans_log_action_codes AS TLAC
                ON TL.action_code = TLAC.lac_id

        WHERE
            TLAC.lac_name LIKE '%""" + keycode + """%'

    """)
    rows = cursor.fetchall()

    events_list = []

    for operation in rows:
        d = {}
        # d['action_code'] = operation[0]
        d['operation_name'] = operation[1]

        events_list.append(d)

    return events_list



def get_result_code(keycode):
    cursor = connections['VMXLogs'].cursor()

    cursor.execute("""
        SELECT DISTINCT
            TL.result_code AS result_code
        FROM
            trans_log AS TL
        WHERE
            TL.result_code = """ + keycode + """
    """)
    rows = cursor.fetchall()

    code_list = []

    for result_code in rows:
        code_list.append(result_code[0])

    return code_list