import { Component } from '@angular/core';
import {Events, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {GroupProvider} from "../../providers/group/group";

/**
 * Generated class for the GroupsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-groups',
  templateUrl: 'groups.html',
})
export class GroupsPage {

  allMyGroups;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public events: Events, public groupService: GroupProvider) {
  }

    ionViewWillEnter() {
        let loader = this.loadingCtrl.create({
            content: 'Loading your groups. Take a chill pill...'
        });
        loader.present();
        this.groupService.getMyGroups();
        loader.dismiss();
        this.events.subscribe('newGroup', () => {
            this.allMyGroups = this.groupService.myGroups;
        })
    }

    ionViewDidLeave() {
        this.events.unsubscribe('newGroup');
    }

    addGroup() {
        this.navCtrl.push('NewGroupPage');
    }

    openChat(group) {
        this.groupService.getIntoGroup(group.groupName);
        this.navCtrl.push('GroupChatPage', { groupName: group.groupName });

    }
}
