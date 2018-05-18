
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse, HttpErrorResponse } from "@angular/common/http";

import { Message } from "./message.model";
import { Injectable, EventEmitter } from "@angular/core";

import { map, catchError } from "rxjs/operators";
import { throwError, of } from "rxjs";

@Injectable()
export class MessageService {

  baseUrl: string = 'http://localhost:3000/';

  private messages: Message[] = [];

  messageEdit = new EventEmitter<Message>();

  constructor(private httpClient: HttpClient) {
  }

  addMessage(message: Message) {
    console.log("add message:", message);

    const myHeaders = new HttpHeaders();
    myHeaders.set("Content-Type", "application/json");

    console.log("posting message to", this.baseUrl + 'message');

    const tokenQueryParam
      = localStorage.getItem('token')
      ? '?token=' + localStorage.getItem('token')
      : '';

    return this.httpClient.post(
      this.baseUrl + 'message' + tokenQueryParam,
      message,
      {
        headers: myHeaders,
        reportProgress: true,
        responseType: "json"
      }
    ).pipe(
      map((result: any) => {
        console.log("http post message success", result);

        const newMessage = new Message(
          result.userName,
          result.obj.content,
          result.obj._id,
          result.obj.user._id);
        this.messages.push(newMessage);
        return newMessage;
      }),
      catchError((errorResponse) => {
        console.log("http post message error", errorResponse.error);
        return throwError(errorResponse.error);
      })
    );
  }

  getMessages() {
    
    return this.httpClient.get<Object>(
      this.baseUrl + 'message')
      .pipe(
        map((response: {message: string, obj}) => {

          const messages: Message[] = [];
          for(let message of response.obj) {
            messages.push(new Message(
              message.user.firstName,
              message.content,
              message._id,
              message.user._id
            ));
          }
          this.messages = messages;
          return messages;
        }),
        catchError((errorResponse) => {

          console.log("message service get error", errorResponse);

          return throwError(errorResponse.error);
        })
    );
  }

  deleteMessage(message: Message) {
    this.messages.splice(
      this.messages.indexOf(message), 1);

    console.log("delete message:", message);

    console.log("deleting message to",
      this.baseUrl + 'message/' + message.messageId);

    const tokenQueryParam
      = localStorage.getItem('token')
      ? '?token=' + localStorage.getItem('token')
      : '';
    
    return this.httpClient.delete(
      this.baseUrl + 'message/' + message.messageId + tokenQueryParam,
      {
        responseType: "json"
      }
    ).pipe(
      map((result: any) => {
        console.log("http delete message success", result)
        return result;
      }),
      catchError((errorResponse) => {
        console.log("http delete message error", errorResponse.error);
        return throwError(errorResponse.error);
      })
    );      
  }

  editMessage(message: Message) {
    console.log("service edit");
    this.messageEdit.emit(message);
  }

  updateMessage(message: Message) {
    
    console.log("patch message:", message);

    const myHeaders = new HttpHeaders();
    myHeaders.set("Content-Type", "application/json");

    console.log("patching message to",
      this.baseUrl + 'message/' + message.messageId);

    const tokenQueryParam
      = localStorage.getItem('token')
      ? '?token=' + localStorage.getItem('token')
      : '';

    return this.httpClient.patch(
      this.baseUrl + 'message/' + message.messageId + tokenQueryParam,
      message,
      {
        headers: myHeaders,
        reportProgress: true,
        responseType: "json"
      }
    ).pipe(
      map((response) => {
        console.log("http patch message success", response)
        return response;
      }),
      catchError((errorResponse) => {
        console.log("http patch message error", errorResponse.error);
        return throwError(errorResponse.error);
      })
    );
  }

}