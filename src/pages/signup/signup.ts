import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {UserProvider} from "../../providers/user/user";

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  newUser={
    email: '',
      password: '',
      displayName:''
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public userService: UserProvider, public loadingCtrl: LoadingController, public toastCtrl: ToastController) {
  }

 signup() {
      //auth alert
     var toaster = this.toastCtrl.create({
         duration: 5000,
         position: 'bottom'
     })
     //if fields are empty popup (toaster) appear.
     if (this.newUser.email == '' || this.newUser.password == '' || this.newUser.displayName == '') {
         toaster.setMessage("You must fill in all areas to continue");
         toaster.present()
     }
     //if the password is less thatn 8 characters toaster appear.
     else if (this.newUser.password.length < 8) {
         toaster.setMessage("Weak Password, please use 8 or more characters")
         toaster.present();
     }
     else {
         //loading modal
         let loader = this.loadingCtrl.create({
             content: 'Loading Wait A Second..'
         });
         loader.present();
         this.userService.addUser(this.newUser).then((res: any) => {
             loader.dismiss();
             if (res.success)
                 this.navCtrl.push('ProfilePicturePage');
             else
                 alert('Error' + res);
         })
     }
 }

 goBack(){
    this.navCtrl.setRoot('LoginPage')
 }

}
