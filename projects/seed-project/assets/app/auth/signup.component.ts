import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthService } from "./auth.service";
import { User } from "./user.model";
import { Router } from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: 'signup.component.html'
})
export class SignupComponent implements OnInit {

  myForm: FormGroup;
  errorMsg: string  = null;
  
  constructor(
    private authService: AuthService,
    private router: Router) {

  }

  ngOnInit() {
    this.myForm = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      email: new FormControl(null, [
        Validators.required,
        Validators.email]),
      password: new FormControl(null, Validators.required)
    });

    this.errorMsg = null;
  }

  onSubmit() {

      const user = new User(
        this.myForm.value.email,
        this.myForm.value.password,
        this.myForm.value.firstName,
        this.myForm.value.lastName,
      );

      this.authService.signup(user).subscribe(
        (data => {
          console.log("sign up success", data);
          this.myForm.reset();
          this.router.navigate(['/auth','signin']);
        }),
        (errorInfo => {
          console.log("sign up error", errorInfo);
          this.errorMsg = errorInfo.title;
          console.log(this.errorMsg);
        })
      );
      
  }

}