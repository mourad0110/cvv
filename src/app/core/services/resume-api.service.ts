import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Resume } from '../models/resume.model';

@Injectable({ providedIn: 'root' })
export class ResumeApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/resumes';

  saveResume(resume: Resume): Observable<Resume> {
    // Convert Resume to backend format
    const backendResume = this.convertToBackendFormat(resume);
    
    if (backendResume.id) {
      // Update existing resume
      return this.http.put<any>(`${this.apiUrl}/${backendResume.id}`, backendResume).pipe(
        map(saved => this.convertFromBackendFormat(saved))
      );
    } else {
      // Create new resume
      return this.http.post<any>(this.apiUrl, backendResume).pipe(
        map(saved => this.convertFromBackendFormat(saved))
      );
    }
  }

  getResume(id: number): Observable<Resume> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(backendResume => this.convertFromBackendFormat(backendResume))
    );
  }

  getAllResumes(): Observable<Resume[]> {
    console.log('Fetching resumes from:', this.apiUrl);
    return this.http.get<any[]>(this.apiUrl).pipe(
      timeout(10000), // 10 second timeout
      map(resumes => {
        console.log('Raw response from backend:', resumes);
        if (!resumes || !Array.isArray(resumes)) {
          console.log('Response is not an array, returning empty array');
          return [];
        }
        console.log(`Converting ${resumes.length} resumes`);
        const converted = resumes.map(r => {
          try {
            return this.convertFromBackendFormat(r);
          } catch (error) {
            console.error('Error converting resume:', error, r);
            return null;
          }
        }).filter(r => r !== null) as Resume[];
        console.log(`Successfully converted ${converted.length} resumes`);
        return converted;
      }),
      catchError(error => {
        console.error('Error in getAllResumes:', error);
        console.error('Error details:', {
          status: error?.status,
          statusText: error?.statusText,
          message: error?.message,
          error: error?.error
        });
        return of([]); // Return empty array on error
      })
    );
  }

  deleteResume(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private convertToBackendFormat(resume: Resume): any {
    return {
      id: (resume as any).id || null,
      templateId: resume.templateId,
      personal: resume.personal,
      education: resume.education.map(e => ({
        id: (e as any).id || null,
        school: e.school,
        degree: e.degree,
        field: e.field,
        location: e.location,
        startDate: e.startDate,
        endDate: e.endDate,
        description: e.description
      })),
      experience: resume.experience.map(e => ({
        id: (e as any).id || null,
        company: e.company,
        role: e.role,
        location: e.location,
        startDate: e.startDate,
        endDate: e.endDate,
        description: e.description,
        highlights: e.highlights || []
      })),
      skills: resume.skills.map(s => ({
        id: (s as any).id || null,
        name: s.name,
        level: s.level
      })),
      languages: resume.languages.map(l => ({
        id: (l as any).id || null,
        name: l.name,
        level: l.level
      })),
      interests: resume.interests
    };
  }

  private convertFromBackendFormat(backendResume: any): Resume {
    if (!backendResume) {
      throw new Error('Invalid resume data from backend');
    }
    
    // Handle updatedAt from backend (can be LocalDateTime string or ISO string)
    let updatedAtIso: string;
    if (backendResume.updatedAt) {
      try {
        updatedAtIso = new Date(backendResume.updatedAt).toISOString();
      } catch {
        updatedAtIso = new Date().toISOString();
      }
    } else {
      updatedAtIso = new Date().toISOString();
    }
    
    const resume = {
      templateId: backendResume.templateId || 'atlas',
      personal: backendResume.personal || {},
      education: backendResume.education || [],
      experience: backendResume.experience || [],
      skills: backendResume.skills || [],
      languages: backendResume.languages || [],
      interests: backendResume.interests || [],
      updatedAtIso: updatedAtIso
    } as Resume;
    
    // Preserve the ID from backend
    if (backendResume.id) {
      (resume as any).id = backendResume.id;
    }
    
    return resume;
  }
}

