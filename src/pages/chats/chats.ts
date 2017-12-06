import { Component } from '@angular/core';
import {AlertController, Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {RequestsProvider} from "../../providers/requests/requests";
import {ChatProvider} from "../../providers/chat/chat";

/**
 * Generated class for the ChatsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html',
})
export class ChatsPage {
  myRequests;
  myFriends;

  constructor(public navCtrl: NavController, public navParams: NavParams, public requestService: RequestsProvider, public alertCtrl: AlertController,
              public chatService: ChatProvider, public events: Events) {
  }

    ionViewWillEnter() {
        this.requestService.getMyRequests();
        this.requestService.getMyFriends();
        this.myFriends = [];
        this.events.subscribe('gotRequests', () => {
            this.myRequests = [];
            this.myRequests = this.requestService.userDetails;
        });

        this.events.subscribe('friends', () => {
            this.myFriends = [];
            this.myFriends = this.requestService.myFriends;
        })
    }

    ionViewDidLeave() {
        this.events.unsubscribe('gotRequests');
        this.events.unsubscribe('friends');
    }


    addFriend() {
        this.navCtrl.push('FriendsPage');
    }

    accept(item) {
        this.requestService.acceptRequest(item).then(() => {

            let newAlert = this.alertCtrl.create({
                title: 'Friend added',
                subTitle: 'Tap on the friend to chat with him',
                buttons: ['Okay']
            });
            newAlert.present();
        })
    }

    ignore(item) {
        this.requestService.deleteRequest(item).then(() => {

        }).catch((err) => {
            alert(err);
        })
    }

    friendChat(friend) {
        this.chatService.initializeFriend(friend);
        this.navCtrl.push('FriendsChatPage');
    }

}
