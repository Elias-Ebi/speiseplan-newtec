import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { AuthService } from "../../shared/services/auth.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatButtonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup = this.initializeForm();

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
      const {email, password} = this.form.value;
      this.authService.login(email, password).catch(() => {
        alert('Login nicht möglich')
      })
    }
  }
}
