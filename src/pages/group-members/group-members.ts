import { Component } from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {GroupProvider} from "../../providers/group/group";

/**
 * Generated class for the GroupMembersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-group-members',
  templateUrl: 'group-members.html',
})
export class GroupMembersPage {

  groupMembers;
  tempGroupMembers;

  constructor(public navCtrl: NavController, public navParams: NavParams, public groupService: GroupProvider, public events: Events) {
  }
    ionViewWillEnter() {
        this.groupMembers = this.groupService.currentGroup;
        this.tempGroupMembers = this.groupMembers;
        this.events.subscribe('gotIntoGroup', () => {
            this.groupMembers = this.groupService.currentGroup;
            this.tempGroupMembers = this.groupMembers;
        })

    }

    ionViewWillLeave() {
        this.events.unsubscribe('gotIntoGroups');
    }

    searchUser(searchBar) {
        let tempMembers = this.tempGroupMembers;

        var q = searchBar.target.value;

        if (q.trim() === '') {
            this.groupMembers = this.tempGroupMembers;
            return;
        }

        tempMembers = tempMembers.filter((v) => {
            if (v.displayName.toLowerCase().indexOf(q.toLowerCase()) > -1) {
                return true;
            }
            return false;
        });

        this.groupMembers = tempMembers;

    }

    removeMember(member) {
        this.groupService.deleteMember(member);
    }

}
