import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) { }
  onSubmit(): void {
    console.log('Form submitted')
    this.authService.login(this.username, this.password).subscribe(
      (response: any) => {
        console.log('Login success:', response);
        if (response) {
          localStorage.setItem('access_token', response);
          // Navigate to the home page
          this.router.navigate(['/podcasts']);
        } else {
          // Show an error message
        }
      }
    );
  }
}
