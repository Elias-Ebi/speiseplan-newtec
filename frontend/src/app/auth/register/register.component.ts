import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from "@angular/material/input";
import { Router, RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { AuthService } from "../../shared/services/auth.service";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, MatInputModule, RouterLink, MatButtonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  form: FormGroup = this.initializeForm();

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
  }

  initializeForm(): FormGroup {
    return this.fb.group({
      email: [''],
      name: [''],
      password: ['']
    })
  }

  onSubmit() {
    if (this.form.valid) {
      const {email, name, password} = this.form.value;
      this.authService.register(email, name, password).then(() => {
          alert('Account erfolgreich erstellt!');
          this.router.navigateByUrl('/auth/login');
        }
      ).catch((error: HttpErrorResponse) => {
        alert(error.error.message)
      })
    }
  }
}
