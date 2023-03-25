import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  form: FormGroup = this.initializeForm();

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
  }

  initializeForm() {
    return this.fb.group({
      email: ['']
    })
  }

  async onSubmit() {
    if (this.form.valid) {
      try {
        const { email } = this.form.value;
        const resetPasswordResult = await this.authService.resetPassword(email.toLowerCase());

        if(resetPasswordResult) {
          alert('Passwort zurücksetzen angefordert');
          this.router.navigateByUrl('/auth/login');
        } else {
          alert('Passwort zurücksetzen Anfrage konnte nicht verarbeitet werden!');
        }
      } catch(error: any) {
        alert(error.message);
      }
    }
  }
}
