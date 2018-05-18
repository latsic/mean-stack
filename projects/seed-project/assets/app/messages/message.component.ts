import { Component, Input, Output, OnInit } from "@angular/core";
import { Message } from "./message.model";
import { MessageService } from "./message.service";

@Component({
  selector: 'app-message',
  templateUrl: 'message.component.html',
  styles: [`
    .author {
        display: inline-block;
        font-style: italic;
        font-size: 12px;
        width: 80%;
    }
    .config {
        display: inline-block;
        text-align: right;
        font-size: 12px;
        width: 19%;
    }
  `]
})
export class MessageComponent implements OnInit {
  
  color: string = '#ff0000';
  ownsMessage: boolean = false;

  constructor(private msgService: MessageService) {

  }

  ngOnInit() {
    this.ownsMessage =
      localStorage.getItem("userId") === this.message.userId &&
      this.message.userId != null &&
      this.message.userId.length > 0;

    console.log("ownsMessage", this.ownsMessage);
  }

  @Input()
  message: Message;

  onEdit() {

    if(this.ownsMessage) {
      this.msgService.editMessage(this.message);
    }
  }

  onDelete() {

    if(this.ownsMessage) {

      this.msgService.deleteMessage(this.message).subscribe(
        (data) => {
          console.log("delete message success", data);
        },
        (error) => {
          console.log("delete message error", error);
        }
      );
    }
  }


}