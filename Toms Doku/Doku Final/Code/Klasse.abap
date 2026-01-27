CLASS zcl_vacationblock DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC .

  PUBLIC SECTION.

    INTERFACES if_amdp_marker_hdb .

    CLASS-METHODS vacation_block FOR TABLE FUNCTION Z_VACATION.

  PROTECTED SECTION.
  PRIVATE SECTION.
ENDCLASS.



CLASS zcl_vacationblock IMPLEMENTATION.

  METHOD vacation_block BY DATABASE FUNCTION
                        FOR HDB LANGUAGE SQLSCRIPT
                        OPTIONS READ-ONLY
                        USING zmvd_lr_days.

    lt_result =
    WITH UrlaubAlsBlock AS (
      SELECT
        mandt,
        leave_request_id,
        employee_id,
        workday_type,
        workday_date,
        workday_date - ROW_NUMBER() OVER (PARTITION BY leave_request_id, employee_id, workday_type ORDER BY workday_date) AS Gruppe
      FROM
        zmvd_lr_days
      WHERE
        mandt = :clnt
    ),
    GruppierteZeitraeume AS (
      SELECT
        mandt,
        leave_request_id AS appointmentsid,
        employee_id AS employeeid,
        workday_type AS vacationtype,
        MIN(workday_date) AS validfrom,
        MAX(workday_date) AS validto
      FROM
        UrlaubAlsBlock
      GROUP BY
        mandt,
        leave_request_id,
        employee_id,
        workday_type,
        Gruppe
    )
    SELECT * FROM GruppierteZeitraeume;

    return :lt_result;

  ENDMETHOD.

ENDCLASS.