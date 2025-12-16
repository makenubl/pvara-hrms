import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { Card, Button, Badge } from '../components/UI';
import { useAuthStore } from '../store/authStore';
import employeeService from '../services/employeeService';
import api from '../services/api';
import { format } from 'date-fns';
import {
  Building2,
  Users,
  Rocket,
  CheckCircle2,
} from 'lucide-react';

const ChairmanOverview = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [hierarchy, setHierarchy] = useState([]);
  const [date, setDate] = useState(new Date());
  const [projectFilter, setProjectFilter] = useState('all');
  const [projectSort, setProjectSort] = useState('progress');
  const [selectedProject, setSelectedProject] = useState(null);
  const [taskFilter, setTaskFilter] = useState('all');
  const [taskSort, setTaskSort] = useState('deadline');

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [emps, posHierarchy] = await Promise.all([
          employeeService.getAll(),
          api.get('/positions/hierarchy').then(r => r.data),
        ]);
        setEmployees(emps || []);
        setHierarchy(posHierarchy || []);
      } catch (err) {
        console.error('ChairmanOverview: data load error', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ===== PROJECTS DATA =====
  const projects = [
    {
      id: 1,
      name: 'Crypto Asset Compliance Framework',
      owner: 'Compliance & Policy Division',
      startDate: '2025-10-01',
      endDate: '2026-06-30',
      progress: 72,
      status: 'on-track',
      budget: { allocated: 2500000, spent: 1800000 },
      team: 12,
      blockers: 0,
      description: 'Develop comprehensive regulatory framework for virtual asset exchanges and custodians.'
    },
    {
      id: 2,
      name: 'Industry Stakeholder Engagement Program',
      owner: 'Strategic Partnerships',
      startDate: '2025-11-15',
      endDate: '2026-03-31',
      progress: 45,
      status: 'on-track',
      budget: { allocated: 800000, spent: 360000 },
      team: 8,
      blockers: 1,
      description: 'Conduct industry consultations and establish feedback channels.'
    },
    {
      id: 3,
      name: 'Enforcement & Investigations Infrastructure',
      owner: 'Enforcement & Vigilance',
      startDate: '2025-09-01',
      endDate: '2026-02-28',
      progress: 88,
      status: 'on-track',
      budget: { allocated: 1200000, spent: 1056000 },
      team: 7,
      blockers: 0,
      description: 'Deploy investigation tools and case management system.'
    },
    {
      id: 4,
      name: 'Policy Development & Guidelines v2.0',
      owner: 'Policy & Rules Division',
      startDate: '2025-12-01',
      endDate: '2026-04-30',
      progress: 38,
      status: 'at-risk',
      budget: { allocated: 600000, spent: 228000 },
      team: 6,
      blockers: 2,
      description: 'Finalize updated policy guidelines based on stakeholder feedback.'
    },
    {
      id: 5,
      name: 'Technology & Data Infrastructure Upgrade',
      owner: 'IT & Systems',
      startDate: '2025-11-01',
      endDate: '2026-05-31',
      progress: 61,
      status: 'on-track',
      budget: { allocated: 1800000, spent: 1098000 },
      team: 9,
      blockers: 1,
      description: 'Upgrade monitoring systems and implement blockchain tracking.'
    },
  ];

  // ===== TASK ASSIGNMENTS DATA (by seniority) =====
  const projectTaskAssignments = [
    // 1. Overall Supervision - Joint Secretary (Highest rank)
    {
      id: 1,
      employeeName: 'Mr. Adnan Nazir',
      designation: 'Joint Secretary',
      department: 'Overall Supervision',
      projectId: 5,
      projectName: 'Technology & Data Infrastructure Upgrade',
      task: 'Supervise operational matters and admin setup',
      deadline: '2026-02-28',
      status: 'in-progress',
      progress: 65,
      capacity: 85,
      priority: 'critical'
    },

    // 2. Chairperson Office - Director Level
    {
      id: 2,
      employeeName: 'Mr. Sadaqat Ali',
      designation: 'Director to Chairperson PVARA',
      department: 'Chairperson Office',
      projectId: 4,
      projectName: 'Policy Development & Guidelines v2.0',
      task: 'Coordinate chairman engagements for policy consultations',
      deadline: '2025-12-30',
      status: 'in-progress',
      progress: 70,
      capacity: 80,
      priority: 'high'
    },

    // 3. Team Law - SSP, Director FIA (Chief Staff Officer)
    {
      id: 3,
      employeeName: 'Ms. Sumera Azam',
      designation: 'SSP, Director FIA',
      department: 'Team Law, Rules, Interagency Coordination',
      projectId: 4,
      projectName: 'Policy Development & Guidelines v2.0',
      task: 'Finalize PVARA law, rules and operationalize complaint cell',
      deadline: '2026-03-31',
      status: 'in-progress',
      progress: 38,
      capacity: 92,
      priority: 'critical'
    },

    // 4. Admin & HR - Deputy Secretary
    {
      id: 4,
      employeeName: 'Mr. Faisal Idrees',
      designation: 'Deputy Secretary (DS)',
      department: 'Admin & HR',
      projectId: 4,
      projectName: 'Policy Development & Guidelines v2.0',
      task: 'Handle assembly questions and PM Portal matters',
      deadline: '2026-01-20',
      status: 'in-progress',
      progress: 60,
      capacity: 80,
      priority: 'high'
    },

    // 5. Team Law - Deputy Secretary
    {
      id: 5,
      employeeName: 'Mr. Salman Yousafi',
      designation: 'Deputy Secretary',
      department: 'Team Law, Rules, Interagency Coordination',
      projectId: 2,
      projectName: 'Industry Stakeholder Engagement Program',
      task: 'Manage interagency and international coordination, MOUs',
      deadline: '2026-02-28',
      status: 'in-progress',
      progress: 45,
      capacity: 85,
      priority: 'high'
    },

    // 6. Team Licensing - Additional Director SECP
    {
      id: 6,
      employeeName: 'Ms. Najia Obaid',
      designation: 'Additional Director SECP',
      department: 'Team Licensing and Regulation',
      projectId: 1,
      projectName: 'Crypto Asset Compliance Framework',
      task: 'Develop regulatory framework for VASPs and sandbox',
      deadline: '2026-04-30',
      status: 'in-progress',
      progress: 72,
      capacity: 95,
      priority: 'critical'
    },

    // 7. Procurement - Deputy Director PPRA
    {
      id: 7,
      employeeName: 'Mr. Muhammad Khurshid',
      designation: 'Deputy Director PPRA',
      department: 'Procurement and Accounts',
      projectId: 5,
      projectName: 'Technology & Data Infrastructure Upgrade',
      task: 'Manage procurement for IT infrastructure',
      deadline: '2026-02-15',
      status: 'in-progress',
      progress: 55,
      capacity: 85,
      priority: 'high'
    },

    // 8. Team Licensing - Additional Joint Director SECP
    {
      id: 8,
      employeeName: 'Mr. Amjad Iqbal Rao',
      designation: 'Additional Joint Director SECP',
      department: 'Team Licensing and Regulation',
      projectId: 1,
      projectName: 'Crypto Asset Compliance Framework',
      task: 'Support VASP licensing and registration framework',
      deadline: '2026-04-15',
      status: 'in-progress',
      progress: 70,
      capacity: 85,
      priority: 'high'
    },

    // 9. Team Licensing - Additional Joint Director
    {
      id: 9,
      employeeName: 'Mr. Umair Ahmad',
      designation: 'Additional Joint Director',
      department: 'Team Licensing and Regulation',
      projectId: 1,
      projectName: 'Crypto Asset Compliance Framework',
      task: 'Develop KYC/CDD and AML/CFT controls',
      deadline: '2026-03-31',
      status: 'in-progress',
      progress: 75,
      capacity: 88,
      priority: 'critical'
    },

    // 10. Team Licensing - Deputy Director SBP
    {
      id: 10,
      employeeName: 'Mr. Muhammad Babar',
      designation: 'Deputy Director, SBP',
      department: 'Team Licensing and Regulation',
      projectId: 1,
      projectName: 'Crypto Asset Compliance Framework',
      task: 'Financial institution coordination for VASP oversight',
      deadline: '2026-05-15',
      status: 'in-progress',
      progress: 65,
      capacity: 80,
      priority: 'high'
    },

    // 11. Team Licensing - Deputy Director SBP
    {
      id: 11,
      employeeName: 'Mr. Zaid Ahmed',
      designation: 'Deputy Director, SBP',
      department: 'Team Licensing and Regulation',
      projectId: 1,
      projectName: 'Crypto Asset Compliance Framework',
      task: 'Risk assessment and cyber security measures',
      deadline: '2026-05-30',
      status: 'in-progress',
      progress: 60,
      capacity: 82,
      priority: 'high'
    },

    // 12. Accounts - Assistant Accountant General
    {
      id: 12,
      employeeName: 'Mr. Zain Imtiaz Saeed',
      designation: 'Assistant Accountant General',
      department: 'Procurement and Accounts',
      projectId: 4,
      projectName: 'Policy Development & Guidelines v2.0',
      task: 'Assist in law, rules, regulations and budgets',
      deadline: '2026-01-31',
      status: 'in-progress',
      progress: 68,
      capacity: 80,
      priority: 'high'
    },

    // 13. Admin & HR - Assistant Engineer
    {
      id: 13,
      employeeName: 'Mr. Ijaz Akbar',
      designation: 'Assistant Engineer',
      department: 'Admin & HR',
      projectId: 5,
      projectName: 'Technology & Data Infrastructure Upgrade',
      task: 'Manage employee records and HR matters',
      deadline: '2026-01-15',
      status: 'in-progress',
      progress: 70,
      capacity: 75,
      priority: 'medium'
    },

    // 14. Team Licensing - Vice President Bank Alfalah
    {
      id: 14,
      employeeName: 'Mr. Sheraz Hussain',
      designation: 'Vice President Bank Alfalah',
      department: 'Team Licensing and Regulation',
      projectId: 1,
      projectName: 'Crypto Asset Compliance Framework',
      task: 'Banking sector integration for crypto compliance',
      deadline: '2026-06-15',
      status: 'in-progress',
      progress: 58,
      capacity: 75,
      priority: 'medium'
    },

    // 15. IT - Software Engineer
    {
      id: 15,
      employeeName: 'Mr. Khurram Bashir',
      designation: 'Software Engineer, NITB',
      department: 'IT and Software Functions',
      projectId: 5,
      projectName: 'Technology & Data Infrastructure Upgrade',
      task: 'Implement blockchain tracking and IT systems',
      deadline: '2026-03-31',
      status: 'in-progress',
      progress: 61,
      capacity: 90,
      priority: 'critical'
    },

    // 16. Overall Supervision - PS to JS
    {
      id: 16,
      employeeName: 'Mr. Muhammad Riaz',
      designation: 'PS to JS PVARA',
      department: 'Overall Supervision',
      projectId: 5,
      projectName: 'Technology & Data Infrastructure Upgrade',
      task: 'Maintain JS office records and correspondence',
      deadline: '2026-01-31',
      status: 'in-progress',
      progress: 75,
      capacity: 65,
      priority: 'medium'
    },

    // 17. Accounts - Programmer
    {
      id: 17,
      employeeName: 'Mr. Ali Shan',
      designation: 'Programmer',
      department: 'Procurement and Accounts',
      projectId: 5,
      projectName: 'Technology & Data Infrastructure Upgrade',
      task: 'Manage accounts/DDO systems',
      deadline: '2026-02-28',
      status: 'in-progress',
      progress: 50,
      capacity: 70,
      priority: 'medium'
    },

    // 18. Chairperson Office - Protocol Officer
    {
      id: 18,
      employeeName: 'Mr. Qamar Iqbal',
      designation: 'Protocol Officer PVARA',
      department: 'Chairperson Office',
      projectId: 2,
      projectName: 'Industry Stakeholder Engagement Program',
      task: 'Manage protocol for stakeholder meetings',
      deadline: '2026-01-15',
      status: 'in-progress',
      progress: 85,
      capacity: 75,
      priority: 'medium'
    },

    // 19. Chairperson Office - PS to Chairperson
    {
      id: 19,
      employeeName: 'Mr. M. Umar',
      designation: 'PS to Chairperson PVARA',
      department: 'Chairperson Office',
      projectId: 4,
      projectName: 'Policy Development & Guidelines v2.0',
      task: 'Draft official letters & maintain records',
      deadline: '2025-12-28',
      status: 'in-progress',
      progress: 90,
      capacity: 70,
      priority: 'medium'
    },
  ];

  // ===== CALCULATIONS =====
  const projectHealth = {
    total: projects.length,
    onTrack: projects.filter(p => p.status === 'on-track').length,
    atRisk: projects.filter(p => p.status === 'at-risk').length,
    completed: 0,
  };
  const avgProgress = Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length);
  const totalBudgetAllocated = projects.reduce((sum, p) => sum + p.budget.allocated, 0);
  const totalBudgetSpent = projects.reduce((sum, p) => sum + p.budget.spent, 0);
  const budgetUtilization = Math.round((totalBudgetSpent / totalBudgetAllocated) * 100);

  // ===== FILTER & SORT =====
  const filteredProjects = projects.filter(p => {
    if (projectFilter === 'all') return true;
    if (projectFilter === 'on-track') return p.status === 'on-track';
    if (projectFilter === 'at-risk') return p.status === 'at-risk';
    return true;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (projectSort === 'progress') return b.progress - a.progress;
    if (projectSort === 'deadline') return new Date(a.endDate) - new Date(b.endDate);
    return 0;
  });

  const filteredTasks = projectTaskAssignments.filter(t => {
    if (taskFilter === 'all') return true;
    if (taskFilter === 'in-progress') return t.status === 'in-progress';
    if (taskFilter === 'completed') return t.status === 'completed';
    if (taskFilter === 'blocked') return t.status === 'blocked';
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (taskSort === 'deadline') return new Date(a.deadline) - new Date(b.deadline);
    if (taskSort === 'capacity') return b.capacity - a.capacity;
    return 0;
  });

  // ===== EMPLOYEE-LEVEL DATA =====
  const departments = Array.from(new Set(employees.map(e => e.department).filter(Boolean)));
  const deptSummary = departments.map(dept => {
    const deptEmps = employees.filter(e => e.department === dept);
    const active = deptEmps.filter(e => e.status === 'active').length;
    const onLeave = deptEmps.filter(e => e.status === 'on_leave').length;
    const suspended = deptEmps.filter(e => e.status === 'suspended').length;
    const healthScore = deptEmps.length > 0 ? Math.round((active / deptEmps.length) * 100) : 0;
    return {
      dept,
      employees: deptEmps.length,
      active,
      onLeave,
      suspended,
      healthScore,
      healthStatus: healthScore >= 90 ? 'excellent' : healthScore >= 70 ? 'good' : 'warning',
      avgSalary: deptEmps.reduce((sum, e) => sum + (e.salary || 0), 0) / Math.max(deptEmps.length, 1),
    };
  }).sort((a, b) => b.employees - a.employees);

  const needsSupport = employees
    .map(e => {
      const issues = [];
      if (e.status === 'suspended') issues.push('Suspended');
      if (!e.department) issues.push('No Department');
      if (!e.position) issues.push('No Position');
      return { e, issues, severity: issues.length };
    })
    .filter(x => x.severity > 0)
    .sort((a, b) => b.severity - a.severity)
    .slice(0, 8);

  return (
    <MainLayout>
      <div className="space-y-8 pb-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Executive Dashboard
            </h1>
            <p className="text-slate-400 mt-2">{format(date, 'EEEE, MMMM d, yyyy • h:mm:ss a')}</p>
          </div>
          <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
            <Rocket className="mr-2" size={18} />
            Export Report
          </Button>
        </div>

        {/* ===== LEVEL 1: PROJECTS & MILESTONES ===== */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Rocket size={28} className="text-cyan-400" /> Projects & Milestones
          </h2>

          {/* Project Health KPIs */}
          <Card className="backdrop-blur-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/30 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <p className="text-slate-400 text-sm">Total Projects</p>
                <p className="text-3xl font-black text-cyan-300 mt-1">{projectHealth.total}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">On Track</p>
                <p className="text-3xl font-bold text-emerald-300 mt-1">{projectHealth.onTrack}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">At Risk</p>
                <p className="text-3xl font-bold text-amber-300 mt-1">{projectHealth.atRisk}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Avg Progress</p>
                <p className="text-3xl font-bold text-blue-300 mt-1">{avgProgress}%</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Budget Utilization</p>
                <p className="text-3xl font-bold text-purple-300 mt-1">{budgetUtilization}%</p>
              </div>
            </div>
          </Card>

          {/* Project Filters */}
          <div className="flex flex-col md:flex-row gap-3 mb-6 items-start md:items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setProjectFilter('all')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  projectFilter === 'all'
                    ? 'bg-cyan-500 text-white'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                }`}
              >
                All ({projects.length})
              </button>
              <button
                onClick={() => setProjectFilter('on-track')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  projectFilter === 'on-track'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                }`}
              >
                On Track ({projectHealth.onTrack})
              </button>
              <button
                onClick={() => setProjectFilter('at-risk')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  projectFilter === 'at-risk'
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                }`}
              >
                At Risk ({projectHealth.atRisk})
              </button>
            </div>
            <select
              value={projectSort}
              onChange={(e) => setProjectSort(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-700/50 text-slate-300 text-sm border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="progress">Sort by Progress</option>
              <option value="deadline">Sort by Deadline</option>
            </select>
          </div>

          {/* Project Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {sortedProjects.map((p, idx) => (
              <Card
                key={idx}
                className={`backdrop-blur-xl border cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
                  p.status === 'on-track'
                    ? 'bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/40'
                    : 'bg-amber-500/10 border-amber-500/20 hover:border-amber-500/40'
                }`}
                onClick={() => setSelectedProject(p)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg">{p.name}</h3>
                    <p className="text-slate-400 text-xs mt-1">{p.owner}</p>
                    <p className="text-slate-500 text-sm mt-2 line-clamp-2">{p.description}</p>
                  </div>
                  <Badge variant={p.status === 'on-track' ? 'success' : 'warning'}>
                    {p.status === 'on-track' ? '✓ On Track' : '⚠ At Risk'}
                  </Badge>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-3 text-center text-xs">
                  <div>
                    <p className="text-slate-400">Progress</p>
                    <p className="text-cyan-300 font-bold">{p.progress}%</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Team</p>
                    <p className="text-blue-300 font-bold">{p.team}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Budget</p>
                    <p className="text-purple-300 font-bold">{Math.round((p.budget.spent / p.budget.allocated) * 100)}%</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Blockers</p>
                    <p className={`font-bold ${p.blockers > 0 ? 'text-red-300' : 'text-emerald-300'}`}>{p.blockers}</p>
                  </div>
                </div>

                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden mb-2">
                  <div
                    className={`h-full transition-all ${
                      p.status === 'on-track'
                        ? 'bg-gradient-to-r from-emerald-400 to-cyan-400'
                        : 'bg-gradient-to-r from-amber-400 to-orange-400'
                    }`}
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
                <p className="text-slate-400 text-xs">
                  📅 {format(new Date(p.startDate), 'MMM dd')} → {format(new Date(p.endDate), 'MMM dd')}
                </p>
              </Card>
            ))}
          </div>

          {/* Team Task Assignments */}
          <Card className="backdrop-blur-xl bg-slate-900/50 border-white/10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <h3 className="text-white font-bold text-lg">Team Task Assignments</h3>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setTaskFilter('all')}
                  className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                    taskFilter === 'all' ? 'bg-cyan-500 text-white' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setTaskFilter('in-progress')}
                  className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                    taskFilter === 'in-progress' ? 'bg-blue-500 text-white' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => setTaskFilter('blocked')}
                  className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                    taskFilter === 'blocked' ? 'bg-red-500 text-white' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                  }`}
                >
                  Blocked
                </button>
                <button
                  onClick={() => setTaskFilter('completed')}
                  className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                    taskFilter === 'completed' ? 'bg-emerald-500 text-white' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <select
                value={taskSort}
                onChange={(e) => setTaskSort(e.target.value)}
                className="px-2 py-1 rounded text-xs bg-slate-700/50 text-slate-300 border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="deadline">Sort by Deadline</option>
                <option value="capacity">Sort by Capacity</option>
              </select>
            </div>

            <div className="space-y-2">
              {sortedTasks.map((t, idx) => (
                <Card
                  key={idx}
                  className={`backdrop-blur-xl border ${
                    t.status === 'completed'
                      ? 'bg-emerald-500/10 border-emerald-500/20'
                      : t.status === 'blocked'
                      ? 'bg-red-500/10 border-red-500/20'
                      : 'bg-blue-500/10 border-blue-500/20'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-white font-bold">{t.employeeName}</p>
                        <Badge variant={t.priority === 'critical' ? 'danger' : 'default'}>
                          {t.priority.toUpperCase()}
                        </Badge>
                        <Badge variant={t.status === 'completed' ? 'success' : t.status === 'blocked' ? 'danger' : 'default'}>
                          {t.status === 'in-progress' ? '⏳ In Progress' : t.status === 'blocked' ? '🚫 Blocked' : '✅ Completed'}
                        </Badge>
                      </div>
                      {t.designation && (
                        <p className="text-slate-400 text-xs mb-1 italic">{t.designation}</p>
                      )}
                      <p className="text-slate-300 font-medium text-sm mb-2">{t.task}</p>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                        <div>
                          <p className="text-slate-400">Department</p>
                          <p className="text-cyan-300">{t.department}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Project</p>
                          <p className="text-blue-300">{t.projectName}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Deadline</p>
                          <p className="text-amber-300">{format(new Date(t.deadline), 'MMM dd, yyyy')}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Progress</p>
                          <p className="text-purple-300">{t.progress}%</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Capacity</p>
                          <p className={t.capacity >= 85 ? 'text-red-300' : t.capacity >= 70 ? 'text-amber-300' : 'text-emerald-300'}>
                            {t.capacity}%
                          </p>
                        </div>
                      </div>
                      {t.blocker && (
                        <div className="mt-2 p-2 rounded bg-red-500/20 border border-red-500/30">
                          <p className="text-red-300 text-xs">🚨 {t.blocker}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 md:w-32">
                      <div>
                        <p className="text-slate-400 text-xs mb-1">Task Progress</p>
                        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                          <div className={`h-full transition-all ${t.status === 'completed' ? 'bg-emerald-400' : t.status === 'blocked' ? 'bg-red-400' : 'bg-blue-400'}`} style={{ width: `${t.progress}%` }} />
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs mb-1">Capacity</p>
                        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                          <div className={`h-full transition-all ${t.capacity >= 85 ? 'bg-red-400' : t.capacity >= 70 ? 'bg-amber-400' : 'bg-emerald-400'}`} style={{ width: `${t.capacity}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>

        {/* PROJECT DETAIL MODAL */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-950 border-cyan-500/30">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white">{selectedProject.name}</h2>
                  <p className="text-slate-400 text-sm mt-1">{selectedProject.owner}</p>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-slate-400 hover:text-white text-2xl font-bold leading-none"
                >
                  ×
                </button>
              </div>

              <p className="text-slate-300 mb-4">{selectedProject.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-white/10">
                <div>
                  <p className="text-slate-400 text-xs">Progress</p>
                  <p className="text-2xl font-bold text-cyan-300">{selectedProject.progress}%</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Team Size</p>
                  <p className="text-2xl font-bold text-blue-300">{selectedProject.team}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Budget Used</p>
                  <p className="text-2xl font-bold text-purple-300">
                    {Math.round((selectedProject.budget.spent / selectedProject.budget.allocated) * 100)}%
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Blockers</p>
                  <p className={`text-2xl font-bold ${selectedProject.blockers > 0 ? 'text-red-300' : 'text-emerald-300'}`}>
                    {selectedProject.blockers}
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-6 pb-6 border-b border-white/10">
                <div>
                  <p className="text-slate-400 text-xs mb-2">Timeline</p>
                  <p className="text-white">
                    {format(new Date(selectedProject.startDate), 'MMM dd, yyyy')} → {format(new Date(selectedProject.endDate), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-2">Budget</p>
                  <p className="text-white">
                    PKR {(selectedProject.budget.spent / 1000).toFixed(0)}K of PKR {(selectedProject.budget.allocated / 1000).toFixed(0)}K allocated
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-2">Status</p>
                  <Badge variant={selectedProject.status === 'on-track' ? 'success' : 'warning'}>
                    {selectedProject.status === 'on-track' ? 'On Track' : 'At Risk'}
                  </Badge>
                </div>
              </div>

              <button
                onClick={() => setSelectedProject(null)}
                className="w-full px-4 py-2 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 transition-all"
              >
                Close
              </button>
            </Card>
          </div>
        )}

        {/* ===== LEVEL 2: DEPARTMENTS ===== */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Building2 size={28} className="text-blue-400" /> Department Performance
          </h2>
          <div className="space-y-3">
            {deptSummary.map((d, idx) => (
              <Card key={idx} className="backdrop-blur-xl bg-slate-900/50 border-white/10">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg">{d.dept || 'Unassigned'}</h3>
                    <p className="text-slate-400 text-sm mt-1">{d.employees} employees • Health: {d.healthScore}%</p>
                  </div>
                  <Badge variant={d.healthStatus === 'excellent' ? 'success' : 'default'}>
                    {d.healthStatus.charAt(0).toUpperCase() + d.healthStatus.slice(1)}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
                  <div>
                    <p className="text-slate-400 text-xs">Active</p>
                    <p className="text-emerald-300 font-bold">{d.active}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">On Leave</p>
                    <p className="text-amber-300 font-bold">{d.onLeave}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Suspended</p>
                    <p className="text-red-300 font-bold">{d.suspended}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Avg Salary</p>
                    <p className="text-cyan-300 font-bold text-sm">PKR {(d.avgSalary / 1000).toFixed(0)}K</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Utilization</p>
                    <p className="text-purple-300 font-bold">{Math.round((d.active / d.employees) * 100)}%</p>
                  </div>
                </div>

                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      d.healthStatus === 'excellent'
                        ? 'bg-gradient-to-r from-emerald-400 to-cyan-400'
                        : d.healthStatus === 'good'
                        ? 'bg-gradient-to-r from-blue-400 to-cyan-400'
                        : 'bg-gradient-to-r from-amber-400 to-orange-400'
                    }`}
                    style={{ width: `${d.healthScore}%` }}
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* ===== LEVEL 3: SUPPORT NEEDED ===== */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <CheckCircle2 size={28} className="text-emerald-400" /> Needs Support
          </h2>
          <div className="space-y-3">
            {needsSupport.length === 0 && (
              <Card className="backdrop-blur-xl bg-slate-900/50 border-white/10 p-4">
                <p className="text-slate-400 text-center">✓ All team members on track</p>
              </Card>
            )}
            {needsSupport.map(({ e, issues }, idx) => (
              <Card key={idx} className="backdrop-blur-xl bg-gradient-to-br from-red-500/10 to-amber-500/10 border-red-500/20">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-white font-bold">{e.firstName} {e.lastName}</p>
                    <p className="text-slate-400 text-xs">{e.department || 'No Dept'} • {e.position?.title || 'No Position'}</p>
                  </div>
                  <Badge variant="danger">⚠ {issues.length} issues</Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {issues.map((issue, i) => (
                    <span key={i} className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded border border-red-500/30">
                      {issue}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ChairmanOverview;
