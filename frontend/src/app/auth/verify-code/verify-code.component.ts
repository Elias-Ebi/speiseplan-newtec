import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-verify-code',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.scss']
})
export class VerifyCodeComponent {
  form: FormGroup = this.initializeForm();
  form2: FormGroup = this.initializeForm2();
  hidePw: boolean = true;
  isNotVerified: boolean = true;
  code: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
  }

  initializeForm() {
    return this.fb.group({
      code: {value: '', disabled: false}
    })
  }

  initializeForm2() {
    return this.fb.group({
      password: {value: '', disabled: true},
      password_confirm: {value: '', disabled: true},
    })
  }

  async verify() {
    if (this.form.valid) {
      const { code } = this.form.value;
      await this.authService.checkVerificationCode(code).then((res) => {
        if (res) {
          this.isNotVerified = false;
          this.form2.enable();
          this.form.disable();
          this.code = code;
          alert("Verifikationscode ist korrekt! Bitte neues Passwort eingeben.");
        } else {
          alert("Verifikationscode ist falsch! Bitte erneut eingeben.");
        }
      });
    }
  }

  async onSubmit() {
    if(this.form2.valid) {
      const { password, password_confirm } = this.form2.value;
      if(password === password_confirm) {
        await this.authService.setNewPasswordFromVerificationCode(this.code, password).then((res) => {
          if (res) {
            alert("Passwort wurde erfolgreich geändert! Bitte einloggen.");
            this.router.navigateByUrl('/auth/login');
          } else {
            alert("Passwort konnte nicht geändert werden!");
          }
        });
      } else {
        alert("Passwörter stimmen nicht überein!");
      }
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
