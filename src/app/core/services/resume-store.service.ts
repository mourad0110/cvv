import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EMPTY_RESUME, Resume, ResumeTemplateId } from '../models/resume.model';
import { TemplateRegistryService } from './template-registry.service';

@Injectable({ providedIn: 'root' })
export class ResumeStoreService {
  private readonly storageKey = 'cv-builder:resume:v1';
  private readonly resumeSubject = new BehaviorSubject<Resume>(this.createDefault());

  readonly resume$ = this.resumeSubject.asObservable();

  constructor(private readonly templates: TemplateRegistryService) {
    const loaded = this.tryLoad();
    if (loaded) this.resumeSubject.next(loaded);
  }

  get snapshot(): Resume {
    return this.resumeSubject.value;
  }

  setTemplate(templateId: ResumeTemplateId): void {
    this.setResume({ ...this.snapshot, templateId });
  }

  setResume(resume: Resume): void {
    const next: Resume = { ...resume, updatedAtIso: new Date().toISOString() };
    this.resumeSubject.next(next);
    this.save();
  }

  reset(templateId: ResumeTemplateId = 'atlas'): void {
    this.setResume({ ...this.createDefault(), templateId });
  }

  save(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.snapshot));
    } catch {
      // ignore storage errors (private mode, quotas, etc.)
    }
  }

  private tryLoad(): Resume | null {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Partial<Resume> | null;
      if (!parsed || typeof parsed !== 'object') return null;
      if (!this.templates.isValid((parsed as Resume).templateId)) return null;
      const templateId = (parsed as Resume).templateId as ResumeTemplateId;
      return {
        ...this.createDefault(),
        ...parsed,
        templateId,
        personal: { ...EMPTY_RESUME.personal, ...(parsed.personal ?? {}) },
        education: Array.isArray(parsed.education) ? parsed.education : [],
        experience: Array.isArray(parsed.experience) ? parsed.experience : [],
        skills: Array.isArray(parsed.skills) ? parsed.skills : [],
        languages: Array.isArray(parsed.languages) ? parsed.languages : [],
        interests: Array.isArray(parsed.interests) ? parsed.interests : []
      } as Resume;
    } catch {
      return null;
    }
  }

  private createDefault(): Resume {
    return { ...EMPTY_RESUME, updatedAtIso: new Date().toISOString() };
  }
}

