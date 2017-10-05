import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user: Object;
  appointments: any;
  monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
  date: Date = new Date();

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) { }

  ngOnInit() {

    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
    },
      err => {
        console.log(err);
        return false;
      });

    this.getAllAppointments().then((appointments) => {
      this.appointments = appointments;
    });

  }

  book() {

    if(!this.user['canBook']) {
      return false;
    }

    var tempDate = new Date(this.date);

    tempDate.setHours(tempDate.getHours() - Number(this.user['hours']));
    tempDate.setMinutes(tempDate.getMinutes() - Number(this.user['minutes']));

    let bookdata = {
      date: tempDate,
      bookedby: this.user['name']
    }

    this.authService.bookAppointment(bookdata).subscribe((data) => {
      if (data.success) {
        this.flashMessage.show('Appointment Booked!', { cssClass: 'alert-success', timeout: 3000 });
        this.getAllAppointments().then((appointments) => {
          this.appointments = appointments;
        });
      } else {
        this.flashMessage.show('Something went wrong!', { cssClass: 'alert-danger', timeout: 3000 });
      }
    });
  }

  getAllAppointments() {
    return new Promise((resolve) => {
      this.authService.getAllAppointments().subscribe(data => {
        if (data.success) {
          for (let appointment of data.appointments) {

            var tempDate = new Date(appointment.date);
            
            tempDate.setHours(tempDate.getHours() + Number(this.user['hours']));
            tempDate.setMinutes(tempDate.getMinutes() + Number(this.user['minutes']));

            appointment.hr = tempDate.getHours();
            appointment.min = tempDate.getMinutes();
            appointment.d = tempDate.getDate();
            appointment.m = this.monthNames[tempDate.getMonth()];
            appointment.yr = tempDate.getFullYear();
          
          }
          resolve(data.appointments.reverse());
        } else {
          this.flashMessage.show('Something went wrong', { cssClass: 'alert-danger', timeout: 3000 });
        }
      });
    });
  }

}
