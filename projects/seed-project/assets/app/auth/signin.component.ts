import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { User } from "./user.model";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-signin',
  templateUrl: 'signin.component.html'
})
export class SigninComponent {
  myForm: FormGroup;
  errorMsgEmail: string  = null;
  errorMsgPassword: string = null;

  constructor(
    private authService: AuthService,
    private router: Router) {
  }

  ngOnInit() {
    this.myForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.email]),
      password: new FormControl(null, Validators.required)
    });

    this.resetErrorMessages();
  }

  resetErrorMessages() {
    this.errorMsgEmail = null;
    this.errorMsgPassword = null;
  }

  onSubmit() {

      const user = new User(
        this.myForm.value.email,
        this.myForm.value.password
      );

      this.authService.signin(user).subscribe(
        (data) => {
          console.log("signin successfull", data);
          console.log("signIn success", data.token);
          localStorage.setItem('token', data.token);
          localStorage.setItem('userId', data.userId);
          localStorage.setItem('email', user.email);
          this.router.navigate(['/']);

          this.myForm.reset();
          
        },
        (errorInfo) => {
          console.log("signin error", errorInfo);

          if(errorInfo.error.type == "USER") {
            this.errorMsgEmail = errorInfo.error.message;
          }
          else if(errorInfo.error.type == "PWD") {
            this.errorMsgPassword = errorInfo.error.message;
          }
          else {
            alert("An unknown error occured, please try again!");
          }
        }
      );
  }
}