import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {UserProvider} from "../../providers/user/user";


/**
 * Generated class for the PasswordResetPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-password-reset',
  templateUrl: 'password-reset.html',
})
export class PasswordResetPage {

email: string;
  constructor(public navCtrl: NavController, public navParams: NavParams , public userService: UserProvider, public alertCtrl: AlertController) {
  }
ionViewDidLoad(){

}

    reset() {
        let alert = this.alertCtrl.create({
            buttons: ['Ok']
        });
        this.userService.passwordReset(this.email).then((res: any) => {
            if (res.success) {
                alert.setTitle('Email Sent');
                alert.setSubTitle('Check your email for instructions');
            }
        }).catch((err) => {
            alert.setTitle('Failed');
            alert.setSubTitle(err);
        })
    }

    goBack() {
        this.navCtrl.setRoot('LoginPage');
    }

}


