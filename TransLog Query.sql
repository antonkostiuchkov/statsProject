-- Transaction Log
-- JOININNG ALL Data in One table

SELECT
    date_trunc('hour', TL.timestamp) AS date_aggr,
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
    timestamp > CURRENT_DATE - INTERVAL '3' day
    AND
        user_name != ''
    AND
        user_name != 'road'
    AND
        user_name != 'root'
ORDER BY
    date_aggr desc




-- Grouping

-- All actions per user
SELECT
    user_name,
    COUNT(lac_name) AS user_actions
FROM
    trans_log as TL,
    trans_log_action_codes as TLAC
WHERE
    timestamp > CURRENT_DATE - INTERVAL '7' day
    AND
        user_name != ''
    AND
        TL.action_code = TLAC.lac_id
GROUP BY
    user_name
ORDER BY
    user_actions desc



-- Connection attempts per user except root
SELECT
    user_name,
    COUNT(lac_name) as connection_count
FROM
    trans_log as TL,
    trans_log_action_codes as TLAC
WHERE
    timestamp > CURRENT_DATE - INTERVAL '7' day
    AND
        user_name != ''
    AND
        user_name != 'root'
    AND
        lac_name = 'User authorization'
    AND
        TL.action_code = TLAC.lac_id
GROUP BY
    user_name
ORDER BY
    connection_count desc



-- TOP 5 Number of connections per camera

SELECT
    DN.name,
    COUNT(TLAC.lac_name) as connection_count
FROM
    trans_log as TL
    INNER JOIN device_names as DN
        ON TL.primary_device = DN.id
    INNER JOIN trans_log_action_codes as TLAC
        ON TL.action_code = TLAC.lac_id
WHERE
    timestamp > CURRENT_DATE - INTERVAL '7' day
    AND
        lac_name = 'Connection'
GROUP BY
    DN.name
ORDER BY
    connection_count desc
LIMIT
    5




-- Count of operations. What operations were the most frequent.

SELECT
    TLAC.lac_name,
    COUNT(TLAC.lac_name) as operation_count
FROM
    trans_log AS TL
    INNER JOIN trans_log_action_codes AS TLAC
        ON TL.action_code = TLAC.lac_id
WHERE
    timestamp > CURRENT_DATE - INTERVAL '7' day
    AND
        user_name != ''
GROUP BY
    TLAC.lac_name
ORDER BY
    operation_count desc











-- Average execution time for operations for cameras (look hightcharts example with browsers)

SELECT
    name,
    lac_name,
    AVG(exec_time) as avg_exec_time
FROM
    trans_log as TL,
    trans_log_action_codes as TLAC,
    device_names as DN

WHERE
    timestamp > CURRENT_DATE - INTERVAL '7' day
    AND
        user_name != ''
    AND
        TL.action_code = TLAC.lac_id
    AND
        TL.primary_device = DN.id
GROUP BY
    name,
    lac_name
ORDER BY
    name,
    avg_exec_time desc




-- Amount of user authentications for the last 60 days

SELECT
    date_trunc('day', TL.timestamp)::date as date_aggr,
    COUNT(lac_name) as auth_num
FROM
    trans_log as TL,
    trans_log_action_codes as TLAC

WHERE
    timestamp > CURRENT_DATE - INTERVAL '60' day
    AND
        user_name != ''
    AND
        lac_name = 'User authorization'
    AND
        TL.action_code = TLAC.lac_id
GROUP BY
    date_aggr
ORDER BY
    date_aggr desc





-- GENERAL SYSTEM SPEED for the last 30 days

SELECT
    date_trunc('day', TL.timestamp)::date as date_aggr,
    AVG(exec_time) as avg_exec_time
FROM
    trans_log as TL,
    trans_log_action_codes as TLAC,
    device_names as DN

WHERE
    timestamp > CURRENT_DATE - INTERVAL '30' day
    AND
        user_name != ''
    AND
        TL.action_code = TLAC.lac_id
    AND
        TL.primary_device = DN.id
GROUP BY
    date_aggr
ORDER BY
    date_aggr desc




-- Number of connections per day. What days are the busiest

SELECT
    date_trunc('day', TL.timestamp)::date as date_aggr,
    COUNT(lac_name) as connection_count
FROM
    trans_log as TL,
    trans_log_action_codes as TLAC,
    device_names as DN

WHERE
    timestamp > CURRENT_DATE - INTERVAL '90' day
    AND
        user_name != ''
    AND
        lac_name = 'Connection'
    AND
        TL.action_code = TLAC.lac_id
    AND
        TL.primary_device = DN.id
GROUP BY
    date_aggr
ORDER BY
    date_aggr desc






-- All operations for the last 2 days

SELECT
    TL.timestamp AS date_aggr,
    TLAC.lac_name AS operation_name

FROM
    trans_log AS TL
    INNER JOIN trans_log_action_codes AS TLAC
        ON TL.action_code = TLAC.lac_id

WHERE
    timestamp > CURRENT_DATE - INTERVAL '2' day
    AND
        user_name != ''
--GROUP BY
--  date_aggr
ORDER BY
    date_aggr desc





-- Amount of all operations per minute
SELECT
    date_trunc('minute', TL.timestamp) AS date_aggr,
    COUNT(TLAC.lac_name) AS operations

FROM
    trans_log AS TL
    INNER JOIN trans_log_action_codes AS TLAC
        ON TL.action_code = TLAC.lac_id

WHERE
    timestamp > CURRENT_DATE - INTERVAL '2' day
    AND
        user_name != ''
GROUP BY
    date_aggr
ORDER BY
    date_aggr desc




-- Amount of User authorizations for the last 3 days per hour
SELECT
    date_trunc('hour', TL.timestamp) AS date_aggr,
    COUNT(TLAC.lac_name) AS operations

FROM
    trans_log AS TL
    INNER JOIN trans_log_action_codes AS TLAC
        ON TL.action_code = TLAC.lac_id

WHERE
    timestamp > CURRENT_DATE - INTERVAL '3' day
    AND
        user_name != ''
    AND
        user_name != 'road'
    AND
        user_name != 'root'
    AND
        TLAC.lac_name = 'User authorization'
GROUP BY
    date_aggr
ORDER BY
    date_aggr desc
