
import { Injectable } from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {userCreds} from '../../models/interfaces/userCredentials';

/*
  Generated class for the AuthorizeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthorizeProvider {

  constructor(public afAuth: AngularFireAuth) {
  }

    login(credentials: userCreds) {
        var promise = new Promise((resolve, reject) => {
            this.afAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password).then(() => {
                resolve(true);
            }).catch((err) => {
                reject(err);
            })
        });

        return promise;

    }


}
