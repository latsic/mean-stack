import { Component, OnInit, OnDestroy } from "@angular/core";
import { Error } from "./error.model";
import { ErrorService } from "./error.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-error',
  templateUrl: 'error.component.html',
  styleUrls: ['error.component.css']
})
export class ErrorComponent implements OnInit, OnDestroy{

  error: Error;
  displayStyle: string = 'none';
  errorSubscription: Subscription;

  constructor(private errorService: ErrorService) {


  }

  ngOnInit() {
    this.errorSubscription = this.errorService.errorSubject.subscribe(
      (error: Error) => {
        this.error = error;
        this.displayStyle = 'block';
      }
    );
  }

  ngOnDestroy() {
    this.errorSubscription.unsubscribe();
  }

  onErrorHandled() {
    this.displayStyle = 'none';
  }
}