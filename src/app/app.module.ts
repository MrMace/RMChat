import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';
import {AngularFirestoreModule} from "angularfire2/firestore";

import { MyApp } from './app.component';
import { AuthorizeProvider } from '../providers/authorize/authorize';
import { FIREBASE_CONFIG } from './firebaseConfig';




@NgModule({
  declarations: [
    MyApp,

  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
      AngularFireModule.initializeApp(FIREBASE_CONFIG),
      AngularFirestoreModule.enablePersistence(),

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthorizeProvider,
      AngularFireAuth
  ]
})
export class AppModule {}
