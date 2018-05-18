import { Component } from "@angular/core";
import { AuthService } from "./auth.service";

@Component({
  selector: 'app-component',
  templateUrl: 'authentication.component.html'
})
export class AuthenticationComponent {

  constructor(private authService: AuthService) {
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  getUserEmail() {
    return localStorage.getItem('email');
  }


}