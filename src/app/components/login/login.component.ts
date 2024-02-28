import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Store, select } from '@ngrx/store';
import { login } from '../../store/podcasts.actions';
import { AppState } from 'src/app/store/app.state';
import { selectLoggedIn } from 'src/app/store/podcasts.reducer';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router, private store: Store<AppState>) { }
  onSubmit(): void {
    console.log('Form submitted')
    this.store.dispatch(login({ username: this.username, password: this.password }));
    const loggedIn = this.store.pipe(select(selectLoggedIn));
    loggedIn.subscribe((loggedIn) => {
      if (loggedIn) {
        this.router.navigate(['/podcasts']);
      } else {
        // Set error text

      }
    });
  }
}
