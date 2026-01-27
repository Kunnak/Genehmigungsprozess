@AbapCatalog.viewEnhancementCategory: [#NONE]
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'MVD: Abwesenheiten von Mitarbeitern'
@Metadata.ignorePropagatedAnnotations: true
@ObjectModel.usageType:{
    serviceQuality: #X,
    sizeCategory: #S,
    dataClass: #MIXED
}
define view entity ZM_I_AbsencePeriod
// Krankheitstage
  as select from ZM_I_SickLeave as SickDays
{
  key     SickLeaveId                                                        as AppointmentsId,
  key     ValidFrom                                                          as ValidFrom,
          case
            when ValidTo is initial then ValidFrom
            else ValidTo end                                                 as ValidTo,
          cast('Sick' as abap.char( 25 ) )                                   as Type,
          EmployeeNumber                                                     as EmployeeNumber,
          _Status._Text[ Language = $session.system_language ].SickLeaveText as Discription
}

// Urlaubstage
union select from ZM_I_VacationPeriod( clnt: $session.client ) as VacationDays

  left outer join ZM_I_LeaveEntitlementAssign         as VacationEntitlement on  VacationDays.employeeid              =  VacationEntitlement.EmployeeId
                                                                             and VacationEntitlement.LeaveEntitlement =  '2' // ID von Sonderurlaub
                                                                             and VacationDays.validfrom               >= VacationEntitlement.ValidFrom
                                                                             and VacationDays.validto                 <= VacationEntitlement.ValidTo
association [0..1] to ZM_I_Employee as Employee on VacationDays.employeeid = Employee.EmployeeId
{
  key  VacationDays.appointmentsid     as AppointmentsId, // UUID von leave_request_id
  key  VacationDays.validfrom          as ValidFrom,
       case
         when VacationDays.validto is initial then VacationDays.validfrom
         else VacationDays.validto end as ValidTo,
       VacationDays.vacationtype       as Type,
       Employee.EmployeeNumber         as EmployeeNumber,
       case when VacationEntitlement.LeaveEntitlement = '2'
             then 'Sonderurlaub'
             else 'Standardurlaub' end as Discription
}

// Besondere Tage (zb. Schulblöcke)
union select from ZM_I_SpecialWorkdatesPart as SpecialDays
{
  key ParticipantId                        as AppointmentsId,
  key _SpecialWorkdates.ValidFrom          as ValidFrom,
      case
        when _SpecialWorkdates.ValidTo is initial then _SpecialWorkdates.ValidFrom
        else _SpecialWorkdates.ValidTo end as ValidTo,
      'Special'                            as Type,
      EmployeeNumber                       as EmployeeNumber,
      _SpecialWorkdates.Name               as Discription
}
