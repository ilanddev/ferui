import { RouterModule, Routes } from '@angular/router';
import { IconsDemo } from './icons.demo';
import { ModuleWithProviders } from '@angular/core';

const ROUTES: Routes = [{ path: '', component: IconsDemo }];

export const ROUTING: ModuleWithProviders = RouterModule.forChild(ROUTES);
