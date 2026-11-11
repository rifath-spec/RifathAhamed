export interface WorkExperienceItem {
  id: string;
  role: string;
  organization: string;
  period: string;
  location: string;
  summary: string;
  responsibilities: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  period: string;
  statusOrClassification: string;
  gpa?: string;
  specialization?: string;
  finalYearProject?: string;
  details: string[];
}

export interface ProjectItem {
  id: string;
  imageKey: 'schoolManagement' | 'homeRenovation' | string;
  title: string;
  category: string;
  techStack: string[];
  description: string;
  highlights: string[];
  liveUrl?: string;
  githubUrl?: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface LanguageItem {
  language: string;
  proficiency: string;
  detail: string;
}

export interface CVData {
  personalInfo: {
    fullName: string;
    designation: string;
    email: string;
    telephone: string;
    location: string;
    linkedinLabel: string;
    linkedinUrl: string;
    resumePdfPath: string;
  };
  professionalSummary: string[];
  coreCompetencies: {
    title: string;
    description: string;
  }[];
  workExperience: WorkExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  technicalSkills: SkillGroup[];
  professionalStrengths: {
    title: string;
    detail: string;
  }[];
  languages: LanguageItem[];
}

export const cvData: CVData = {
  personalInfo: {
    fullName: 'RIFATH AHAMED',
    designation: 'ADMINISTRATIVE ASSISTANT | OFFICE OPERATIONS | DOCUMENTATION & IT SUPPORT',
    email: 'arifath98@gmail.com',
    telephone: '075-0927652',
    location: 'Trincomalee, Sri Lanka',
    linkedinLabel: '',
    linkedinUrl: '',
    resumePdfPath: '/assets/resume.pdf',
  },

  professionalSummary: [
    'Detail-oriented Administrative and Office Support professional with a BSc in Management and Information Technology (Second Class Upper Honours, GPA 3.50/4.00) and practical experience in administrative coordination, financial record keeping, documentation, reporting and daily operations support. Proficient in Microsoft Office applications, particularly Excel, Word, Access and Outlook, with practical skills in data management, report preparation, database management and dashboard creation. Experienced in supporting transportation operations, employee attendance records, salary-related documentation and project administration. Possesses strong organizational, analytical and communication skills, with the ability to support efficient office operations.',
  ],

  coreCompetencies: [
    { title: 'Administrative & Office Support', description: '' },
    { title: 'Document Management & Record Keeping', description: '' },
    { title: 'Financial Records & Invoice Checking', description: '' },
    { title: 'Data Entry & Information Management', description: '' },
    { title: 'Report Preparation & Documentation', description: '' },
    { title: 'Employee Attendance & Payroll Documentation', description: '' },
    { title: 'Operations & Staff Coordination', description: '' },
    { title: 'Scheduling & Administrative Support', description: '' },
    { title: 'Microsoft Office & Database Management', description: '' },
    { title: 'Project Documentation & Monitoring', description: '' },
  ],

  workExperience: [
    {
      id: 'jay-jay-mills-2025',
      role: 'Transport Management Intern – Administrative & Operations Support',
      organization: 'Jay Jay Mills Lanka (Pvt) Ltd',
      period: '2025',
      location: 'Trincomalee, Sri Lanka',
      summary: '',
      responsibilities: [
        'Prepared and updated daily transportation schedules to support smooth business operations.',
        'Coordinated staff transportation and communicated with HR and other departments.',
        'Coordinated vehicle and driver activities to support timely transportation services.',
        'Prepared transport reports and maintained accurate vehicle records.',
        'Monitored vehicle-related expenses and maintained transportation information.',
        'Checked vehicle maintenance schedules to support operational efficiency.',
        'Used Microsoft Excel and internal company software for transport coordination and record management.',
      ],
    },
    {
      id: 'grace-construction-2019-2021',
      role: 'Management Assistant – Administrative & Accounts Support',
      organization: 'Grace Construction',
      period: '2019–2021',
      location: 'Trincomalee, Sri Lanka',
      summary: '',
      responsibilities: [
        'Maintained financial records and updated business information using Microsoft Excel.',
        'Checked bills, invoices and payment records to support accurate financial documentation.',
        'Prepared daily reports and maintained organized project records.',
        'Assisted with employee attendance records and salary-related documentation.',
        'Monitored project activities and supported day-to-day administrative operations.',
        'Coordinated administrative and financial information to support project management activities.',
      ],
    },
  ],

  education: [
    {
      id: 'bsc-mit-seusl',
      degree: 'Bachelor of Science (BSc) in Management and Information Technology',
      institution: 'South Eastern University of Sri Lanka',
      period: '2021–2025',
      statusOrClassification: 'Second Class Upper Honours',
      gpa: '3.50/4.00',
      specialization: '60% Management, 40% Information Technology',
      details: [],
    },
    {
      id: 'aat-sri-lanka',
      degree: 'Association of Accounting Technicians (AAT Sri Lanka)',
      institution: 'Zip Campus, Sri Lanka',
      period: 'Currently Pursuing',
      statusOrClassification: 'Currently Pursuing',
      details: [],
    },
  ],

  projects: [
    {
      id: 'school-management-system',
      imageKey: 'schoolManagement',
      title: 'School Management System',
      category: 'C# & SQL Server',
      techStack: ['C#', 'SQL Server'],
      description: '',
      highlights: [
        'Designed a relational database to manage student, teacher, course and guardian information.',
        'Implemented data organization and administrative information management features.',
      ],
      liveUrl: '',
      githubUrl: '',
    },
    {
      id: 'home-repair-renovation-website',
      imageKey: 'homeRenovation',
      title: 'Home Repair & Renovation Website',
      category: 'PHP, HTML, CSS, JavaScript & MySQL',
      techStack: ['PHP', 'HTML', 'CSS', 'JavaScript', 'MySQL'],
      description: '',
      highlights: [
        'Developed a web-based platform for renovation services, user registration and task tracking.',
        'Worked on front-end design, back-end functionality and database integration.',
      ],
      liveUrl: '',
      githubUrl: '',
    },
  ],

  technicalSkills: [
    {
      category: 'Microsoft Excel – Advanced',
      items: [
        'Formulas and functions (IF, SUMIF, COUNTIF)',
        'Pivot Tables and Charts',
        'VLOOKUP and XLOOKUP',
        'Data Cleaning and Data Validation',
        'Dashboard Creation and Reporting',
      ],
    },
    {
      category: 'Microsoft Word – Advanced',
      items: [
        'Professional Letters and Reports',
        'Document Formatting and Page Layout',
        'Tables and Mail Merge',
      ],
    },
    {
      category: 'Microsoft Access – Advanced',
      items: [
        'Database Creation and Management',
        'Table and Query Development',
        'Forms and Reports',
        'Table Relationships and Primary Keys',
        'Data Validation',
        'Excel Data Import and Export',
      ],
    },
    {
      category: 'Other Applications',
      items: [
        'Microsoft PowerPoint – Advanced',
        'Microsoft Outlook – Advanced',
        'Microsoft Project – Intermediate',
        'Email Management and Calendar Scheduling',
      ],
    },
  ],

  professionalStrengths: [],

  languages: [
    {
      language: 'English',
      proficiency: 'Professional Proficiency (Speaking & Writing)',
      detail: '',
    },
    {
      language: 'Tamil',
      proficiency: 'Native Proficiency',
      detail: '',
    },
    {
      language: 'Sinhala',
      proficiency: 'Intermediate Proficiency',
      detail: '',
    },
    {
      language: 'Arabic',
      proficiency: 'Basic Proficiency',
      detail: '',
    },
  ],
};
