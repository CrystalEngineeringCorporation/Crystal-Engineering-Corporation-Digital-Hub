import type { AppDefinition } from './types';

/**
 * ============================================================
 *  CENTRAL APPLICATION REGISTRY
 * ============================================================
 * Register, edit, remove or reorder company applications here.
 * `nameTh` / `descriptionTh` are the Thai texts (optional; English is used when empty).
 * The order in this array is the display order in the portal.
 *
 * To connect an application, set its `url` to the real address, e.g.
 *   url: 'https://projects.example-company.com'
 * or a same-origin path, e.g. url: '/projects/'.
 *
 * Leave `url` empty ('') until the application exists — the portal will
 * show a "Not configured" state instead of a broken link.
 *
 * These entries are the proposed starting catalog. Only apps with a real
 * `url` are launchable; the rest show "Not configured".
 */
export const APP_CATALOG: AppDefinition[] = [
  // ---------- Engineering & Construction ----------
  {
    id: 'projects-management',
    name: 'Projects Management',
    nameTh: 'บริหารโครงการ',
    description: 'Manage construction projects and project information.',
    descriptionTh: 'จัดการโครงการก่อสร้างและข้อมูลโครงการ',
    category: 'engineering',
    icon: 'folder-kanban',
    url: '',
    status: 'available',
    openMode: 'new-tab',
    featured: true,
    defaultFavorite: true,
  },
  {
    id: 'site-inspection',
    name: 'Site Inspection & Reports',
    nameTh: 'ตรวจหน้างานและรายงาน',
    description: 'Record site inspections and prepare site reports.',
    descriptionTh: 'บันทึกการตรวจหน้างานและจัดทำรายงานหน้างาน',
    category: 'engineering',
    icon: 'clipboard-check',
    url: '',
    status: 'available',
    openMode: 'new-tab',
    featured: true,
    defaultFavorite: true,
  },
  {
    id: 'boq-estimation',
    name: 'BOQ & Estimation',
    nameTh: 'BOQ และการประมาณราคา',
    description: 'Manage bills of quantities and construction estimates.',
    descriptionTh: 'จัดการบัญชีแสดงปริมาณวัสดุและราคา (BOQ) และการประมาณราคาก่อสร้าง',
    category: 'engineering',
    icon: 'calculator',
    url: 'https://crystalengineeringcorporation.github.io/Measurement-Tool-construction-dimension-and-scale-calculator/',
    status: 'available',
    openMode: 'new-tab',
    featured: true,
    defaultFavorite: true,
  },
  {
    id: 'planning-scheduling',
    name: 'Planning & Scheduling',
    nameTh: 'วางแผนและจัดตารางงาน',
    description: 'Access project schedules, Gantt charts, and S-curves.',
    descriptionTh: 'เข้าถึงแผนงานโครงการ Gantt Chart และ S-Curve',
    category: 'engineering',
    icon: 'calendar-range',
    url: '',
    status: 'available',
    openMode: 'new-tab',
    featured: true,
  },
  {
    id: 'drawings-bim',
    name: 'Drawings & BIM',
    nameTh: 'แบบก่อสร้างและ BIM',
    description: 'Access construction drawings and BIM-related tools.',
    descriptionTh: 'เข้าถึงแบบก่อสร้างและเครื่องมือด้าน BIM',
    category: 'engineering',
    icon: 'drafting-compass',
    url: '',
    status: 'available',
    openMode: 'new-tab',
  },
  {
    id: 'structural-analysis',
    name: 'Structural Analysis',
    nameTh: 'วิเคราะห์โครงสร้าง',
    description: 'Access structural engineering analysis tools.',
    descriptionTh: 'เข้าถึงเครื่องมือวิเคราะห์งานวิศวกรรมโครงสร้าง',
    category: 'engineering',
    icon: 'building',
    url: '',
    status: 'available',
    openMode: 'new-tab',
  },
  {
    id: 'siteview-360',
    name: 'Crystal SiteView 360',
    nameTh: 'Crystal SiteView 360',
    description: 'Review construction sites through 360-degree views.',
    descriptionTh: 'ตรวจดูหน้างานก่อสร้างด้วยภาพมุมมอง 360 องศา',
    category: 'engineering',
    icon: 'rotate-3d',
    url: 'https://crystalengineeringcorporation.github.io/siteview-360/',
    status: 'available',
    openMode: 'new-tab',
  },

  // ---------- Business Management ----------
  {
    id: 'procurement',
    name: 'Procurement',
    nameTh: 'จัดซื้อจัดจ้าง',
    description: 'Manage purchasing and procurement workflows.',
    descriptionTh: 'จัดการงานจัดซื้อและขั้นตอนการจัดซื้อจัดจ้าง',
    category: 'business',
    icon: 'shopping-cart',
    url: '',
    status: 'available',
    openMode: 'new-tab',
  },
  {
    id: 'documents',
    name: 'Documents',
    nameTh: 'เอกสาร',
    description: 'Access company documents and project files.',
    descriptionTh: 'เข้าถึงเอกสารของบริษัทและไฟล์โครงการ',
    category: 'business',
    icon: 'file-text',
    url: '',
    status: 'available',
    openMode: 'new-tab',
    featured: true,
  },
  {
    id: 'hr-salary',
    name: 'HR & Salary',
    nameTh: 'บุคคลและเงินเดือน',
    description: 'Access workforce and salary-management tools.',
    descriptionTh: 'เข้าถึงเครื่องมือบริหารบุคลากรและเงินเดือน',
    category: 'business',
    icon: 'users',
    url: '',
    status: 'available',
    openMode: 'new-tab',
  },
  {
    id: 'equipment-materials',
    name: 'Equipment & Materials',
    nameTh: 'เครื่องจักรและวัสดุ',
    description: 'Manage equipment and material-related information.',
    descriptionTh: 'จัดการข้อมูลเครื่องจักร อุปกรณ์ และวัสดุ',
    category: 'business',
    icon: 'truck',
    url: '',
    status: 'available',
    openMode: 'new-tab',
  },
  {
    id: 'finance',
    name: 'Finance',
    nameTh: 'การเงิน',
    description: 'Access financial and cost-management tools.',
    descriptionTh: 'เข้าถึงเครื่องมือด้านการเงินและการบริหารต้นทุน',
    category: 'business',
    icon: 'wallet',
    url: '',
    status: 'available',
    openMode: 'new-tab',
  },

  // ---------- AI & Digital Tools ----------
  {
    id: 'crystal-ai-assistant',
    name: 'Crystal AI Assistant',
    nameTh: 'Crystal AI Assistant',
    description:
      'Use AI to support engineering, reporting, document preparation, and project-related tasks.',
    descriptionTh: 'ใช้ AI ช่วยงานวิศวกรรม การจัดทำรายงาน การเตรียมเอกสาร และงานที่เกี่ยวข้องกับโครงการ',
    category: 'ai',
    icon: 'bot',
    url: '',
    status: 'available',
    openMode: 'new-tab',
    featured: true,
    defaultFavorite: true,
  },
  {
    id: 'html-opener',
    name: 'Html-Opener',
    nameTh: 'เปิดไฟล์ HTML',
    description: 'Open an .html file or paste HTML code and preview it instantly, including on iPhone.',
    descriptionTh: 'เปิดไฟล์ .html หรือวางโค้ด HTML แล้วดูผลได้ทันที ใช้งานบนไอโฟนได้',
    category: 'ai',
    icon: 'file-code',
    url: 'https://crystalengineeringcorporation.github.io/Html-Opener/',
    status: 'available',
    openMode: 'new-tab',
  },
];
