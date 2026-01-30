import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage)
  },
  {
    path: 'builder/:templateId',
    loadComponent: () =>
      import('./features/resume-builder/builder.page').then((m) => m.BuilderPage)
  },
  {
    path: 'my-cvs',
    loadComponent: () => import('./features/cv-list/cv-list.page').then((m) => m.CvListPage)
  },
  { path: '**', redirectTo: '' }
];
