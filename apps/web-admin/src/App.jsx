import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  ShieldCheck, 
  Activity, 
  Building2, 
  Download, 
  FileText, 
  LogOut, 
  Search,
  CheckCircle,
  MapPin
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import Papa from 'papaparse';
import './App.css';

const initialMockData = {
  totalScans: 1284,
  interactionsFlagged: 142,
  preventedHighRiskCount: 68,
  activePharmacies: 18,
  topFlaggedPairs: [
    { pair: 'Warfarin + Aspirin', count: 42, severity: 'high' },
    { pair: 'Clopidogrel + Omeprazole', count: 31, severity: 'moderate' },
    { pair: 'Simvastatin + Amiodarone', count: 24, severity: 'high' },
    { pair: 'Metformin + Contrast Agent', count: 18, severity: 'moderate' },
    { pair: 'Ciprofloxacin + Antacids', count: 15, severity: 'low' }
  ],
  pharmacyUsage: [
    { id: 'PHC-01', name: 'PHC Gandhinagar', location: 'Gandhinagar Sector 21', scans: 340, flags: 42, status: 'Active' },
    { id: 'PHC-02', name: 'Civil Hospital Dispensary', location: 'Asarwa, Ahmedabad', scans: 290, flags: 35, status: 'Active' },
    { id: 'PHC-03', name: 'PHC Chandkheda', location: 'Chandkheda', scans: 210, flags: 28, status: 'Active' },
    { id: 'PHC-04', name: 'Community Care Pharmacy', location: 'Vastrapur', scans: 195, flags: 19, status: 'Active' },
    { id: 'PHC-05', name: 'Rural Health Post #4', location: 'Sanand', scans: 149, flags: 18, status: 'Active' },
    { id: 'PHC-06', name: 'PHC Bopal Dispensary', location: 'South Bopal', scans: 100, flags: 0, status: 'Active' }
  ],
  recentAlertLogs: [
    { id: 'LOG-8821', time: '10 mins ago', pharmacy: 'PHC Gandhinagar', drugA: 'Warfarin 5mg', drugB: 'Aspirin 75mg', severity: 'high', prescriber: 'Dr. R. Shah', details: 'Risk of severe gastrointestinal hemorrhage.' },
    { id: 'LOG-8820', time: '28 mins ago', pharmacy: 'Civil Hospital Dispensary', drugA: 'Clopidogrel 75mg', drugB: 'Omeprazole 20mg', severity: 'moderate', prescriber: 'Dr. M. Patel', details: 'Decreased antiplatelet efficacy of Clopidogrel.' },
    { id: 'LOG-8819', time: '1 hour ago', pharmacy: 'Rural Health Post #4', drugA: 'Simvastatin 20mg', drugB: 'Amiodarone 200mg', severity: 'high', prescriber: 'Dr. V. Joshi', details: 'Increased risk of myopathy and rhabdomyolysis.' },
    { id: 'LOG-8818', time: '2 hours ago', pharmacy: 'PHC Chandkheda', drugA: 'Ciprofloxacin 500mg', drugB: 'Gelusil Antacid', severity: 'low', prescriber: 'Dr. A. Verma', details: 'Chelation reduces absorption of fluoroquinolone antibiotic.' },
    { id: 'LOG-8817', time: '3 hours ago', pharmacy: 'PHC Gandhinagar', drugA: 'Warfarin 2mg', drugB: 'Ibuprofen 400mg', severity: 'high', prescriber: 'Dr. K. Nair', details: 'Enhanced anticoagulation and mucosal ulceration risk.' }
  ]
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [summaryData, setSummaryData] = useState(initialMockData);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/analytics/summary')
      .then(res => res.json())
      .then(data => {
        if (data && data.totalScans) {
          setSummaryData(data);
        }
      })
      .catch(() => {
        console.log('Using mock analytics data during build/testing');
      });
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setIsAuthenticated(true);
    }
  };

  const handleExportCSV = () => {
    const exportRows = summaryData.recentAlertLogs.map(log => ({
      LogID: log.id,
      Timestamp: log.time,
      Pharmacy: log.pharmacy,
      PrescribedDrugA: log.drugA,
      PrescribedDrugB: log.drugB,
      RiskSeverity: log.severity.toUpperCase(),
      PrescribingDoctor: log.prescriber,
      ClinicalExplanation: log.details
    }));

    const csv = Papa.unparse(exportRows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SafeRx_Interaction_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthenticated) {
    return (
      <div className="auth-wrapper">
        <div className="auth-card">
          <h2>SafeRx Health Portal</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
            Primary Health Centre & Admin Dashboard
          </p>
          <form onSubmit={handleLogin}>
            <div className="auth-field">
              <label>Role</label>
              <select value={userRole} onChange={(e) => setUserRole(e.target.value)}>
                <option value="admin">Health Administrator (District/State)</option>
                <option value="pharmacy">PHC / Pharmacy Supervisor</option>
              </select>
            </div>
            <div className="auth-field">
              <label>Username / ID</label>
              <input 
                type="text" 
                placeholder="e.g. admin_phc_gujarat" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
            </div>
            <div className="auth-field">
              <label>Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="auth-btn">Sign In to Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  const filteredLogs = summaryData.recentAlertLogs.filter(log => 
    log.drugA.toLowerCase().includes(searchFilter.toLowerCase()) ||
    log.drugB.toLowerCase().includes(searchFilter.toLowerCase()) ||
    log.pharmacy.toLowerCase().includes(searchFilter.toLowerCase()) ||
    log.prescriber.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const filteredPharmacies = summaryData.pharmacyUsage.filter(phc =>
    phc.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    phc.location.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <ShieldCheck size={26} color="#38bdf8" />
          <span>SafeRx Admin</span>
        </div>
        <div className="nav-links">
          <button 
            className={`nav-item ${selectedTab === 'overview' ? 'active' : ''}`}
            onClick={() => { setSelectedTab('overview'); setSearchFilter(''); }}
          >
            <Activity size={18} />
            <span>Overview & Analytics</span>
          </button>
          <button 
            className={`nav-item ${selectedTab === 'pharmacies' ? 'active' : ''}`}
            onClick={() => { setSelectedTab('pharmacies'); setSearchFilter(''); }}
          >
            <Building2 size={18} />
            <span>PHC & Pharmacies</span>
          </button>
          <button 
            className={`nav-item ${selectedTab === 'alerts' ? 'active' : ''}`}
            onClick={() => { setSelectedTab('alerts'); setSearchFilter(''); }}
          >
            <AlertTriangle size={18} />
            <span>Interaction Logs</span>
          </button>
        </div>
        <button className="nav-item" onClick={() => setIsAuthenticated(false)}>
          <LogOut size={18} />
          <span>Logout ({username})</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        <div className="top-bar">
          <div className="title-section">
            <h1>
              {selectedTab === 'overview' && 'Cross-Prescription Interaction Guard'}
              {selectedTab === 'pharmacies' && 'Registered Primary Health Centres (PHCs)'}
              {selectedTab === 'alerts' && 'Detailed Adverse Drug Interaction Registry'}
            </h1>
            <p>
              {selectedTab === 'overview' && 'Real-time surveillance of adverse drug-drug interactions across registered PHCs'}
              {selectedTab === 'pharmacies' && 'Active dispensing units, prescription processing counts, and center status'}
              {selectedTab === 'alerts' && 'Complete audit trail of all flagged contraindications with prescriber records'}
            </p>
          </div>
          <button className="btn-export" onClick={handleExportCSV}>
            <Download size={16} />
            <span>Export CSV Report</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {selectedTab === 'overview' && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-header">
                  <span>TOTAL PRESCRIPTIONS</span>
                  <FileText size={18} color="#0284c7" />
                </div>
                <div className="stat-value">{summaryData.totalScans}</div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <span>INTERACTIONS CAUGHT</span>
                  <AlertTriangle size={18} color="#d97706" />
                </div>
                <div className="stat-value" style={{ color: '#d97706' }}>
                  {summaryData.interactionsFlagged}
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <span>HIGH-RISK PREVENTED</span>
                  <ShieldCheck size={18} color="#dc2626" />
                </div>
                <div className="stat-value" style={{ color: '#dc2626' }}>
                  {summaryData.preventedHighRiskCount}
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <span>ACTIVE PHCs / CENTERS</span>
                  <Building2 size={18} color="#16a34a" />
                </div>
                <div className="stat-value">{summaryData.activePharmacies}</div>
              </div>
            </div>

            <div className="charts-grid">
              <div className="chart-card">
                <h3>Most Common Flagged Drug Pairs</h3>
                <div style={{ width: '100%', height: 260 }}>
                  <ResponsiveContainer>
                    <BarChart data={summaryData.topFlaggedPairs} layout="vertical" margin={{ left: 30, right: 20 }}>
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="pair" width={140} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#0284c7" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="chart-card">
                <h3>Prescription Scans by PHC Facility</h3>
                <div style={{ width: '100%', height: 260 }}>
                  <ResponsiveContainer>
                    <BarChart data={summaryData.pharmacyUsage} margin={{ top: 10, bottom: 20 }}>
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="scans" fill="#38bdf8" name="Scans" />
                      <Bar dataKey="flags" fill="#ef4444" name="Interactions" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}

        {/* TAB 2: PHC & PHARMACIES */}
        {selectedTab === 'pharmacies' && (
          <div className="table-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3>Connected Dispensaries & PHCs</h3>
              <input 
                type="text" 
                placeholder="Search PHC by name or location..." 
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '280px' }}
              />
            </div>
            <table>
              <thead>
                <tr>
                  <th>Center ID</th>
                  <th>Facility Name</th>
                  <th>Location</th>
                  <th>Total Scans</th>
                  <th>Interactions Flagged</th>
                  <th>Facility Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredPharmacies.map((phc) => (
                  <tr key={phc.id}>
                    <td style={{ fontWeight: 600 }}>{phc.id}</td>
                    <td style={{ fontWeight: 600, color: '#0284c7' }}>{phc.name}</td>
                    <td style={{ color: '#64748b' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={14} /> {phc.location}
                      </span>
                    </td>
                    <td>{phc.scans}</td>
                    <td style={{ color: phc.flags > 25 ? '#dc2626' : '#d97706', fontWeight: 600 }}>{phc.flags}</td>
                    <td>
                      <span className="badge" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
                        ● {phc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: INTERACTION LOGS */}
        {selectedTab === 'alerts' && (
          <div className="table-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3>Adverse Interaction Logs</h3>
              <input 
                type="text" 
                placeholder="Search drug, prescriber, or PHC..." 
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '280px' }}
              />
            </div>
            <table>
              <thead>
                <tr>
                  <th>Log ID</th>
                  <th>Time</th>
                  <th>Dispensing Facility</th>
                  <th>Drug Combination</th>
                  <th>Severity</th>
                  <th>Prescribing Doctor</th>
                  <th>Clinical Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ fontWeight: 600 }}>{log.id}</td>
                    <td style={{ color: '#64748b', fontSize: '13px' }}>{log.time}</td>
                    <td>{log.pharmacy}</td>
                    <td>
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>{log.drugA}</span> + <span>{log.drugB}</span>
                    </td>
                    <td>
                      <span className={`badge ${log.severity === 'high' ? 'badge-high' : log.severity === 'moderate' ? 'badge-moderate' : ''}`}>
                        {log.severity.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ color: '#64748b' }}>{log.prescriber}</td>
                    <td style={{ fontSize: '13px', color: '#475569' }}>{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;