import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Resume } from '../../../core/models/resume.model';

@Component({
  selector: 'app-template-nova',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-nova.component.html',
  styleUrl: './template-nova.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateNovaComponent {
  @Input({ required: true }) resume!: Resume;
}

