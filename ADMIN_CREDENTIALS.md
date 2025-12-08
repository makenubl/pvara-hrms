# 🔐 PVARA HRMS - Admin & Test Credentials

## ✅ PRIMARY ADMIN CREDENTIALS

### Admin Account
```
Email: admin@pvara.com
Password: Admin@123
Role: SUPER_ADMIN
Department: Executive
```

**Permissions:**
- ✅ Full system access
- ✅ User management
- ✅ All approvals
- ✅ System settings
- ✅ Analytics & reporting
- ✅ Employee management
- ✅ Payroll management
- ✅ Compliance management

---

## 👤 DEMO/TEST CREDENTIALS

### Demo User (Pre-filled in Login)
```
Email: demo@pvara.com
Password: demo123
Role: HR_MANAGER
Department: Human Resources
```

**Permissions:**
- ✅ View employees
- ✅ Manage employees
- ✅ Approve leave
- ✅ Manage payroll
- ✅ View attendance
- ✅ View performance

---

## 👥 ADDITIONAL TEST ACCOUNTS

### Manager Account
```
Email: manager@pvara.com
Password: Manager@123
Role: DEPARTMENT_MANAGER
Department: Engineering
```

**Permissions:**
- ✅ View team members
- ✅ Approve leave for team
- ✅ View performance reviews
- ✅ Manage department budget

### HR Executive Account
```
Email: hr@pvara.com
Password: HR@123
Role: HR_EXECUTIVE
Department: Human Resources
```

**Permissions:**
- ✅ Manage all employees
- ✅ Approve leave
- ✅ Manage recruitment
- ✅ View analytics
- ✅ Manage certifications

### Finance Account
```
Email: finance@pvara.com
Password: Finance@123
Role: FINANCE
Department: Finance
```

**Permissions:**
- ✅ View payroll
- ✅ Manage payroll
- ✅ View expenses
- ✅ Generate reports
- ✅ Approve expenses

### Employee Account
```
Email: employee@pvara.com
Password: Employee@123
Role: EMPLOYEE
Department: Technology
```

**Permissions:**
- ✅ View own profile
- ✅ Apply for leave
- ✅ View own payslips
- ✅ View courses
- ✅ Enroll in learning

---

## 🔒 Password Requirements

All passwords must contain:
- ✓ At least 8 characters
- ✓ At least 1 uppercase letter (A-Z)
- ✓ At least 1 lowercase letter (a-z)
- ✓ At least 1 number (0-9)
- ✓ At least 1 special character (@, #, $, %, !, etc.)

**Format:** `Pattern@123`

---

## 🚀 How to Test

### Option 1: Frontend Only (Current Setup)
1. Go to http://localhost:5173 (Vite dev server)
2. Use any email from credentials above
3. Password validation will pass for demo accounts
4. App will load with mock data and simulated API responses

### Option 2: With Backend (After API Setup)
1. Start backend: `npm run backend:dev` (from project root)
2. Start frontend: `npm run dev`
3. Use credentials above for backend login
4. Real data will flow from MongoDB

---

## 📋 Test Scenarios

### Scenario 1: HR Manager Testing Leave Approvals
```
Email: demo@pvara.com
Password: demo123
Steps:
1. Login → Dashboard
2. Click "Pending Approvals" card
3. Test approve/reject leave requests
4. Verify notifications work
5. Check data updates in table
```

### Scenario 2: Admin Testing System Settings
```
Email: admin@pvara.com
Password: Admin@123
Steps:
1. Login → Settings
2. Test position management
3. Test company settings
4. Verify permission controls
```

### Scenario 3: Employee Testing Leave Request
```
Email: employee@pvara.com
Password: Employee@123
Steps:
1. Login → Leave Management
2. Click "Request Leave"
3. Fill form (dates, reason)
4. Submit and verify success message
5. Check pending approvals
```

### Scenario 4: Finance Testing Payroll
```
Email: finance@pvara.com
Password: Finance@123
Steps:
1. Login → Payroll
2. Click "Generate Payroll"
3. Select month/year
4. Verify calculations
5. Check generated payslips
```

### Scenario 5: Manager Testing Recruitment
```
Email: manager@pvara.com
Password: Manager@123
Steps:
1. Login → Recruitment
2. Click "Post Job"
3. Fill job details
4. Verify applicant list
5. Test application status updates
```

---

## 🔄 Mock Data Details

When using frontend-only mode (without backend):

### Mock Employees
- John Doe (EMP001) - Senior Software Engineer
- Jane Smith (EMP002) - HR Manager
- Bob Johnson (EMP003) - Financial Analyst
- Sarah Williams (EMP004) - Project Manager
- Michael Brown (EMP005) - UX Designer

### Mock Leave Requests
- 5 pending approvals
- 10 approved leaves
- 3 rejected leaves
- Various types: Annual, Sick, Personal, Casual

### Mock Payroll
- Monthly payroll for all departments
- Salary breakdowns with deductions
- Benefits summaries
- Historical payslips

### Mock Attendance
- Weekly attendance records
- Status options: Present, Absent, Late, Work From Home
- Check-in/check-out times
- Department-wise statistics

---

## 🛠️ Troubleshooting

### Issue: Login says "Invalid email"
**Solution:** Use one of the provided email addresses exactly as shown

### Issue: Password validation fails
**Solution:** 
- Demo: Use `demo123` (exception for demo)
- Others: Use format like `Admin@123` (min 8 chars, 1 upper, 1 lower, 1 number, 1 special)

### Issue: Login hangs or takes long time
**Solution:** 
- Check if backend is running: `npm run backend:dev`
- Check MongoDB: `mongod --dbpath /opt/homebrew/var/mongodb`
- Check browser console for errors

### Issue: Mock data not loading
**Solution:**
- Clear browser cache/localStorage
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Check network tab in DevTools

---

## 📊 Feature Availability by Role

| Feature | Admin | HR Manager | Manager | Finance | Employee |
|---------|-------|-----------|---------|---------|----------|
| View Employees | ✅ | ✅ | ✅ | ✅ | ❌ |
| Manage Employees | ✅ | ✅ | ❌ | ❌ | ❌ |
| Approve Leave | ✅ | ✅ | ✅ | ❌ | ❌ |
| View Payroll | ✅ | ✅ | ❌ | ✅ | ❌ |
| Manage Payroll | ✅ | ✅ | ❌ | ✅ | ❌ |
| View Own Payslips | ✅ | ✅ | ✅ | ✅ | ✅ |
| Request Leave | ✅ | ✅ | ✅ | ✅ | ✅ |
| View Attendance | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manage Recruitment | ✅ | ✅ | ✅ | ❌ | ❌ |
| View Analytics | ✅ | ✅ | ❌ | ✅ | ❌ |
| System Settings | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 🎯 Quick Start

1. **Start Frontend:**
   ```bash
   cd /Users/ubl/pvara-hrms
   npm run dev
   ```

2. **Open Browser:**
   ```
   http://localhost:5173
   ```

3. **Login with Demo Account:**
   ```
   Email: demo@pvara.com
   Password: demo123
   ```

4. **Test Features:**
   - Dashboard: View metrics and quick actions
   - Employees: Search and filter employees
   - Leave Management: Request and approve leaves
   - Payroll: Generate and view payroll
   - Performance: Create appraisals
   - Recruitment: Post jobs and manage applications
   - Compliance: Track audits and violations
   - Analytics: View HR metrics and trends
   - Learning: Enroll in courses
   - Attendance: Mark and track attendance
   - Settings: Manage positions and company info

---

## 📞 Support

If you encounter any issues with credentials or authentication:

1. Check `/src/store/authStore.js` for login logic
2. Verify `/src/pages/Login.jsx` for form validation
3. Check browser DevTools → Console for errors
4. Clear localStorage: `localStorage.clear()` in console
5. Restart dev server: `npm run dev`

---

**Status:** ✅ Ready for Testing
**Last Updated:** December 9, 2025
**Next Step:** Start frontend and login with any credential above!
