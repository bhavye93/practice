
import { Injectable } from '@angular/core';

@Injectable()
export class ValidateService {

  constructor() { }

  validateRegister(user){
    if(user.name == undefined || user.username == undefined || user.password == undefined){
      return false;
    } else {
      return true;
    }
  }

  validateTimezone(user) {
    if( (user.hours<13 && user.hours>-13) && (user.minutes>(-60) && user.minutes<60)) {
      return true;
    } else {
      return false;
    }
  }
}