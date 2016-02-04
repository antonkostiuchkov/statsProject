from django.db import connections
import collections

def query_names_func():

    cursor = connections['VMXLogs'].cursor()

    # get all user names
    cursor.execute("""
        SELECT DISTINCT
            user_name AS user_name

        FROM
            trans_log AS TL

        WHERE
            user_name != ''
    """)
    rows = cursor.fetchall()

    name_list = []

    for user_name in rows:
        name_list.append(user_name[0])


    # Get all device names
    cursor.execute("""
        SELECT DISTINCT
            TL.primary_device AS primary_device
            ,DN.name AS device_name
        FROM
            trans_log AS TL
            INNER JOIN device_names AS DN
                ON TL.primary_device = DN.id
    """)
    rows = cursor.fetchall()

    device_list = []

    for device in rows:
        d = collections.OrderedDict()
        d['device_id'] = device[0]
        d['device_name'] = device[1]

        device_list.append(d)


    # Get all operation names
    cursor.execute("""
        SELECT DISTINCT
            TL.action_code AS action_code
            ,TLAC.lac_name AS operation_name

        FROM
            trans_log AS TL
            INNER JOIN trans_log_action_codes AS TLAC
                ON TL.action_code = TLAC.lac_id
    """)
    rows = cursor.fetchall()

    operations_list = []

    for operation in rows:
        d = collections.OrderedDict()
        d['action_code'] = operation[0]
        d['operation_name'] = operation[1]

        operations_list.append(d)


    # Get all result codes
    cursor.execute("""
        SELECT DISTINCT
            TL.result_code AS result_code
        FROM
            trans_log AS TL
    """)
    rows = cursor.fetchall()

    code_list = []

    for result_code in rows:
        code_list.append(result_code[0])


    # Collecting all together
    return {
        'user_names': name_list,
        'device_names': device_list,
        'operation_names': operations_list,
        'result_codes': code_list,
    }



