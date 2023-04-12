import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { AuthService } from "../../shared/services/auth.service";
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatButtonModule, RouterLink, ReactiveFormsModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup = this.initializeForm();
  hidePw = true;
  passwordInvalid = false;
  emailInvalid = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
  }

  initializeForm(): FormGroup {
    return this.fb.group({
      email: [''],
      password: ['']
    })
  }

  onSubmit() {
    if (this.form.valid) {
      const { email, password } = this.form.value;
      if (!this.emailIsValid(email)) {
        this.form.controls['email'].setValue('');
        this.emailInvalid = true;
        if (this.form.controls['password'].value != '') {
          this.passwordInvalid = true;
        }
        this.form.controls['password'].setValue('');
        return;
      }

      this.authService.login(email.toLowerCase(), password).catch(() => {
        //alert('Login nicht möglich')
        this.form.controls['password'].setValue('');
        this.passwordInvalid = true;
      })
    } else {
      this.form.controls['password'].setValue('');
      if (this.form.controls['email'].value == '' || !this.emailIsValid(this.form.controls['email'].value)) {
        this.emailInvalid = true;
        this.form.controls['email'].setValue('');
      }
      this.passwordInvalid = true;
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

  emailIsValid(email: string): boolean {
    return /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(email.toLowerCase());
  }

}
