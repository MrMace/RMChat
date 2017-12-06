import {Component} from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {RequestsProvider} from "../../providers/requests/requests";
import {GroupProvider} from "../../providers/group/group";

/**
 * Generated class for the GroupFriendsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-group-friends',
    templateUrl: 'group-friends.html',
})
export class GroupFriendsPage {
    myFriends = [];
    groupMembers = [];
    searchString;
    tempMyFriends = [];
    newFriend;

    constructor(public navCtrl: NavController, public navParams: NavParams, public requestService: RequestsProvider, public events: Events,
                public groupService: GroupProvider) {
    }

    ionViewWillEnter() {
        this.requestService.getMyFriends();
        this.events.subscribe('gotIntoGroup', () => {
            this.myFriends.splice(this.myFriends.indexOf(this.newFriend.uid), 1);
            this.tempMyFriends = this.myFriends;
        });

        this.events.subscribe('friends', () => {

            this.myFriends = [];
            this.myFriends = this.requestService.myFriends;
            this.groupMembers = this.groupService.currentGroup;
            for (var key in this.groupMembers)
                for (var friend in this.myFriends) {
                    if (this.groupMembers[key].uid === this.myFriends[friend].uid)
                        this.myFriends.splice(this.myFriends.indexOf(this.myFriends[friend]), 1);
                }
            this.tempMyFriends = this.myFriends;
        })
    }

    searchUser(searchBar) {
        let tempFriends = this.tempMyFriends;

        var q = searchBar.target.value;

        if (q.trim() === '') {
            this.myFriends = this.tempMyFriends;
            return;
        }

        tempFriends = tempFriends.filter((v) => {
            if (v.displayName.toLowerCase().indexOf(q.toLowerCase()) > -1) {
                return true;
            }
            return false;
        });

        this.myFriends = tempFriends;

    }

    addFriend(friend) {
        this.newFriend = friend;
        this.groupService.addMember(friend);
    }

}
