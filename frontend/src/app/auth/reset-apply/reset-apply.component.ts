import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-reset-apply',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './reset-apply.component.html',
  styleUrls: ['./reset-apply.component.scss'],
})
export class ResetApplyComponent implements OnInit {
  form: FormGroup = this.initializeForm();
  hidePw: boolean = true;
  PASSWORD_LENGTH: number = 8;
  token: string = "";

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private activeRoute: ActivatedRoute
  ) {}

  async ngOnInit() {
    await this.activeRoute.params.subscribe((param) => {
      if (typeof param['token'] === 'string') {
        this.token = param['token'];
      }
    });
  }

  initializeForm(): FormGroup {
    return this.fb.group({
      password: [''],
      password_confirm: [''],
    });
  }

  async setNewPassword() {
    if (this.form.valid) {
      const { password, password_confirm } = this.form.value;
      if (password === password_confirm) {
        await this.authService
          .setNewPasswordFromResetToken(this.token, password)
          .then(() => {
            this.router.navigateByUrl('/auth/login');
          });
      }
    }
  }

  shortenPassword(password: string, len: number): string {
    let resultPassword = '';
    if (password.length > len) {
      for (let i = 0; i < len; i++) {
        if (i < password.length) {
          resultPassword += password.charAt(i);
        }
      }
      return resultPassword;
    } else {
      return password;
    }
  }

  shortenPasswordRec(password: string, len: number): string {
    if (len <= 0) {
      throw new Error('Length must be greater than 0');
    } else if (len >= password.length) {
      return password;
    } else {
      return this.shortenPasswordRec(password.slice(0, -1), len);
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
