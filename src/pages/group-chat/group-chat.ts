import { Component, ViewChild } from '@angular/core';
import {ActionSheetController, Content, Events, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {GroupProvider} from "../../providers/group/group";
import {ImageHandlerProvider} from "../../providers/image-handler/image-handler";

import firebase from 'firebase';

/**
 * Generated class for the GroupChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-group-chat',
  templateUrl: 'group-chat.html',
})
export class GroupChatPage {

    @ViewChild('content') content: Content;
    owner: boolean = false;
    groupName;
    newMessage;
    allGroupMsgs;
    alignuid;
    photoURL;
    imgornot;

  constructor(public navCtrl: NavController, public navParams: NavParams,public groupService:GroupProvider, public actionSheet: ActionSheetController,
              public events: Events, public imgStore: ImageHandlerProvider, public loadingCtrl: LoadingController) {

      this.alignuid = firebase.auth().currentUser.uid;
      this.photoURL = firebase.auth().currentUser.photoURL;
      this.groupName = this.navParams.get('groupName');
      this.groupService.getOwnership(this.groupName).then((res) => {
          if (res)
              this.owner = true;
      }).catch((err) => {
          alert(err);
      });
      this.groupService.getGroupMsgs(this.groupName);
      this.events.subscribe('newGroupMsg', () => {
          this.allGroupMsgs = [];
          this.imgornot = [];
          this.allGroupMsgs = this.groupService.groupMsgs;
          for (var key in this.allGroupMsgs) {
              var d = new Date(this.allGroupMsgs[key].timestamp);
              var hours = d.getHours();
              var minutes = "0" + d.getMinutes();
              var month = d.getMonth();
              var da = d.getDate();

              var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

              var formattedTime = monthNames[month] + "-" + da + "-" + hours + ":" + minutes.substr(-2);

              this.allGroupMsgs[key].timestamp = formattedTime;
              if (this.allGroupMsgs[key].message.substring(0, 4) === 'http') {
                  this.imgornot.push(true);
              }
              else {
                  this.imgornot.push(false);
              }
          }
          // this.scrollTo();
      })
  }
    ionViewDidLoad() {
        console.log('ionViewDidLoad GroupChatPage');
    }

    sendPicMsg() {
        let loader = this.loadingCtrl.create({
            content: 'Please wait'
        });
        loader.present();
        this.imgStore.picMsgStore().then((imgurl) => {
            loader.dismiss();
            this.groupService.addGroupMsg(imgurl).then(() => {
                // this.scrollTo();
                this.newMessage = '';
            })
        }).catch((err) => {
            alert(err);
            loader.dismiss();
        })
    }

    presentOwnerSheet() {
        let sheet = this.actionSheet.create({
            title: 'Group Actions',
            buttons: [
                {
                    text: 'Add member',
                    icon: 'person-add',
                    handler: () => {
                        this.navCtrl.push('GroupFriendsPage');
                    }
                },
                {
                    text: 'Remove member',
                    icon: 'remove-circle',
                    handler: () => {
                        this.navCtrl.push('GroupMembersPage');
                    }
                },
                {
                    text: 'Group Info',
                    icon: 'person',
                    handler: () => {
                        this.navCtrl.push('GroupInfoPage', {groupName: this.groupName});
                    }
                },
                {
                    text: 'Delete Group',
                    icon: 'trash',
                    handler: () => {
                        this.groupService.deleteGroup().then(() => {
                            this.navCtrl.pop();
                        }).catch((err) => {
                            console.log(err);
                        })
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    icon: 'cancel',
                    handler: () => {
                        console.log('Cancelled');
                    }
                }
            ]
        });
        sheet.present();
    }

    presentMemberSheet() {
        let sheet = this.actionSheet.create({
            title: 'Group Actions',
            buttons: [
                {
                    text: 'Leave Group',
                    icon: 'log-out',
                    handler: () => {
                        this.groupService.leaveGroup().then(() => {
                            this.navCtrl.pop();
                        }).catch((err) => {
                            console.log(err);
                        })
                    }
                },
                {
                    text: 'Group Info',
                    icon: 'person',
                    handler: () => {
                        this.navCtrl.push('GroupInfoPage', {groupName: this.groupName});
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    icon: 'cancel',
                    handler: () => {
                        console.log('Cancelled');
                    }
                }
            ]
        });
        sheet.present();
    }

    addGroupMsg() {
        this.groupService.addGroupMsg(this.newMessage).then(() => {
            // this.scrollTo();
            this.newMessage = '';
        })
    }

    // scrollTo() {
    //     setTimeout(() => {
    //         console.log(this.content)
    //         this.content.scrollToBottom()
    //     }, 5000);
    // }

}
