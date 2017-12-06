import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import {userCreds} from "../../models/interfaces/userCredentials";

import {AuthorizeProvider} from '../../providers/authorize/authorize'

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  credentials = {} as userCreds;

  constructor(public navCtrl: NavController, public navParams: NavParams, private authorizeService: AuthorizeProvider) {

  }



    signin() {


        this.authorizeService.login(this.credentials).then((res: any) => {
            if (!res.code) {
                this.navCtrl.setRoot('TabsPage');
            }
            else {
                alert('Please enter your info');
            }
        })
    }

    signup() {
        this.navCtrl.push('SignupPage');
    }

    resetPassword() {
        this.navCtrl.push('PasswordResetPage');
    }
}
