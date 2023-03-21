import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-reset-apply',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatFormFieldModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './reset-apply.component.html',
  styleUrls: ['./reset-apply.component.scss']
})
export class ResetApplyComponent {
  form: FormGroup = this.initializeForm();
  hidePw = true;

  constructor(private fb: FormBuilder, private authService: AuthService) {
  }

  initializeForm(): FormGroup {
    return this.fb.group({
      password: [''],
      password_confirm: ['']
    })
  }

  onSubmit() {
    if (this.form.valid) {
      const { password, password_confirm } = this.form.value;
    }
  }

  toggleHide() {
    this.hidePw = !this.hidePw;
  }

  getVisibilityIcon(): string {
    return this.hidePw ? 'visibility' : 'visibility_off';
  }

  getInputType(): string {
    return this.hidePw ? 'password' : 'text';
  }
}
