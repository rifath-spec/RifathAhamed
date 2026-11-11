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
    designation:
      'BSc in Management & Information Technology (Second Class Upper Honours) | MIS, Operations & Accounting Systems Professional',
    email: 'rifathahamed.official@gmail.com',
    // Replace with your verified telephone number when publishing:
    telephone: 'Available upon request',
    location: 'Sri Lanka',
    // Replace with your verified LinkedIn profile URL when publishing:
    linkedinLabel: 'linkedin.com/in/rifath-ahamed',
    linkedinUrl: '',
    resumePdfPath: 'assets/resume.pdf',
  },

  professionalSummary: [
    'Detail-oriented Management and Information Technology graduate holding a Bachelor of Science (Second Class Upper Honours, GPA 3.50/4.00) from the South Eastern University of Sri Lanka, alongside an ongoing professional accounting qualification with the Association of Accounting Technicians of Sri Lanka (AAT Sri Lanka).',
    'Possesses practical experience across Management Information Systems (MIS), operational and transport coordination, administrative and HR systems support, financial systems and accounts checking, and IT infrastructure support. Proven ability to bridge business operations, financial record accuracy, and software/database systems to maintain reliable organizational workflows and management reporting.',
  ],

  coreCompetencies: [
    {
      title: 'MIS & Operational Coordination',
      description:
        'Structuring operational data, maintaining accurate digital records, and coordinating daily schedules, logistics, and management reporting.',
    },
    {
      title: 'Administrative & HR Systems Support',
      description:
        'Supporting personnel records, attendance-linked operational tracking, documentation workflows, and cross-departmental administration.',
    },
    {
      title: 'Financial Systems & Reporting Support',
      description:
        'Accounts checking, voucher and invoice verification, expense reconciliation, and structured financial documentation aligned with AAT accounting standards.',
    },
    {
      title: 'IT Infrastructure & Systems Support',
      description:
        'Relational database administration (SQL Server, MySQL), desktop/web application support, system configuration, and technical troubleshooting.',
    },
    {
      title: 'Database & Application Development',
      description:
        'Designing and implementing structured information systems using C#, SQL Server, PHP, HTML, CSS, JavaScript, and MySQL.',
    },
    {
      title: 'Process Compliance & Documentation',
      description:
        'Maintaining audit-ready operational logs, standardizing administrative spreadsheets, and verifying compliance across vendor and site operations.',
    },
  ],

  workExperience: [
    {
      id: 'jay-jay-mills-2025',
      role: 'Transport Management Intern',
      organization: 'Jay Jay Mills Lanka (Pvt) Ltd',
      period: '2025',
      location: 'Sri Lanka',
      summary:
        'Supported factory and administrative transport operations, MIS record maintenance, and cross-functional logistics coordination.',
      responsibilities: [
        'Coordinated daily employee and operational transport schedules, route allocations, and vehicle deployment to ensure punctual and uninterrupted organizational operations.',
        'Maintained and updated transport Management Information Systems (MIS) spreadsheets and logs, tracking trip records, vehicle utilization, mileage, and fuel consumption.',
        'Worked closely with administrative, HR, and operational departments to align shift attendance records with transport requirements and resolve daily scheduling bottlenecks.',
        'Verified transport service records, supplier/vendor trip documentation, and operational checklists to support accurate periodic reporting and cost monitoring.',
      ],
    },
    {
      id: 'grace-construction-2019-2021',
      role: 'Supervisor & Accounts Checker',
      organization: 'Grace Construction',
      period: '2019 – 2021',
      location: 'Sri Lanka',
      summary:
        'Combined on-site operational supervision with systematic accounts verification, expense tracking, and administrative record keeping.',
      responsibilities: [
        'Supervised daily site operations, workforce allocation, and material usage to ensure project activities progressed in accordance with operational schedules and quality standards.',
        'Performed rigorous accounts checking, reviewing supplier invoices, payment vouchers, delivery notes, and site expense statements for arithmetic and documentary accuracy.',
        'Maintained daily financial ledgers, petty cash reconciliations, labor attendance sheets, and material inventory records to support management financial reporting.',
        'Liaised between site teams, material vendors, and management to resolve discrepancies in billing or inventory and maintain transparent operational documentation.',
      ],
    },
  ],

  education: [
    {
      id: 'bsc-mit-seusl',
      degree: 'Bachelor of Science in Management and Information Technology',
      institution: 'South Eastern University of Sri Lanka',
      period: '2021 – 2025',
      statusOrClassification: 'Second Class Upper Honours',
      gpa: '3.50 / 4.00',
      specialization: 'Management and Information Technology (MIS, Operations, Enterprise & Database Systems)',
      finalYearProject:
        'Academic & Capstone Systems Development — Designed and implemented structured database-driven software solutions including a C# / SQL Server School Management System and a PHP / MySQL Home Repair & Renovation Web Platform.',
      details: [
        'Graduated with Second Class Upper Honours, achieving a cumulative Grade Point Average (GPA) of 3.50 / 4.00.',
        'Completed core coursework spanning Management Information Systems (MIS), Database Management Systems, Software Engineering, Operations Management, Financial & Managerial Accounting, Human Resource Management, and IT Infrastructure.',
      ],
    },
    {
      id: 'aat-sri-lanka',
      degree: 'Association of Accounting Technicians (AAT Sri Lanka)',
      institution: 'AAT Sri Lanka',
      period: 'In Progress',
      statusOrClassification: 'Ongoing Professional Qualification',
      details: [
        'Pursuing professional accounting technician qualification focused on Financial Accounting, Quantitative Techniques, Business Environment, Costing, Auditing, and Accounting Systems.',
        'Strengthens practical capability in financial systems support, accounts checking, ledger reconciliation, and management reporting.',
      ],
    },
  ],

  projects: [
    {
      id: 'school-management-system',
      imageKey: 'schoolManagement',
      title: 'School Management System',
      category: 'Desktop Information System & Relational Database',
      techStack: ['C#', 'SQL Server'],
      description:
        'A desktop-based School Management System developed using C# and Microsoft SQL Server to centralize and automate core academic and administrative school operations. Designed with a normalized relational database architecture to ensure data integrity, fast querying, and structured administrative workflows.',
      highlights: [
        'Engineered C# desktop forms and business logic for managing student enrollment, academic profiles, teacher/staff records, and class allocations.',
        'Designed and implemented a Microsoft SQL Server relational database handling attendance logs, examination marks, fee records, and structured administrative queries.',
        'Built input validation, search/filter utilities, and summary report views to reduce manual paperwork and improve record accuracy for school administrators.',
      ],
      liveUrl: '',
      githubUrl: '',
    },
    {
      id: 'home-repair-renovation-website',
      imageKey: 'homeRenovation',
      title: 'Home Repair & Renovation Website',
      category: 'Full-Stack Web Application',
      techStack: ['PHP', 'HTML', 'CSS', 'JavaScript', 'MySQL'],
      description:
        'A responsive full-stack web application built with PHP, HTML, CSS, JavaScript, and MySQL to facilitate home repair, maintenance, and renovation service management. Connects clients with categorized repair services and provides structured service request and administrative tracking workflows.',
      highlights: [
        'Developed responsive, user-friendly frontend interfaces using HTML, CSS, and JavaScript with client-side form validation and clear service navigation.',
        'Implemented server-side logic in PHP integrated with a MySQL relational database to process customer inquiries, service bookings, and project quotations.',
        'Created administrative management modules to review incoming service requests, update service statuses, and maintain structured client and service records.',
      ],
      liveUrl: '',
      githubUrl: '',
    },
  ],

  technicalSkills: [
    {
      category: 'Management Information Systems & Operations',
      items: [
        'MIS Data Entry, Validation & Reporting',
        'Transport & Fleet Operations Coordination',
        'Administrative & HR Record Systems',
        'Inventory & Material Tracking',
      ],
    },
    {
      category: 'Financial & Accounting Systems Support',
      items: [
        'Accounts Checking & Voucher Verification',
        'Invoice & Billing Reconciliation',
        'Petty Cash & Expense Ledger Maintenance',
        'Financial Reporting Support (AAT Sri Lanka — In Progress)',
      ],
    },
    {
      category: 'Programming & Web Technologies',
      items: ['C#', 'PHP', 'HTML5', 'CSS3', 'JavaScript'],
    },
    {
      category: 'Database Management Systems',
      items: [
        'Microsoft SQL Server',
        'MySQL',
        'Relational Database Design',
        'SQL Queries & Data Reporting',
      ],
    },
    {
      category: 'IT Infrastructure & Office Productivity',
      items: [
        'Microsoft Excel (Spreadsheets, Formulas, Pivot Tables, MIS Reports)',
        'Microsoft Word & PowerPoint',
        'IT Hardware, Software & Systems Troubleshooting',
        'User & Operational Systems Support',
      ],
    },
  ],

  professionalStrengths: [
    {
      title: 'Analytical & Detail-Oriented Execution',
      detail:
        'Methodical approach to verifying financial accounts, reconciling operational logs, and maintaining error-free MIS datasets.',
    },
    {
      title: 'Cross-Functional Operational Coordination',
      detail:
        'Demonstrated capability in coordinating between management, HR/administration, transport staff, site teams, and external vendors.',
    },
    {
      title: 'Dual Management & IT Fluency',
      detail:
        'Combines academic grounding in BSc Management & Information Technology (GPA 3.50/4.00) with practical accounting and software development skills.',
    },
    {
      title: 'Supervisory & Time-Management Discipline',
      detail:
        'Proven track record of supervising daily operations, prioritizing competing deadlines, and maintaining clear accountability.',
    },
  ],

  languages: [
    {
      language: 'English',
      proficiency: 'Professional Working Proficiency',
      detail: 'Business communication, technical documentation, MIS reporting, and academic/professional writing.',
    },
    {
      language: 'Tamil',
      proficiency: 'Native / Bilingual Proficiency',
      detail: 'Full native fluency in spoken and written communication.',
    },
    {
      language: 'Sinhala',
      proficiency: 'Working / Conversational Proficiency',
      detail: 'Effective workplace and operational communication.',
    },
  ],
};
