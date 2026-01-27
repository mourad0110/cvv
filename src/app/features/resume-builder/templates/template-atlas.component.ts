import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Resume } from '../../../core/models/resume.model';

@Component({
  selector: 'app-template-atlas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-atlas.component.html',
  styleUrl: './template-atlas.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateAtlasComponent {
  @Input({ required: true }) resume!: Resume;
}

