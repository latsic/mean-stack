import { User } from "./user.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, catchError} from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable()
export class AuthService {

  baseUrl: string = 'http://localhost:3000/';

  constructor(private httpClient: HttpClient) {

  }

  signup(user: User) {

    const myHeaders = new HttpHeaders();
    myHeaders.set("Content-Type", "application/json");

    return this.httpClient.post(
      this.baseUrl + 'user',
      user,
      {
        headers: myHeaders,
        responseType: "json"
      }
    ).pipe(
      map((result: any) => result),
      catchError((errorResponse) => {
        console.log("http post message error", errorResponse);
        return throwError(errorResponse.error);
      })
    );
  }

  signin(user: User) {
    const myHeaders = new HttpHeaders();
    myHeaders.set("Content-Type", "application/json");

    return this.httpClient.post(
      this.baseUrl + 'user/signin',

      user,
      {
        headers: myHeaders,
        responseType: "json",
      }
    ).pipe(
      map((result: any) => {
        console.log("signin success response", result);
        return result;
      }),
      catchError((errorResponse) => {
        console.log("http post message error", errorResponse.error);
        return throwError(errorResponse.error);
      })
    );
  }

  logout() {
    localStorage.clear();
  }

  isAuthenticated(): boolean {
    return  localStorage.getItem('userId') != null &&
            localStorage.getItem('token') != null;
  }
}