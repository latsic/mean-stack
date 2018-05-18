import { Component, OnInit } from "@angular/core";
import { Message } from "./message.model";
import { MessageService } from "./message.service";

@Component({
  selector: 'app-message-list',
  template: `
    <div class="col-md-8 col-md-offset-2">
      <app-message
        [message]="messages[i]"
        *ngFor="let message of messages; let i = index"
        >
      </app-message>
    </div>
  `,
  
})
export class MessageListComponent implements OnInit {

  messages: Message[] = [
    new Message("Latsic", "A Message"),
    new Message("Latsic1", "A Message1")
  ];

  constructor(private msgService: MessageService) {

  }

  ngOnInit() {

    this.msgService.getMessages().subscribe(
      (messages: Message[]) => {
        this.messages = messages;
      }
    )
  }

    
}