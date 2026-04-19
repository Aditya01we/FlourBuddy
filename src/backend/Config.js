const BASE_URL = 'https://somalease.com:5030/api/';
const BASE_URL1 = 'https://somalease.com/admin/api/';
const XApiKey = 'e2cfe1ebab87981db56aa5aea4448701';
//222874891986-d3ak6g6cmt4ell8rpqhfufnl8q31i0r5.apps.googleusercontent.com
// 222874891986-d3ak6g6cmt4ell8rpqhfufnl8q31i0r5.apps.googleusercontent.com
//810434911655-q0t1uhv83g0a3m8e2h5jmf1h8aknqnq8.apps.googleusercontent.com
const webClientId =
  '502266012525-sfb9m6udntavi0p9473hamm6m3vtkqjf.apps.googleusercontent.com';
// export const GOOGLE_MAPS_APIKEY = '';
export const GOOGLE_MAPS_APIKEY = ''

export const CASHFREE_KEY = 'https://api.cashfree.com/api/v2/cftoken/order'; //LIVE KEY
export const CLIENT_SECRET_KEY = 'bbb212ba075a3a2b7c122eeb01e257a85110ac9e'; //TEST KEY
export const CLIENT_ID_KEY = '214360532bf3572e7d3f471276063412'; //TEST KEY
export const APP_ID = '214360532bf3572e7d3f471276063412'; //TEST KEY

export const PATH_URL = {
  allsetting: 'setting',
  userhome: 'v1/home',
  contractorhome: 'contractor/homecontractor',
  userbooking: 'v1/addBooking',
  usersupport: 'support-enquiry-user',
  contractors: 'contractor/support-enquiry-contractor',
  dlr: 'dlr',
  profile: 'profile',
  attendance_report: 'attendance_report',
  attendance_report_details: 'attendance_report_details',
  wage_register: 'wage_register',
  pf_year: 'pf_year',
  pf_month: 'pf_month',
  pf_document1: 'pf_document',
  usernotification: 'notification',
  getcategory_by_order: 'getcategory_by_order',
  getcontractor: 'getcontractor',
  getNearLabour: 'getNearLabour',
  getbookinid: 'getbookinid',
  userRegister: 'company_register',
  verifyotp: 'verify_login',
  getrole: 'getrole',
  login: 'login_otp_mobile',
  loginverify_otp: 'loginverify_otp',
  details: 'details',
  propertie_search: 'propertie_search',
  getcategory: 'getcategory',
  company_request: 'company_request',
  getorder: 'getorder',
  assign_contractor: 'assign_contractor',
  cancelorder: 'cancelorder',
  order_cancel_reqest: 'getcancel_msg',
  order_cancel_reqest1: 'order_cancel_reqest',
  invoice: 'invoice',
  approval: 'approved_attendance_details',
  pendingattendance: 'pending_attendance_details',
  get_new_user_approval: 'get_new_user_approval',
  order_extend: 'order_extend',
  caddbooking: 'contractor/addBookingcontractor',
  cadddlr: 'contractor/dlrcontractor',
  getbanklist: 'getbank',

  getState: 'contractor/getstate',
  getcity: 'master_city',
  getcurrency: 'master_master_currency',
  gettime: 'master_viewingtime',
  getproperty: 'master_property_type',
  getbuilding: 'master_building_type',
  getbhk: 'master_bhk_type',
  getfacing: 'master_facing',
  getage: 'master_property_age',
  getfloor: 'master_floor',
  getapartment: 'master_apartment_no',
  getmonth: 'master_monthly_maintenance',
  getfrom: 'master_available_from',
  getfurnishing: 'master_furnishings',
  homeproperties: 'home_properties',
  getcheck: 'master_amenities',
  contractorcategory: 'contractor/getcategory',
  contractorverifyotp: 'contractor/verify_otp',
  contractorresend: 'contractor/sendotp',
  contractorlogin: 'contractor/login',
  contractorprofile: 'contractor/profile',
  addsupervisior: 'contractor/add_supervisor',
  supervisor_list: 'contractor/supervisor_list',
  subcategory: 'contractor/getsubcategory',
  getcategoryLabour: 'contractor/getCategory_labour',
  labourlist: 'contractor/labour_list',
  contractorcurrent: 'contractor/current_job',
  acceptjob: 'contractor/accept_job',
  close_job: 'contractor/close_job',
  assign_labour_list: 'contractor/assign_labour_list',
  assign_supervisor_list: 'contractor/assign_supervisor_list',
  labour_allocate: 'contractor/labour_allocate',
  supervisor_allocate: 'contractor/supervisor_allocate',
  gettimezone: 'contractor/getzone',
  ratechart: 'contractor/getratechart',
  bookingid: 'contractor/all_booking_id',
  daily_attendance_labour_list: 'contractor/daily_attendance_labour_list',
  daily_attendance_labour_store: 'contractor/daily_attendance_labour_store',
  pfmonth: 'contractor/pf_month',
  pf_document: 'contractor/pf_document',
  muster_roll_download: 'contractor/muster_roll_download',
  getreport: 'contractor/getreport',
  getreportDetail: 'contractor/getreportdetails',
  contractorsetting: 'contractor/setting',

  fieldlogin: 'field-officer/login',
  fieldprofile: 'field-officer/get_profile',
  fieldlabourlist: 'field-officer/labour_list',
  fieldsupervisorlist: 'field-officer/supervisor_list',
  fieldreport: 'field-officer/get-reports',
  fieldnotification: 'field-officer/notification',
  fieldsetting: 'contractor/setting',
  fieldjob: 'field-officer/myjobs',
  requestadvance: 'field-officer/send-advance-request',
  fogetbooking: 'field-officer/activeorders',
  fogetadvance: 'field-officer/get-advance-request',
  fieldofficerjobdetail: 'field-officer/jobdetails',
  getexpense: 'field-officer/get-expense-request',
  labouraorder: 'field-officer/labourlistaccordingtoorders',
  fieldofficersupport: 'field-officer/support-enquiry',

  labourotp: 'labour/sendotpnewuser',
  labourlogin: 'labour/login',
  labournotification: 'labour/notification',
  labourforget: 'labour/forgotpassword',
  labourforget1: 'field-officer/forgotpassword',
  labourforget2: 'contractor/forgotpassword',

  labourchange: 'labour/changepassword',
  labourchange1: 'field-officer/changepassword',
  labourchange2: 'contractor/changepassword',

  labourcurrent: 'labour/currentjob',
  laboursupport: 'labour/support-enquiry',
  labourassigned: 'labour/assigendjob',
  labourattendance: 'labour/attendencelist',
  labourpf: 'labour/pfdetails',
  labouresi: 'labour/esidetails',
  labourstate: 'getstate',
  labourwage: 'labour/wagechart',
  labourearning: 'labour/myearning',
  laourmuster: 'labour/musterrolllist',
  labourleavecalendar: 'labour/leavecalender',
  markleave: 'labour/add_markleave',
  labourleavelist: 'labour/leavelist',
  labourupdatecategory: 'labour/reportsupdatescategory',
  labourupdatedetail: 'labour/reportsupdates',
  labourreprthome: 'labour/reportshome',

  contractorearning: 'contractor/total_earning',
  contractortotalearning: 'contractor/total_earning_details',
  contractornotification: 'contractor/notification',
};

export const ApiSauceJson = {
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};
export const ApiSauceJson1 = {
  baseURL: BASE_URL1,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};
export const ApiSauceMultipart = {
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data',
  },
};
export const latitudeDelta = 0.0922;
