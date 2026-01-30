import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ResumeApiService } from '../../core/services/resume-api.service';

interface ResumeListItem {
  id: number;
  templateId: string;
  firstName: string;
  lastName: string;
  email?: string;
  photoDataUrl?: string;
  updatedAt: string;
}

@Component({
  selector: 'app-cv-list-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './cv-list.page.html',
  styleUrl: './cv-list.page.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class CvListPage implements OnInit {
  private readonly apiService = inject(ResumeApiService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly cdr = inject(ChangeDetectorRef);

  resumes: ResumeListItem[] = [];
  displayedColumns: string[] = ['name', 'template', 'email', 'updated', 'actions'];
  loading = true;

  ngOnInit(): void {
    this.loadResumes();
  }

  loadResumes(): void {
    this.loading = true;
    console.log('Starting to load resumes...');
    this.apiService.getAllResumes().subscribe({
      next: (resumes) => {
        console.log('Successfully loaded resumes:', resumes);
        this.resumes = resumes.map(r => {
          const mapped = {
            id: (r as any).id,
            templateId: r.templateId,
            firstName: r.personal?.firstName || '',
            lastName: r.personal?.lastName || '',
            email: r.personal?.email,
            photoDataUrl: r.personal?.photoDataUrl,
            updatedAt: r.updatedAtIso || new Date().toISOString()
          };
          console.log('Mapped resume item:', mapped);
          return mapped;
        });
        console.log('Mapped resumes array:', this.resumes);
        console.log('Resumes length:', this.resumes.length);
        this.loading = false;
        this.cdr.detectChanges(); // Force change detection
      },
      error: (error) => {
        console.error('Error loading resumes:', error);
        console.error('Full error object:', JSON.stringify(error, null, 2));
        const errorMessage = error?.error?.message || error?.message || 'Erreur de connexion au serveur';
        this.snackBar.open(`Erreur: ${errorMessage}. Vérifiez que le backend est démarré sur http://localhost:8080`, 'OK', { duration: 5000 });
        this.loading = false;
        this.resumes = []; // Set empty array on error
      },
      complete: () => {
        console.log('getAllResumes observable completed');
        console.log('Final loading state:', this.loading);
        console.log('Final resumes count:', this.resumes.length);
        this.cdr.detectChanges(); // Force change detection on complete
      }
    });
  }

  editResume(id: number): void {
    this.apiService.getResume(id).subscribe({
      next: (resume) => {
        // Navigate to builder with resume data
        this.router.navigate(['/builder', resume.templateId], {
          state: { resumeId: id, resume: resume }
        });
      },
      error: (error) => {
        console.error('Error loading resume:', error);
        this.snackBar.open('Erreur lors du chargement du CV.', 'OK', { duration: 3000 });
      }
    });
  }

  deleteResume(id: number, name: string): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le CV de ${name} ?`)) {
      this.apiService.deleteResume(id).subscribe({
        next: () => {
          this.snackBar.open('CV supprimé avec succès.', 'OK', { duration: 2000 });
          this.loadResumes();
        },
        error: (error) => {
          console.error('Error deleting resume:', error);
          this.snackBar.open('Erreur lors de la suppression.', 'OK', { duration: 3000 });
        }
      });
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTemplateName(templateId: string): string {
    return templateId === 'atlas' ? 'Atlas (Moderne)' : 'Nova (Minimal)';
  }
}

