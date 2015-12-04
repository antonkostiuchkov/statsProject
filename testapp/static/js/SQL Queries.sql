USE Db
SELECT
    timestamp, user_name, logger_id, action_code, exec_time
FROM
    trans_log
WHERE
    age BETWEEN ... AND ..
-- Presize match
    name IN ('Anton', 'Gosia')
    name LIKE 'An%'
    DAY(ReleaseDate) = 15 AND
    (MONTH(ReleaseDate) = 5 OR
    MONTH(ReleaseDate) = 6) AND
    YEAR(ReleaseDate) = 2015
ORDER BY
    timestamp desc



SELECT
    CD_Name, OwnerName, ContactDetails
FROM
    CD, Owner
WHERE
    CD.OwnerID = Owner.OwnerID


SELECT
    A.CD_Name, B.OwnerName, B.ContactDetails
FROM
    CD as A, Owner as B
WHERE
    A.OwnerID = B.OwnerID AND B.OwnerName = 'Peter Donovan'


-- Unique results and Sorting
SELECT
    DISTINCT Genre
FROM
    CD
ORDER BY
    Artist

