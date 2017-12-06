
import { Injectable } from '@angular/core';
import {AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase'

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {

  fireData = firebase.database().ref('/users');


  constructor(public afireauth: AngularFireAuth) {

  }

  addUser(newUser){

    var promise = new Promise((resolve, reject) => {
      this.afireauth.auth.createUserWithEmailAndPassword(newUser.email, newUser.password).then(() => {
        this.afireauth.auth.currentUser.updateProfile({
            displayName: newUser.displayName,
            photoURL: ''
        }).then(() => {
          this.fireData.child(this.afireauth.auth.currentUser.uid).set({
              uid: this.afireauth.auth.currentUser.uid,
              displayName: newUser.displayName,
              photoURL: ''
          }).then(() => {
            resolve({ success: true });
          }).catch ((err) => {
            reject(err);
            })
        }).catch((err) => {
          reject(err)
        })
      }).catch((err) => {
        reject(err);
      })
    });

      return promise;
  }


    passwordReset(email) {
        var promise = new Promise((resolve, reject) => {
            firebase.auth().sendPasswordResetEmail(email).then(() => {
                resolve({ success: true });
            }).catch((err) => {
                reject(err);
            })
        });
        return promise;
    }

    updateImage(imageurl) {
        var promise = new Promise((resolve, reject) => {
            this.afireauth.auth.currentUser.updateProfile({
                displayName: this.afireauth.auth.currentUser.displayName,
                photoURL: imageurl
            }).then(() => {
                firebase.database().ref('/users/' + firebase.auth().currentUser.uid).update({
                    displayName: this.afireauth.auth.currentUser.displayName,
                    photoURL: imageurl,
                    uid: firebase.auth().currentUser.uid
                }).then(() => {
                    resolve({ success: true });
                }).catch((err) => {
                    reject(err);
                })
            }).catch((err) => {
                reject(err);
            })
        });
        return promise;
    }

    getUserDetails() {
        var promise = new Promise((resolve, reject) => {
            this.fireData.child(firebase.auth().currentUser.uid).once('value', (snapshot) => {
                resolve(snapshot.val());
            }).catch((err) => {
                reject(err);
            })
        })
        return promise;
    }

    updateDisplayName(newName) {
        var promise = new Promise((resolve, reject) => {
            this.afireauth.auth.currentUser.updateProfile({
                displayName: newName,
                photoURL: this.afireauth.auth.currentUser.photoURL
            }).then(() => {
                this.fireData.child(firebase.auth().currentUser.uid).update({
                    displayName: newName,
                    photoURL: this.afireauth.auth.currentUser.photoURL,
                    uid: this.afireauth.auth.currentUser.uid
                }).then(() => {
                    resolve({ success: true });
                }).catch((err) => {
                    reject(err);
                })
            }).catch((err) => {
                reject(err);
            })
        });
        return promise;
    }

    getAllUsers() {

        var promise = new Promise((resolve, reject) => {
            this.fireData.orderByChild('uid').once('value', (snapshot) => {
                let userData = snapshot.val();
                let tempArr = [];
                for (var key in userData) {
                    tempArr.push(userData[key]);
                }
                resolve(tempArr);
            }).catch((err) => {
                reject(err);
            })
        });
        return promise;
    }


}


