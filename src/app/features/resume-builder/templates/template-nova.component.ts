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

  /** Pourcentage pour la barre de niveau de langue (A1..C2, Natif). */
  getLangPercent(level?: string): number {
    if (!level) return 50;
    const map: Record<string, number> = {
      A1: 20, A2: 35, B1: 50, B2: 65, C1: 85, C2: 95, Natif: 100
    };
    return map[level] ?? 50;
  }

  /** Découpe la description en lignes pour affichage en puces. */
  getDescriptionLines(text: string): string[] {
    if (!text || !text.trim()) return [];
    return text.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  }
}

