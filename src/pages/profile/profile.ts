import {Component, NgZone} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {UserProvider} from "../../providers/user/user";
import {ImageHandlerProvider} from "../../providers/image-handler/image-handler";
import firebase from 'firebase';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  avatar: string;
  displayName: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public userService: UserProvider, public alertCtrl: AlertController, public zone: NgZone,
              public imgHandler: ImageHandlerProvider) {
  }

    ionViewWillEnter() {
        this.loadUserDetails();
    }

    loadUserDetails() {
        this.userService.getUserDetails().then((res: any) => {
            this.displayName = res.displayName;
            this.zone.run(() => {
                this.avatar = res.photoURL;
            })
        })
    }

    editImage() {
        let statusalert = this.alertCtrl.create({
            buttons: ['okay']
        });
        this.imgHandler.uploadImage().then((url: any) => {
            this.userService.updateImage(url).then((res: any) => {
                if (res.success) {
                    statusalert.setTitle('Updated');
                    statusalert.setSubTitle('Your profile pic has been changed successfully!!');
                    statusalert.present();
                    this.zone.run(() => {
                        this.avatar = url;
                    })
                }
            }).catch((err) => {
                statusalert.setTitle('Failed');
                statusalert.setSubTitle('Your profile pic was not changed');
                statusalert.present();
            })
        })
    }

    editName() {
        let statusalert = this.alertCtrl.create({
            buttons: ['okay']
        });
        let alert = this.alertCtrl.create({
            title: 'Edit Nickname',
            inputs: [{
                name: 'username',
                placeholder: 'Nickname'
            }],
            buttons: [{
                text: 'Cancel',
                role: 'cancel',
                handler: data => {

                }
            },
                {
                    text: 'Edit',
                    handler: data => {
                        if (data.username) {
                            this.userService.updateDisplayName(data.username).then((res: any) => {
                                if (res.success) {
                                    statusalert.setTitle('Updated');
                                    statusalert.setSubTitle('Your username has been changed successfully!!');
                                    statusalert.present();
                                    this.zone.run(() => {
                                        this.displayName = data.username;
                                    })
                                }

                                else {
                                    statusalert.setTitle('Failed');
                                    statusalert.setSubTitle('Your username was not changed');
                                    statusalert.present();
                                }

                            })
                        }
                    }

                }]
        });
        alert.present();
    }

    logout() {
        firebase.auth().signOut().then(() => {
            this.navCtrl.parent.parent.setRoot('LoginPage');
        })
    }


}
