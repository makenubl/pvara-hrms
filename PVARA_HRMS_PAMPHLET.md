# 🚀 PVARA HRMS

## Complete Human Resource Management System

---

<div align="center">

### **Streamline Your HR Operations**
### **Built for Pakistani Businesses**

---

</div>

## 📋 What is PVARA HRMS?

PVARA HRMS is a modern, cloud-ready Human Resource Management System designed specifically for Pakistani businesses. It provides a comprehensive suite of tools to manage your entire employee lifecycle — from recruitment to retirement.

---

## ✨ Key Features

### 👥 **Employee Management**
- Complete employee profiles with contact info, documents, and history
- Department and position hierarchies
- Reporting structure management
- Employee status tracking (active, on leave, suspended)

### 💰 **Payroll Processing (PKR)**
- Monthly salary calculations in Pakistani Rupees
- Allowances, deductions, and bonuses
- Payslip generation
- CSV upload for bulk payroll updates
- Tax calculations and compliance

### 📅 **Leave Management**
- Multiple leave types (Annual, Sick, Casual, Maternity, etc.)
- Leave balance tracking
- Request and approval workflows
- Leave calendar integration

### ⏰ **Attendance Tracking**
- Daily attendance records
- Check-in/check-out times
- Late arrival and early departure tracking
- Monthly attendance reports

### 📊 **Performance Management**
- Goal setting and tracking
- Performance appraisals
- 360° feedback support
- Performance ratings and reviews

### 🎓 **Learning & Development**
- Training course management
- Employee skill tracking
- Certification management
- Learning progress monitoring

### 📢 **Recruitment**
- Job posting and management
- Applicant tracking
- Interview scheduling
- Hiring pipeline visualization

### ✅ **Approval Workflows**
- Multi-level approval chains
- Leave request approvals
- Expense approvals
- Document approvals

### 🔒 **Compliance & Security**
- Role-based access control (Admin, HR, Manager, Employee)
- Audit trails
- Policy management
- Document storage

### 📈 **Analytics & Reporting**
- Dashboard with key HR metrics
- Custom reports
- Data visualization
- Export capabilities

---

## 🏗️ Technical Architecture

| Component | Technology |
|-----------|------------|
| **Frontend** | React 19 + Vite |
| **Styling** | Tailwind CSS |
| **Backend** | Node.js + Express |
| **Database** | MongoDB |
| **Authentication** | JWT Tokens |
| **Deployment** | Vercel (Frontend + Backend) |

---

## 🎨 Modern UI/UX

- **Dark theme** with gradient accents
- **Responsive design** for desktop and mobile
- **Intuitive navigation** with sidebar menu
- **Real-time updates** and notifications
- **Glass-morphism** design elements

---

## 👤 User Roles

| Role | Permissions |
|------|-------------|
| **Admin** | Full system access, company settings, user management |
| **HR** | Employee management, payroll, recruitment, reports |
| **Manager** | Team management, approvals, performance reviews |
| **Employee** | Self-service portal, leave requests, profile updates |

---

## 📱 Core Modules

```
┌─────────────────────────────────────────────────────────────┐
│                        PVARA HRMS                           │
├─────────────┬─────────────┬─────────────┬─────────────────┤
│  Dashboard  │  Employees  │   Payroll   │  Leave Mgmt     │
├─────────────┼─────────────┼─────────────┼─────────────────┤
│ Attendance  │ Performance │ Recruitment │  Learning       │
├─────────────┼─────────────┼─────────────┼─────────────────┤
│ Compliance  │  Analytics  │  Settings   │  Integrations   │
└─────────────┴─────────────┴─────────────┴─────────────────┘
```

---

## 💡 Why Choose PVARA HRMS?

| Feature | Benefit |
|---------|---------|
| **PKR Currency** | Native support for Pakistani Rupees |
| **Cloud-Ready** | Deploy anywhere — Vercel, AWS, or on-premise |
| **Scalable** | Grows with your business |
| **Secure** | JWT authentication, role-based access |
| **Modern Stack** | React 19, Node.js, MongoDB |
| **API-First** | RESTful API for integrations |
| **Real-Time** | Live updates and notifications |

---

## 🚀 Quick Start

### For Developers

```bash
# Clone repository
git clone https://github.com/makenubl/pvara-hrms-prod.git

# Install dependencies
cd pvara-hrms-prod
npm install
cd backend && npm install

# Start MongoDB
mongod --dbpath ~/mongodb/data/db

# Start backend (Terminal 1)
cd backend
MONGODB_URI="mongodb://127.0.0.1:27017/pvara-hrms" PORT=5001 npm start

# Start frontend (Terminal 2)
cd pvara-hrms-prod
VITE_API_URL=http://localhost:5001 npm run dev

# Open browser
open http://localhost:5173
```

### For Production (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables:
   - `MONGODB_URI` — MongoDB Atlas connection string
   - `JWT_SECRET` — Secure secret key
   - `VITE_API_URL` — Backend URL
4. Deploy!

---

## 📊 Dashboard Preview

```
┌──────────────────────────────────────────────────────────────┐
│  📊 PVARA HRMS Dashboard                                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ 👥 150   │  │ ✅ 142   │  │ 📅 8     │  │ 💰 2.5M  │    │
│  │ Total    │  │ Present  │  │ On Leave │  │ Payroll  │    │
│  │ Employees│  │ Today    │  │ Today    │  │ (PKR)    │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
│                                                              │
│  ┌─────────────────────────┐  ┌─────────────────────────┐  │
│  │ 📈 Attendance Trend     │  │ 🔔 Pending Approvals    │  │
│  │    ▁▂▄▅▆▇█▇▆▅▄         │  │  • Leave: 5 pending     │  │
│  │    Mon-Fri this week    │  │  • Expenses: 3 pending  │  │
│  └─────────────────────────┘  └─────────────────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing (bcrypt)
- ✅ Role-based access control
- ✅ API rate limiting
- ✅ CORS protection
- ✅ Input validation
- ✅ Secure HTTP headers

---

## 📞 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register company + admin |
| `/api/auth/login` | POST | User login |
| `/api/auth/me` | GET | Get current user |
| `/api/employees` | GET/POST | List/Create employees |
| `/api/employees/:id` | GET/PUT/DELETE | Employee CRUD |
| `/api/payrolls` | GET/POST | Payroll management |
| `/api/positions` | GET/POST | Position management |
| `/api/approvals` | GET/POST | Approval workflows |

---

## 🌐 Deployment

### Live URLs

| Environment | URL |
|-------------|-----|
| **Production** | https://pvara-hrms-prod.vercel.app |
| **API** | https://pvara-hrms-prod.vercel.app/api |

---

## 📁 Project Structure

```
pvara-hrms-prod/
├── src/                    # Frontend React app
│   ├── components/         # Reusable UI components
│   ├── layouts/            # Header, Sidebar, MainLayout
│   ├── pages/              # Dashboard, Employees, Payroll, etc.
│   ├── services/           # API client and services
│   ├── store/              # State management (Zustand)
│   └── utils/              # Helpers, formatters, validators
├── backend/                # Express.js API server
│   ├── config/             # Database configuration
│   ├── middleware/         # Auth middleware
│   ├── models/             # Mongoose schemas
│   └── routes/             # API route handlers
├── public/                 # Static assets
└── dist/                   # Production build
```

---

## 📧 Contact

**PVARA HRMS** — Built for Pakistani Businesses

- 🌐 Website: https://pvara-hrms-prod.vercel.app
- 📧 Email: support@pvara.com
- 🏢 GitHub: github.com/makenubl/pvara-hrms-prod

---

<div align="center">

### **Empowering HR Teams Across Pakistan**

*Modern • Secure • Scalable*

**© 2025 PVARA HRMS. All rights reserved.**

</div>
