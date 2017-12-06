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
import { UserProvider } from '../providers/user/user';
import { ImageHandlerProvider } from '../providers/image-handler/image-handler';
import { File } from "@ionic-native/file"
import {FileChooser} from "@ionic-native/file-chooser";
import { FilePath } from '@ionic-native/file-path';
import { ChatProvider } from '../providers/chat/chat';
import { GroupProvider } from '../providers/group/group';
import { RequestsProvider } from '../providers/requests/requests';





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
      File,
      FilePath,
      FileChooser,
    AuthorizeProvider,
      AngularFireAuth,
    UserProvider,
    ImageHandlerProvider,
    ChatProvider,
    GroupProvider,
    RequestsProvider
  ]
})
export class AppModule {}
