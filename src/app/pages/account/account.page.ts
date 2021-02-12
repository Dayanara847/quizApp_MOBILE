import { TabsPage } from '../tabs/tabs.page';
import { AuthService } from 'src/app/services/auth.service';
import { Storage } from '@ionic/storage';
import { Endpoints } from "../../services/endpoints";
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage  {

  @ViewChild('doughnutCanvas', { static: false }) private doughnutCanvas: ElementRef;

  firstName: string;
  lastName: string;
  email: string;
  id: number;
  birthdate: Date;
  cellphone: number;
  photo: string;
  type: string;
  result: string;
  characters: string;
  stats: any;
  quizzesTotal: number;
  quizzesApproved: number;
  gradeSUM: number = 0;
  quizzesAVG: number = 0;
  lvl: string;
  lvlText: string;
 
  

  doughnutChart: any;

  constructor(private tabsPage: TabsPage,
              private authService: AuthService,
              private storage: Storage,
              private http: HttpClient,
              private endpoints: Endpoints,) { }



  ionViewWillEnter() {
    this.cargarStorage();
    
  }

  callStats(id){
    return this.http.get(this.endpoints.GET_STATS_ENDPOINT + '/' + id)
  }
  userStats(id){
    this.quizzesApproved = 0;
    this.gradeSUM = 0;
    this.callStats(id).subscribe(resp => {
      this.stats = resp
      this.quizzesTotal = this.stats.length
      this.stats.map((q)=>{
      this.gradeSUM = this.gradeSUM + q.grade
        if (q.grade >= 70){
         return this.quizzesApproved = this.quizzesApproved + 1, this.gradeSUM
        }
    })
    this.quizzesAVG = Math.round(this.gradeSUM / this.stats.length)
  })
  return this.quizzesApproved, this.quizzesAVG;
  }


  cargarStorage(){
    this.storage.get('User').then(val => { 
    this.firstName = val.user.firstName; 
    this.lastName= val.user.lastName;
    this.email= val.user.email;
    this.id= val.user.id;
    this.birthdate= val.user.birthdate;    
    this.cellphone= val.user.cellphone;
    this.photo= val.user.photo;
    this.type= val.user.type;
 }).then(x => {
 return this.userStats(this.id)
 }).then(j=>{
  setTimeout( () => {
      
    if (this.quizzesAVG <= 30) {
     this.lvl = 'Trainee'
     this.lvlText = 'Tu promedio es de ' + this.quizzesAVG
     return;
    }
    if (this.quizzesAVG <= 69) {
     this.lvl = 'Junior'
     this.lvlText = 'Tu promedio es de ' + this.quizzesAVG
     return;
    }
    if (this.quizzesAVG <= 85) {
     this.lvl = 'Semi Senior'
     this.lvlText = 'Tu promedio es de ' + this.quizzesAVG
     return;
    }
    if (this.quizzesAVG > 85) {
     this.lvl = 'Senior'
     this.lvlText = 'Tu promedio es de ' + this.quizzesAVG
     return;
    }
  }, 1000);
})
 .then(y => {

  setTimeout( () => {
    return this.doughnutChartMethod()
   
  }, 1000);
 
 })
  }
 

  openFirst(){
    this.tabsPage.openFirst()
  }
  
  changeAuth(){
    this.authService.changeAuth()
  }

  // GRÁFICO DONA
  doughnutChartMethod() {
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Desaprobados','Aprobados' ],
        datasets: [{
          borderWidth: 0,
          data: [ this.quizzesTotal - this.quizzesApproved, this.quizzesApproved ],
          backgroundColor: [
            "#e74c3c",
            "#2ecc71"
          ],
          gridLines: [{borderDash: 0}]
         }]
      }
    });
  }

  makeColor() {
    this.result = '#';
    this.characters = 'ABCDEF0123456789';
    for (var i = 0; i < 6; i++) {
      this.result += this.characters.charAt(Math.floor(Math.random() * this.characters.length));
    }
    console.log(this.result)
    return this.result;
  };
}
