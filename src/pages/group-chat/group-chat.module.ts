import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupChatPage } from './group-chat';

@NgModule({
  declarations: [
    GroupChatPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupChatPage),
  ],
    exports: [
        GroupChatPage
    ]
})
export class GroupChatPageModule {}
