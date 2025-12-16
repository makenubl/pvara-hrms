import mongoose from 'mongoose';
import Department from '../models/Department.js';
import User from '../models/User.js';
import Company from '../models/Company.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pvara-hrms';

async function seedPVARADepartments() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Get PVARA company
    const company = await Company.findOne({ name: 'PVARA' });
    if (!company) {
      console.error('❌ PVARA company not found');
      await mongoose.connection.close();
      return;
    }

    console.log('✅ Found PVARA company:', company.name);

    // Get all employees to extract departments
    const employees = await User.find({ company: company._id }).select('department designation');
    
    // Extract unique departments from employees
    const departmentMap = new Map();
    
    employees.forEach(emp => {
      if (emp.department) {
        if (!departmentMap.has(emp.department)) {
          departmentMap.set(emp.department, []);
        }
        departmentMap.get(emp.department).push(emp);
      }
    });

    console.log(`\n📊 Found ${departmentMap.size} unique departments from employees\n`);

    // Define PVARA departments with descriptions
    const pvaraDepartments = [
      {
        name: 'Administration',
        description: 'Executive administration and secretariat services',
      },
      {
        name: 'Legal & Compliance',
        description: 'Legal affairs and regulatory compliance',
      },
      {
        name: 'Finance & Accounts',
        description: 'Financial management and accounting',
      },
      {
        name: 'Information Technology',
        description: 'IT infrastructure and digital services',
      },
      {
        name: 'Securities & Regulation',
        description: 'Securities regulation and market oversight',
      },
      {
        name: 'Banking & Financial Services',
        description: 'Banking sector regulation and oversight',
      },
      {
        name: 'Public Procurement',
        description: 'Public procurement regulation and oversight',
      },
      {
        name: 'Protocol & Support Services',
        description: 'Protocol services and administrative support',
      },
    ];

    // Clear existing departments
    await Department.deleteMany({ company: company._id });
    console.log('🗑️  Cleared existing departments\n');

    // Create departments
    const createdDepartments = [];
    
    for (const dept of pvaraDepartments) {
      // Count employees in this department (approximate matching)
      const employeeCount = await User.countDocuments({ 
        company: company._id,
        $or: [
          { department: dept.name },
          { department: { $regex: dept.name, $options: 'i' } }
        ]
      });

      const department = new Department({
        name: dept.name,
        description: dept.description,
        company: company._id,
        employeeCount,
        status: 'active',
      });

      await department.save();
      createdDepartments.push(department);

      console.log(`✅ Created: ${dept.name}`);
      console.log(`   Description: ${dept.description}`);
      console.log(`   Employees: ${employeeCount}`);
      console.log('');
    }

    // Also create departments for any employee departments not covered above
    const existingDeptNames = pvaraDepartments.map(d => d.name.toLowerCase());
    
    for (const [deptName, emps] of departmentMap.entries()) {
      const normalizedName = deptName.toLowerCase();
      const alreadyExists = existingDeptNames.some(name => 
        normalizedName.includes(name.toLowerCase()) || name.toLowerCase().includes(normalizedName)
      );

      if (!alreadyExists) {
        const department = new Department({
          name: deptName,
          description: `${deptName} department`,
          company: company._id,
          employeeCount: emps.length,
          status: 'active',
        });

        await department.save();
        createdDepartments.push(department);

        console.log(`✅ Created from employees: ${deptName}`);
        console.log(`   Employees: ${emps.length}`);
        console.log('');
      }
    }

    console.log(`\n=== SUMMARY ===`);
    console.log(`Total Departments Created: ${createdDepartments.length}`);
    console.log(`Company: ${company.name}`);
    console.log(`\nAll departments are now available in Settings → Organization`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seedPVARADepartments();
