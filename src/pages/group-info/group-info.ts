import { Component } from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {GroupProvider} from "../../providers/group/group";

/**
 * Generated class for the GroupInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-group-info',
  templateUrl: 'group-info.html',
})
export class GroupInfoPage {
  
  groupMembers;

  constructor(public navCtrl: NavController, public navParams: NavParams, public groupService: GroupProvider, public events: Events) {
  }

    ionViewDidLoad() {
        this.groupService.getOwnership(this.groupService.currentGroupName).then((res) => {
            if (res)
                this.groupMembers = this.groupService.currentGroup;
            else {
                this.groupService.getGroupMembers();
            }

        });

        this.events.subscribe('gotMembers', () => {
            this.groupMembers = this.groupService.currentGroup;
        })

    }

    ionViewWillLeave() {
        this.events.unsubscribe('gotMembers');
    }

}
