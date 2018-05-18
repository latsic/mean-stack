import { Component, OnInit } from "@angular/core";
import { MessageService } from "./message.service";
import { Message } from "./message.model";
import { NgForm } from "@angular/forms";
import { ErrorService } from "../errors/error.service";
import { Error } from "../errors/error.model";


@Component({
  selector: 'app-message-input',
  templateUrl: 'message-input.component.html', 
  styles:[`
    #clearButton {
      margin-right: 2rem;
    }
  `]
})
export class MessageInputComponent implements OnInit {

  message: Message;

  constructor(private msgService: MessageService,
              private errorService: ErrorService) {

  }

  ngOnInit() {
    this.msgService.messageEdit.subscribe(
      (message: Message) => {
        console.log("received message");
        this.message = message;
      }
    );
  }

  onSubmit(form: NgForm) {
    console.log("form", form);

    if(this.message) {
      this.message.content = form.value.content;
      this.msgService.updateMessage(this.message)
        .subscribe(
          data => {
            console.log("update data", data);
          },
          error => {
            console.log("update data error", error);
          }
        )
      this.message = null;
    }
    else {

      const message = new Message("Dummy", form.value.content);
      this.msgService.addMessage(message)
        .subscribe(
          data => {
            console.log("add got message", data);
          },
          error => {
            this.errorService.errorSubject.next(
              new Error(error.title, error.error.message));
            console.log("add error message", error);
          }
        )
    }
    form.resetForm();
  }

  onClear(form: NgForm) {
    this.message = null;
    form.resetForm();
  }

}