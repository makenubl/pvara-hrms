import api from './api';

const attendanceService = {
  markAttendance: (attendanceData) => 
    api.post('/attendance/mark', attendanceData),
  
  getAttendance: (employeeId = null, dateRange = 'this-month') => 
    api.get(`/attendance/${employeeId ? employeeId + '/' : ''}records?range=${dateRange}`),
  
  getAttendanceByDate: (date) => 
    api.get(`/attendance/date/${date}`),
  
  updateAttendance: (recordId, data) => 
    api.put(`/attendance/${recordId}`, data),
  
  deleteAttendance: (recordId) => 
    api.delete(`/attendance/${recordId}`),
  
  getAttendanceStats: (employeeId = null, dateRange = 'this-month') => 
    api.get(`/attendance/${employeeId ? employeeId + '/' : ''}stats?range=${dateRange}`),
  
  exportAttendance: (dateRange = 'this-month', format = 'csv') => 
    api.get(`/attendance/export?range=${dateRange}&format=${format}`),
};

export default attendanceService;
