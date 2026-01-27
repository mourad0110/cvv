export type ResumeTemplateId = 'atlas' | 'nova';

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  /**
   * Base64 Data URL for profile photo (stored locally).
   * Example: "data:image/jpeg;base64,..."
   */
  photoDataUrl?: string;
  headline?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedIn?: string;
  github?: string;
  summary?: string;
}

export interface EducationItem {
  school: string;
  degree?: string;
  field?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface ExperienceItem {
  company: string;
  role?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  highlights?: string[];
}

export interface SkillItem {
  name: string;
  level?: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert';
}

export interface LanguageItem {
  name: string;
  level?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Natif';
}

export interface Resume {
  templateId: ResumeTemplateId;
  personal: PersonalInfo;
  education: EducationItem[];
  experience: ExperienceItem[];
  skills: SkillItem[];
  languages: LanguageItem[];
  interests: string[];
  updatedAtIso: string;
}

export const EMPTY_RESUME: Resume = {
  templateId: 'atlas',
  personal: {
    firstName: '',
    lastName: '',
    photoDataUrl: '',
    headline: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedIn: '',
    github: '',
    summary: ''
  },
  education: [],
  experience: [],
  skills: [],
  languages: [],
  interests: [],
  updatedAtIso: new Date(0).toISOString()
};

