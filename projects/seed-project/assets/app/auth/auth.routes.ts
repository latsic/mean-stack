import { Routes } from "@angular/router";
import { SignupComponent } from "./signup.component";
import { LogoutComponent } from "./logout.component";
import { SigninComponent } from "./signin.component";

export const AUTH_ROUTES: Routes = [
  
  { path: '', redirectTo: '', pathMatch: 'full'},
  { path: 'signup', component: SignupComponent},
  { path: 'signin', component: SigninComponent},
  { path: 'logout', component: LogoutComponent}

];

