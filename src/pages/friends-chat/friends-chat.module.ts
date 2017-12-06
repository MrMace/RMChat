import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FriendsChatPage } from './friends-chat';

@NgModule({
  declarations: [
    FriendsChatPage,
  ],
  imports: [
    IonicPageModule.forChild(FriendsChatPage),
  ],
    exports: [
    FriendsChatPage ]
})
export class FriendsChatPageModule {}
