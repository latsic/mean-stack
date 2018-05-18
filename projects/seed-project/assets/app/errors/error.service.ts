import { Error } from "./error.model";
import { Subject } from "rxjs";


export class ErrorService {

  errorSubject: Subject<Error> = new Subject();

  

}