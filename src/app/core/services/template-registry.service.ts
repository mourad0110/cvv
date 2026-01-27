import { Injectable } from '@angular/core';
import { ResumeTemplateId } from '../models/resume.model';

export interface ResumeTemplateMeta {
  id: ResumeTemplateId;
  name: string;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class TemplateRegistryService {
  private readonly templates: ResumeTemplateMeta[] = [
    {
      id: 'atlas',
      name: 'Atlas (Moderne)',
      description: 'En-tête coloré, sections très lisibles, parfait pour la plupart des profils.'
    },
    {
      id: 'nova',
      name: 'Nova (Minimal)',
      description: 'Typographie élégante et espacements soignés, idéal pour un rendu sobre.'
    }
  ];

  list(): ResumeTemplateMeta[] {
    return this.templates;
  }

  isValid(id: string | null | undefined): id is ResumeTemplateId {
    return id === 'atlas' || id === 'nova';
  }

  get(id: ResumeTemplateId): ResumeTemplateMeta {
    const found = this.templates.find((t) => t.id === id);
    if (!found) throw new Error(`Unknown template id: ${id}`);
    return found;
  }
}

