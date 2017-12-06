import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupFriendsPage } from './group-friends';

@NgModule({
  declarations: [
    GroupFriendsPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupFriendsPage),
  ],
    exports: [
        GroupFriendsPage
    ]
})
export class GroupFriendsPageModule {}
