import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  computed,
  effect,
  inject,
  OnDestroy,
  signal
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { PdfService } from '../../core/services/pdf.service';
import {
  EducationItem,
  ExperienceItem,
  LanguageItem,
  Resume,
  ResumeTemplateId,
  SkillItem,
  StageItem
} from '../../core/models/resume.model';
import { ResumeStoreService } from '../../core/services/resume-store.service';
import { TemplateRegistryService, ResumeTemplateMeta } from '../../core/services/template-registry.service';
import { TemplateAtlasComponent } from './templates/template-atlas.component';
import { TemplateNovaComponent } from './templates/template-nova.component';

@Component({
  selector: 'app-builder-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    TemplateAtlasComponent,
    TemplateNovaComponent
  ],
  templateUrl: './builder.page.html',
  styleUrl: './builder.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuilderPage implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly templates = inject(TemplateRegistryService);
  readonly store = inject(ResumeStoreService);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);
  private readonly pdf = inject(PdfService);

  private readonly destroy$ = new Subject<void>();

  @ViewChild('resumePreview', { static: false })
  private resumePreview?: ElementRef<HTMLElement>;

  readonly templateId = computed(() => this.route.snapshot.paramMap.get('templateId'));
  readonly availableTemplates = this.templates.list();
  readonly currentTemplate = computed(() => {
    const id = this.templateId();
    return id ? this.templates.get(id as ResumeTemplateId) : null;
  });
  readonly currentResume = toSignal(this.store.resume$, { initialValue: this.store.snapshot });
  readonly currentTemplateId = computed(() => this.currentResume()?.templateId ?? 'atlas');

  readonly form = this.fb.group({
    personal: this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      photoDataUrl: [''],
      headline: [''],
      email: ['', [Validators.email]],
      phone: [''],
      location: [''],
      website: [''],
      linkedIn: [''],
      github: [''],
      summary: ['']
    }),
    educationStep: this.fb.group({
      items: this.fb.array([])
    }),
    experienceStep: this.fb.group({
      items: this.fb.array([])
    }),
    stageStep: this.fb.group({
      items: this.fb.array([])
    }),
    skillsStep: this.fb.group({
      items: this.fb.array([])
    }),
    languagesStep: this.fb.group({
      items: this.fb.array([])
    }),
    interestsStep: this.fb.group({
      items: this.fb.array([])
    })
  });

  constructor() {
    // Check if we're loading an existing resume from route state
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || history.state;
    
    if (state && state.resumeId && state.resume) {
      // Load existing resume for editing
      const resume = state.resume as Resume;
      (resume as any).id = state.resumeId;
      this.store.setResume(resume);
      this.hydrateFromResume(resume);
    } else {
      // Créer un nouveau CV : afficher un formulaire vide (pas les anciennes données)
      const tid = this.templateId();
      if (tid && this.templates.isValid(tid)) {
        this.store.reset(tid as ResumeTemplateId);
      }
      this.hydrateFromResume(this.store.snapshot);
    }

    effect(() => {
      const id = this.templateId();
      if (!this.templates.isValid(id)) {
        this.router.navigateByUrl('/');
        return;
      }
      const templateId = id as ResumeTemplateId;
      // Only update template if it's different from current store template
      // But don't override if user is switching templates manually or loading existing resume
      if (this.store.snapshot.templateId !== templateId && !this.isSwitchingTemplate && !state?.resumeId) {
        this.store.setTemplate(templateId);
      }
    });

    // live preview + autosave
    this.form.valueChanges
      .pipe(debounceTime(80), takeUntil(this.destroy$))
      .subscribe(() => this.store.setResume(this.buildResumeFromForm()));
  }

  private isSwitchingTemplate = false;

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get educationArray(): FormArray {
    return this.form.get('educationStep.items') as FormArray;
  }

  get experienceArray(): FormArray {
    return this.form.get('experienceStep.items') as FormArray;
  }

  get stageArray(): FormArray {
    return this.form.get('stageStep.items') as FormArray;
  }

  get skillsArray(): FormArray {
    return this.form.get('skillsStep.items') as FormArray;
  }

  get languagesArray(): FormArray {
    return this.form.get('languagesStep.items') as FormArray;
  }

  get interestsArray(): FormArray {
    return this.form.get('interestsStep.items') as FormArray;
  }

  addEducation(item?: Partial<EducationItem>): void {
    this.educationArray.push(this.createEducationGroup(item));
  }

  removeEducation(index: number): void {
    this.educationArray.removeAt(index);
  }

  addExperience(item?: Partial<ExperienceItem>): void {
    this.experienceArray.push(this.createExperienceGroup(item));
  }

  removeExperience(index: number): void {
    this.experienceArray.removeAt(index);
  }

  addStage(item?: Partial<StageItem>): void {
    this.stageArray.push(this.createStageGroup(item));
  }

  removeStage(index: number): void {
    this.stageArray.removeAt(index);
  }

  addSkill(item?: Partial<SkillItem>): void {
    this.skillsArray.push(this.createSkillGroup(item));
  }

  removeSkill(index: number): void {
    this.skillsArray.removeAt(index);
  }

  addLanguage(item?: Partial<LanguageItem>): void {
    this.languagesArray.push(this.createLanguageGroup(item));
  }

  removeLanguage(index: number): void {
    this.languagesArray.removeAt(index);
  }

  addInterest(value = ''): void {
    this.interestsArray.push(this.fb.control(value));
  }

  async onPhotoSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.snackBar.open('Veuillez sélectionner une image.', 'OK', { duration: 2200 });
      return;
    }

    try {
      const dataUrl = await this.readFileAsDataUrl(file);
      const resized = await this.resizeImageDataUrl(dataUrl, 320, 0.85);
      this.form.controls.personal.patchValue({ photoDataUrl: resized });
      // allow re-uploading same file
      if (input) input.value = '';
    } catch {
      this.snackBar.open('Impossible de charger l’image.', 'OK', { duration: 2200 });
    }
  }

  removePhoto(): void {
    this.form.controls.personal.patchValue({ photoDataUrl: '' });
  }

  removeInterest(index: number): void {
    this.interestsArray.removeAt(index);
  }

  resetAll(): void {
    this.store.reset(this.store.snapshot.templateId);
    this.hydrateFromResume(this.store.snapshot);
    this.snackBar.open('CV réinitialisé.', 'OK', { duration: 1800 });
  }

  saveNow(): void {
    this.store.saveToBackend().subscribe({
      next: (saved) => {
        // Update store with saved resume (includes ID from backend)
        this.store.setResume(saved);
        this.snackBar.open('CV sauvegardé dans la base de données.', 'OK', { duration: 2000 });
      },
      error: (error) => {
        console.error('Error saving:', error);
        const msg =
          error?.status === 0 || error?.status === undefined
            ? 'Serveur inaccessible. Démarrez le backend (port 8080) puis réessayez.'
            : `Erreur lors de la sauvegarde (${error?.status ?? '?'}).`;
        this.snackBar.open(msg, 'OK', { duration: 5000 });
      }
    });
  }

  async downloadPdf(): Promise<void> {
    const el = this.resumePreview?.nativeElement;
    if (!el) return;
    const name = `${this.store.snapshot.personal.firstName ?? ''} ${this.store.snapshot.personal.lastName ?? ''}`
      .trim()
      .replace(/\s+/g, '_');
    const fileName = name ? `${name}_CV.pdf` : 'cv.pdf';
    await this.pdf.exportElementToPdf(el, fileName);
  }

  print(): void {
    window.print();
  }

  switchTemplate(newTemplateId: ResumeTemplateId): void {
    const currentStoreTemplate = this.store.snapshot.templateId;
    if (newTemplateId === currentStoreTemplate) {
      return; // Already on this template
    }

    // Set flag to prevent effect from interfering
    this.isSwitchingTemplate = true;

    // Save current resume data before switching
    const currentResume = this.buildResumeFromForm();
    
    // Update the resume with new template ID
    const updatedResume: Resume = {
      ...currentResume,
      templateId: newTemplateId,
      updatedAtIso: new Date().toISOString()
    };
    
    // Update store with new template and resume - this will immediately update the preview
    this.store.setResume(updatedResume);
    
    // Update URL without page reload using history API
    const newUrl = `/builder/${newTemplateId}`;
    window.history.replaceState({}, '', newUrl);
    
    // Reset flag after a short delay
    setTimeout(() => {
      this.isSwitchingTemplate = false;
    }, 100);
  }

  private hydrateFromResume(resume: Resume): void {
    // prevent feedback loop on init/reset
    this.form.patchValue(
      {
        personal: resume.personal
      },
      { emitEvent: false }
    );

    this.educationArray.clear({ emitEvent: false });
    (resume.education ?? []).forEach((e) => this.addEducation(e));

    this.experienceArray.clear({ emitEvent: false });
    (resume.experience ?? []).forEach((e) => this.addExperience(e));

    this.stageArray.clear({ emitEvent: false });
    (resume.stages ?? []).forEach((s) => this.addStage(s));

    this.skillsArray.clear({ emitEvent: false });
    (resume.skills ?? []).forEach((s) => this.addSkill(s));

    this.languagesArray.clear({ emitEvent: false });
    (resume.languages ?? []).forEach((l) => this.addLanguage(l));

    this.interestsArray.clear({ emitEvent: false });
    (resume.interests ?? []).forEach((i) => this.addInterest(i));

    if (this.educationArray.length === 0) this.addEducation();
    if (this.experienceArray.length === 0) this.addExperience();
    if (this.stageArray.length === 0) this.addStage();
    if (this.skillsArray.length === 0) this.addSkill();
    if (this.languagesArray.length === 0) this.addLanguage();

    // keep store aligned
    this.store.setResume(this.buildResumeFromForm());
  }

  private buildResumeFromForm(): Resume {
    const raw = this.form.getRawValue();
    const resume = {
      templateId: this.store.snapshot.templateId,
      personal: {
        firstName: raw.personal?.firstName ?? '',
        lastName: raw.personal?.lastName ?? '',
        photoDataUrl: raw.personal?.photoDataUrl ?? '',
        headline: raw.personal?.headline ?? '',
        email: raw.personal?.email ?? '',
        phone: raw.personal?.phone ?? '',
        location: raw.personal?.location ?? '',
        website: raw.personal?.website ?? '',
        linkedIn: raw.personal?.linkedIn ?? '',
        github: raw.personal?.github ?? '',
        summary: raw.personal?.summary ?? ''
      },
      education: (raw.educationStep?.items ?? []).filter(Boolean) as EducationItem[],
      experience: (raw.experienceStep?.items ?? []).filter(Boolean) as ExperienceItem[],
      stages: (raw.stageStep?.items ?? []).filter(Boolean) as StageItem[],
      skills: (raw.skillsStep?.items ?? []).filter(Boolean) as SkillItem[],
      languages: (raw.languagesStep?.items ?? []).filter(Boolean) as LanguageItem[],
      interests: (raw.interestsStep?.items ?? []).filter(
        (x): x is string => typeof x === 'string' && x.trim().length > 0
      ),
      updatedAtIso: this.store.snapshot.updatedAtIso
    } as Resume;
    
    // Preserve ID if editing existing resume
    if ((this.store.snapshot as any).id) {
      (resume as any).id = (this.store.snapshot as any).id;
    }
    
    return resume;
  }

  private createEducationGroup(item?: Partial<EducationItem>) {
    return this.fb.group({
      school: [item?.school ?? '', [Validators.required]],
      degree: [item?.degree ?? ''],
      field: [item?.field ?? ''],
      location: [item?.location ?? ''],
      startDate: [item?.startDate ?? ''],
      endDate: [item?.endDate ?? ''],
      description: [item?.description ?? '']
    });
  }

  private createExperienceGroup(item?: Partial<ExperienceItem>) {
    return this.fb.group({
      company: [item?.company ?? '', [Validators.required]],
      role: [item?.role ?? ''],
      location: [item?.location ?? ''],
      startDate: [item?.startDate ?? ''],
      endDate: [item?.endDate ?? ''],
      description: [item?.description ?? '']
    });
  }

  private createStageGroup(item?: Partial<StageItem>) {
    return this.fb.group({
      intitule: [item?.intitule ?? '', [Validators.required]],
      entreprise: [item?.entreprise ?? '', [Validators.required]],
      duree: [item?.duree ?? ''],
      description: [item?.description ?? '']
    });
  }

  private createSkillGroup(item?: Partial<SkillItem>) {
    return this.fb.group({
      name: [item?.name ?? '', [Validators.required]],
      level: [item?.level ?? 'Intermédiaire']
    });
  }

  private createLanguageGroup(item?: Partial<LanguageItem>) {
    return this.fb.group({
      name: [item?.name ?? '', [Validators.required]],
      level: [item?.level ?? 'B2']
    });
  }

  private readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('read_error'));
      reader.onload = () => resolve(String(reader.result ?? ''));
      reader.readAsDataURL(file);
    });
  }

  private resizeImageDataUrl(dataUrl: string, maxSizePx: number, quality: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(maxSizePx / img.width, maxSizePx / img.height, 1);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }

        ctx.drawImage(img, 0, 0, w, h);
        const out = canvas.toDataURL('image/jpeg', quality);
        resolve(out);
      };
      img.onerror = () => reject(new Error('img_error'));
      img.src = dataUrl;
    });
  }
}

