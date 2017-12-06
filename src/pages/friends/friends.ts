import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {UserProvider} from "../../providers/user/user";
import {RequestsProvider} from "../../providers/requests/requests";
import { connreq } from '../../models/interfaces/request';
import firebase from 'firebase';

/**
 * Generated class for the FriendsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html',
})
export class FriendsPage {

    newRequest = {} as connreq;
    tempArr = [];
    filteredUsers = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public userService: UserProvider,
              public alertCtrl: AlertController, public requestService: RequestsProvider) {
    this.userService.getAllUsers().then((res:any) => {
      this.filteredUsers = res;
      this.tempArr = res;
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FriendsPage');
  }

    searchUser(searchBar) {
        this.filteredUsers = this.tempArr;
        var q = searchBar.target.value;
        if (q.trim() == '') {
            return;
        }

        this.filteredUsers = this.filteredUsers.filter((v) => {
            if (v.displayName.toLowerCase().indexOf(q.toLowerCase()) > -1) {
                return true;
            }
            return false;
        })
    }

    sendReq(recipient) {
        this.newRequest.sender = firebase.auth().currentUser.uid;
        this.newRequest.recipient = recipient.uid;
        if (this.newRequest.sender === this.newRequest.recipient)
            alert('Awww...You that lonely?');
        else {
            let successAlert = this.alertCtrl.create({
                title: 'Request sent',
                subTitle: 'Your request was sent to ' + recipient.displayName,
                buttons: ['Ok']
            });

            this.requestService.sendRequest(this.newRequest).then((res: any) => {
                if (res.success) {
                    successAlert.present();
                    let sentUser = this.filteredUsers.indexOf(recipient);
                    this.filteredUsers.splice(sentUser, 1);
                }
            }).catch((err) => {
                alert(err);
            })
        }
    }


}
