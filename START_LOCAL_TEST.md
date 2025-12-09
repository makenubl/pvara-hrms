# 🚀 Local Testing Guide - PVARA HRMS

## Prerequisites
✅ Node.js installed (v18+)
✅ MongoDB Atlas connection (already configured in backend/.env)
✅ Both frontend and backend dependencies installed

---

## Step 1: Start Backend Server

Open **Terminal 1** and run:

```bash
cd /Users/ubl/pvara-hrms/backend
npm run dev
```

**Expected Output:**
```
Server running on port 5000
MongoDB Connected: cluster1.k7gthsl.mongodb.net
Dev data seeded successfully
```

**If you see errors:**
- Check MongoDB Atlas connection is working
- Ensure port 5000 is not in use: `lsof -ti:5000 | xargs kill -9`

---

## Step 2: Start Frontend (Vite)

Open **Terminal 2** and run:

```bash
cd /Users/ubl/pvara-hrms
npm run dev
```

**Expected Output:**
```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Open Browser:** http://localhost:5173

---

## Step 3: Login

Use test credentials:
- **Email:** `admin@pvara.com`
- **Password:** `admin123`

---

## 🧪 Test Checklist: Position Management System

### Test 1: Create Top-Level Position (CEO)
1. Navigate to **Settings** → **Hierarchy** tab
2. Click **"Add Position"** button
3. Fill in the form:
   - **Title:** `Chief Executive Officer`
   - **Department:** `Executive`
   - ✅ **Check:** "Top-Level Position (CEO, Chairman, etc.)"
   - **Gross Salary:** `200000` (required for top-level)
   - **Level:** `Executive`
   - **Description:** `Leads the entire organization`
   - **Benefits:** `Stock Options, Executive Car, Premium Health Insurance`
   - **Responsibilities:** `Strategic planning, Board reporting, Company direction`
   - **Requirements:** `MBA, 15+ years executive experience`
4. Click **"Create Position"**

**✅ Expected Results:**
- Position created successfully
- Position ID auto-generated: `POS-0001`
- "Top Level" purple badge visible
- Employee count shows: 0
- Gross salary displays: $200,000

---

### Test 2: Create Subordinate Position (Engineering Manager)
1. Click **"Add Position"** again
2. Fill in:
   - **Title:** `Engineering Manager`
   - **Department:** `Engineering`
   - **Reports To:** Select `Chief Executive Officer - Executive`
   - **Level:** `Senior`
   - **Salary Range Min:** `80000`
   - **Salary Range Max:** `120000`
   - **Description:** `Manages engineering team and projects`
   - **Responsibilities:** `Team management, Code reviews, Sprint planning, Technical decisions`
   - **Requirements:** `Bachelor's in CS, 5+ years engineering, 2+ years management`
3. Click **"Create Position"**

**✅ Expected Results:**
- Position created: `POS-0002`
- Shows "Reports to: Chief Executive Officer"
- Displays salary range: $80,000 - $120,000
- Employee count: 0
- Blue level badge shows "senior"

---

### Test 3: Create Another Position (Senior Developer)
1. Add Position:
   - **Title:** `Senior Software Developer`
   - **Department:** `Engineering`
   - **Reports To:** `Engineering Manager`
   - **Level:** `Senior`
   - **Salary Range:** `70000` - `90000`
2. Create

**✅ Expected Results:**
- Position ID: `POS-0003`
- Reports to Engineering Manager
- Hierarchical structure visible in tree view

---

### Test 4: View Organization Hierarchy
1. Stay on Settings → Hierarchy tab
2. Check the **Position Summary Cards** at bottom:
   - **Total Positions:** Should show 3
   - **Filled:** 0 (no employees yet)
   - **Open:** 3

3. **Verify Position Tree Display:**
   - CEO at top level
   - Engineering Manager indented under CEO
   - Senior Developer indented under Engineering Manager
   - All show Position IDs, levels, salary info

---

### Test 5: Add Employee to Position
1. Navigate to **Employees** page
2. Click **"Add Employee"** button
3. Fill form:
   - **First Name:** `John`
   - **Last Name:** `Doe`
   - **Email:** `john.doe@test.com`
   - **Password:** `Welcome123` (min 6 chars)
   - **Phone:** `+1 555 123 4567`
   - **Position:** Select `Engineering Manager - Engineering (POS-0002)`
4. **Notice auto-fill:**
   - Department auto-fills to "Engineering"
   - Salary may auto-fill (optional)
5. **Joining Date:** Select today's date
6. Click **"Add Employee"**

**✅ Expected Results:**
- Employee created successfully
- Employee appears in table with position info
- Toast notification: "Employee added successfully!"

---

### Test 6: Verify Employee Count Updated
1. Go back to **Settings** → **Hierarchy**
2. Find "Engineering Manager" position

**✅ Expected Results:**
- Employee count badge now shows: **1 employee**
- Position summary "Filled Positions" increments to 1
- "Open Positions" decrements to 2

---

### Test 7: Add Another Employee
1. **Employees** → **Add Employee**
2. Fill:
   - **Name:** `Jane Smith`
   - **Email:** `jane.smith@test.com`
   - **Password:** `Welcome123`
   - **Position:** `Senior Software Developer - Engineering (POS-0003)`
3. Submit

**✅ Verify:**
- Senior Developer position now shows 1 employee
- Total filled positions: 2

---

### Test 8: Test Position Validation

#### Test 8a: Top-Level Without Gross Salary
1. Add Position
2. Fill:
   - Title: `Chairman`
   - Department: `Executive`
   - ✅ Check "Top-Level Position"
   - **DON'T** enter Gross Salary
3. Try to create

**✅ Expected:** Error: "Gross salary is required for top-level positions (CEO, Chairman, etc.)"

#### Test 8b: Invalid Salary Range
1. Add Position
2. Enter:
   - Salary Min: `100000`
   - Salary Max: `50000` (less than min)
3. Try to create

**✅ Expected:** Error: "Minimum salary cannot be greater than maximum salary"

#### Test 8c: Missing Required Fields
1. Try to create position without Title or Department

**✅ Expected:** Browser validation: "Please fill out this field"

---

### Test 9: Delete Employee (Verify Count Decrements)
1. **Employees** page
2. Find John Doe
3. Click delete (trash icon)
4. Confirm deletion

**✅ Verify:**
- Employee removed from list
- Go to Settings → Hierarchy
- Engineering Manager position count decremented to: **0 employees**

---

### Test 10: Position Dropdown in Employee Form
1. **Employees** → **Add Employee**
2. Check Position dropdown

**✅ Verify:**
- Shows all 3 positions with format: `Title - Department (ID)`
- Example: `Chief Executive Officer - Executive (POS-0001)`
- Positions are selectable

---

### Test 11: Form Styling Check
**Verify Add Employee Modal:**
- ✅ Labels are light gray (`text-slate-300`) - readable
- ✅ Input backgrounds are dark with transparency (`bg-white/10`)
- ✅ Input text is white - readable
- ✅ Placeholder text is gray - readable
- ✅ Focus ring is cyan blue
- ✅ NO white text on white background

**Compare with Settings → Add Position modal** - should match styling

---

### Test 12: Position Edit/Delete
1. Settings → Hierarchy
2. Find a position
3. Click **Edit** button (pencil icon)

**Note:** Edit functionality coming soon

4. Click **Delete** button (trash icon)
5. Confirm

**✅ Verify:** 
- Position deleted
- If position had employees, test that deletion is prevented or counts updated

---

## 🐛 Common Issues & Solutions

### Issue: Backend won't start
**Error:** `EADDRINUSE: address already in use :::5000`
**Solution:** Kill process on port 5000:
```bash
lsof -ti:5000 | xargs kill -9
```

### Issue: MongoDB connection failed
**Error:** `MongooseServerSelectionError`
**Solution:** 
- Check internet connection
- Verify MongoDB Atlas credentials in `backend/.env`
- Check if IP is whitelisted in MongoDB Atlas

### Issue: Frontend can't connect to backend
**Error:** `Network Error` or CORS errors
**Solution:**
- Ensure backend is running on port 5000
- Check `.env` has `VITE_API_URL=http://localhost:5000/api`
- Clear browser cache and reload

### Issue: "Position not found" when adding employee
**Solution:** Create positions first in Settings → Hierarchy

### Issue: White text on white background
**Solution:** Already fixed! Forms now use dark theme. If still visible, hard refresh: `Cmd+Shift+R`

---

## 📊 Success Criteria

After completing all tests, you should have:

✅ 3 positions created with auto-generated IDs (POS-0001, POS-0002, POS-0003)
✅ Hierarchical structure visible in tree view
✅ At least 1 employee assigned to a position
✅ Employee count automatically updated
✅ All form validations working
✅ Form styling is dark theme (readable white text)
✅ Position data persisted in MongoDB Atlas
✅ No console errors

---

## 🎯 Quick Commands Reference

**Start Backend:**
```bash
cd backend && npm run dev
```

**Start Frontend:**
```bash
npm run dev
```

**View Backend Logs:**
Backend terminal shows all API requests and MongoDB queries

**Check MongoDB Data:**
- Login to MongoDB Atlas
- Browse Collections → `positions` and `users`

---

## 📝 Notes

- **Backend uses MongoDB Atlas** - data persists across restarts
- **Frontend uses Vite** - fast HMR (Hot Module Replacement)
- **Auto-seeding:** Backend seeds test data on first run
- **Test credentials:** admin@pvara.com / admin123

---

**Ready to test!** 🚀

Open two terminals and follow Step 1 & Step 2 above.
