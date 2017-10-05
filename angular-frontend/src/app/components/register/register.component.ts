
import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../services/validate.service'
import {AuthService} from '../../services/auth.service'
import {FlashMessagesService} from 'angular2-flash-messages';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name: String;
  username: String;
  password: String;
  canBook: Boolean = false;
  hours: Number;
  minutes: Number;

  constructor(
    private validateService: ValidateService,
    private flashMessage:FlashMessagesService,
    private authService:AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    if(this.authService.loggedIn()) {
      this.flashMessage.show('Logged in already', {cssClass: 'alert-danger', timeout: 3000});
      this.router.navigate(['/dashboard']);
    }
  }

  onRegisterSubmit(){
    const user = {
      name: this.name,
      username: this.username,
      password: this.password,
      canBook: this.canBook,
      hours: this.hours,
      minutes: this.minutes
    }

    // Required Fields
    if(!this.validateService.validateRegister(user)){
      this.flashMessage.show('Please fill in all fields', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    // Hours and minutes 
    if(!this.validateService.validateTimezone(user)){
      this.flashMessage.show('Please fill in correct timezone values', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    // Register user
    this.authService.registerUser(user).subscribe(data => {
      if(data.success){
        this.flashMessage.show('You are now registered and can log in', {cssClass: 'alert-success', timeout: 3000});
        this.router.navigate(['/login']);
      } else {
        this.flashMessage.show('Something went wrong', {cssClass: 'alert-danger', timeout: 3000});
        this.router.navigate(['/register']);
      }
    });

  }

}