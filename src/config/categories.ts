import type { CategoryDefinition, CategoryId } from './types';

export const CATEGORIES: CategoryDefinition[] = [
  {
    id: 'engineering',
    name: 'Engineering & Construction',
    nameTh: 'วิศวกรรมและการก่อสร้าง',
    shortName: 'Engineering',
    shortNameTh: 'วิศวกรรม',
    description: 'Project delivery, site, estimation, scheduling and design tools.',
    descriptionTh: 'เครื่องมือด้านการบริหารโครงการ หน้างาน การประมาณราคา การวางแผน และการออกแบบ',
    icon: 'hard-hat',
  },
  {
    id: 'business',
    name: 'Business Management',
    nameTh: 'การบริหารธุรกิจ',
    shortName: 'Business',
    shortNameTh: 'ธุรกิจ',
    description: 'Procurement, documents, people, equipment and finance.',
    descriptionTh: 'จัดซื้อ เอกสาร บุคลากร เครื่องจักร และการเงิน',
    icon: 'briefcase',
  },
  {
    id: 'ai',
    name: 'AI & Digital Tools',
    nameTh: 'AI และเครื่องมือดิจิทัล',
    shortName: 'AI & Digital',
    shortNameTh: 'AI และดิจิทัล',
    description: 'Intelligent assistants and digital productivity tools.',
    descriptionTh: 'ผู้ช่วยอัจฉริยะและเครื่องมือเพิ่มประสิทธิภาพดิจิทัล',
    icon: 'sparkles',
  },
];

export function getCategory(id: CategoryId): CategoryDefinition {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];
}

export function isCategoryId(value: string | undefined): value is CategoryId {
  return CATEGORIES.some((c) => c.id === value);
}
