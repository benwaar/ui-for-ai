import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

/**
 * MaterialModule - Centralized Material Design component imports
 *
 * This module bundles all Material components used in the chatbot UI and agent UI:
 * - Buttons: mat-button, mat-raised-button, mat-icon-button, mat-button-toggle
 * - Forms: mat-form-field, matInput
 * - Layout: mat-card, mat-toolbar, mat-expansion-panel
 * - Indicators: mat-chip, mat-badge, mat-progress-bar, mat-spinner
 * - Interaction: mat-slide-toggle, mat-tooltip, mat-snackbar
 *
 * Import this module in standalone components to access Material components.
 */
@NgModule({
  exports: [
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatChipsModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatBadgeModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatDividerModule,
    MatListModule,
    MatToolbarModule,
    MatButtonToggleModule,
  ],
})
export class MaterialModule {}
