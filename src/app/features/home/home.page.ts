import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TemplateRegistryService } from '../../core/services/template-registry.service';
import { TemplateAtlasComponent } from '../resume-builder/templates/template-atlas.component';
import { TemplateNovaComponent } from '../resume-builder/templates/template-nova.component';
import { Resume, ResumeTemplateId } from '../../core/models/resume.model';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    TemplateAtlasComponent,
    TemplateNovaComponent
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class HomePage {
  private readonly templatesRegistry = inject(TemplateRegistryService);

  readonly templates = this.templatesRegistry.list();

  // Sample resume data for preview - created once and reused
  private readonly previewResumeAtlas: Resume = {
    templateId: 'atlas',
    personal: {
      firstName: 'John',
      lastName: 'Doe',
      headline: 'Software Engineer',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, USA',
      summary: 'Experienced software engineer with a passion for building innovative solutions.'
    },
    education: [
      {
        school: 'University of Technology',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startDate: '2018',
        endDate: '2022'
      }
    ],
    experience: [
      {
        company: 'Tech Solutions Inc.',
        role: 'Senior Software Engineer',
        startDate: '2022',
        endDate: 'Present',
        description: 'Leading development of cloud-based applications.'
      }
    ],
    skills: [
      { name: 'JavaScript', level: 'Expert' },
      { name: 'TypeScript', level: 'Avancé' },
      { name: 'Angular', level: 'Avancé' }
    ],
    languages: [
      { name: 'English', level: 'Natif' },
      { name: 'French', level: 'B2' }
    ],
    interests: ['Reading', 'Traveling', 'Photography'],
    updatedAtIso: new Date().toISOString()
  };

  private readonly previewResumeNova: Resume = {
    ...this.previewResumeAtlas,
    templateId: 'nova'
  };

  // Sample resume data for preview
  getPreviewResume(templateId: ResumeTemplateId): Resume {
    return templateId === 'atlas' ? this.previewResumeAtlas : this.previewResumeNova;
  }
}

