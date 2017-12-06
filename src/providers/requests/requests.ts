import { Injectable } from '@angular/core';
import {UserProvider} from "../user/user";
import {Events} from "ionic-angular";
import { connreq } from "../../models/interfaces/request"
import firebase from 'firebase';


/*
  Generated class for the RequestsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RequestsProvider {
  fireReq = firebase.database().ref('/requests');
  fireFriends = firebase.database().ref('/friends');

  userDetails;
  myFriends;


  constructor(public userService: UserProvider, public events: Events) {
  }

    sendRequest(req: connreq) {
        var promise = new Promise((resolve, reject) => {
            this.fireReq.child(req.recipient).push({
                sender: req.sender
            }).then(() => {
                resolve({ success: true });
            })
            //     .catch((err) => {
            //     resolve(err);
            // })
        });
        return promise;
    }

    getMyRequests() {
        let allMyRequests;
        var myRequests = [];
        this.fireReq.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
            allMyRequests = snapshot.val();
            myRequests = [];
            for (var i in allMyRequests) {
                myRequests.push(allMyRequests[i].sender);
            }
            this.userService.getAllUsers().then((res) => {
                var allUsers = res;
                this.userDetails = [];
                for (var j in myRequests)
                    for (var key in allUsers) {
                        if (myRequests[j] === allUsers[key].uid) {
                            this.userDetails.push(allUsers[key]);
                        }
                    }
                this.events.publish('gotRequests');
            })

        })
    }

    acceptRequest(friend) {
        var promise = new Promise((resolve, reject) => {
            this.myFriends = [];
            this.fireFriends.child(firebase.auth().currentUser.uid).push({
                uid: friend.uid
            }).then(() => {
                this.fireFriends.child(friend.uid).push({
                    uid: firebase.auth().currentUser.uid
                }).then(() => {
                    this.deleteRequest(friend).then(() => {
                        resolve(true);
                    })

                })
                //     .catch((err) => {
                //     reject(err);
                // })
            })
            //     .catch((err) => {
            //     reject(err);
            // })
        })
        return promise;
    }

    deleteRequest(friend) {
        var promise = new Promise((resolve, reject) => {
            this.fireReq.child(firebase.auth().currentUser.uid).orderByChild('sender').equalTo(friend.uid).once('value', (snapshot) => {
                let someKey;
                for (var key in snapshot.val())
                    someKey = key;
                this.fireReq.child(firebase.auth().currentUser.uid).child(someKey).remove().then(() => {
                    resolve(true);
                })
            })
                .then(() => {

                }).catch((err) => {
                reject(err);
            })
        });
        return promise;
    }

    getMyFriends() {
        let friendsUid = [];
        this.fireFriends.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
            let allFriends = snapshot.val();
            this.myFriends = [];
            for (var i in allFriends)
                friendsUid.push(allFriends[i].uid);

            this.userService.getAllUsers().then((users) => {
                this.myFriends = [];
                for (var j in friendsUid)
                    for (var key in users) {
                        if (friendsUid[j] === users[key].uid) {
                            this.myFriends.push(users[key]);
                        }
                    }
                this.events.publish('friends');
            }).catch((err) => {
                alert(err);
            })

        })
    }

}
