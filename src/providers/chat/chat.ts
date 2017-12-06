
import { Injectable } from '@angular/core';
import firebase from 'firebase';
import {Events} from "ionic-angular";

/*
  Generated class for the ChatProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ChatProvider {

  fireFriendChats = firebase.database().ref('/friendChats');
  friend: any;
  friendMessages = [];
  constructor(public events: Events) {
    console.log('Hello ChatProvider Provider');
  }

    initializeFriend(friend) {
        this.friend = friend;
    }

    addNewMessage(msg) {
        if (this.friend) {
            var promise = new Promise((resolve, reject) => {
                this.fireFriendChats.child(firebase.auth().currentUser.uid).child(this.friend.uid).push({
                    sentBy: firebase.auth().currentUser.uid,
                    message: msg,
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                }).then(() => {
                    this.fireFriendChats.child(this.friend.uid).child(firebase.auth().currentUser.uid).push({
                        sentBy: firebase.auth().currentUser.uid,
                        message: msg,
                        timestamp: firebase.database.ServerValue.TIMESTAMP
                    }).then(() => {
                        resolve(true);
                    })
                    //     .catch((err) => {
                    //     reject(err);
                    // })
                })
            });
            return promise;
        }
    }

    getFriendMessages() {

        let temp;
        this.fireFriendChats.child(firebase.auth().currentUser.uid).child(this.friend.uid).on('value', (snapshot) => {
            this.friendMessages = [];
            temp = snapshot.val();
            for (var tempKey in temp) {
                this.friendMessages.push(temp[tempKey]);
            }
            this.events.publish('newMessage');
        })
    }

}
