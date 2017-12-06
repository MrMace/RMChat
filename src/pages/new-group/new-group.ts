import { Component } from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {GroupProvider} from "../../providers/group/group";
import {ImageHandlerProvider} from "../../providers/image-handler/image-handler";

/**
 * Generated class for the NewGroupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-group',
  templateUrl: 'new-group.html',
})
export class NewGroupPage {

    newGroup = {
        groupName: 'GroupName',
        groupPic: ''
    };

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public groupService: GroupProvider,
              public imgHandler: ImageHandlerProvider, public loadingCtrl: LoadingController) {
  }
    ionViewDidLoad() {
        console.log('ionViewDidLoad NewgroupPage');
    }

    chooseImage() {
        if (this.newGroup.groupName == 'GroupName') {
            let nameAlert = this.alertCtrl.create({
                buttons: ['okay'],
                message: 'Please enter the groupName first. Thanks'
            });
            nameAlert.present();
        }
        else {
            let loader = this.loadingCtrl.create({
                content: 'Loading, please wait..'
            });
            loader.present();
            this.imgHandler.groupPicStore(this.newGroup.groupName).then((res: any) => {
                loader.dismiss();
                if(res)
                    this.newGroup.groupPic = res;
            }).catch((err) => {
                alert(err);
            })
        }

    }

    createGroup() {
        this.groupService.addGroup(this.newGroup).then(() => {
            this.navCtrl.pop();
        }).catch((err) => {
            alert(JSON.stringify(err));
        })
    }

    editGroupName() {
        let alert = this.alertCtrl.create({
            title: 'Edit Your Group Name',
            inputs: [{
                name: 'groupName',
                placeholder: 'Give a new groupName'
            }],
            buttons: [{
                text: 'Cancel',
                role: 'cancel',
                handler: data => {

                }
            },
                {
                    text: 'Set',
                    handler: data => {
                        if (data.groupName) {
                            this.newGroup.groupName = data.groupName
                        }

                        else {
                            this.newGroup.groupName = 'groupName';
                        }
                    }
                }
            ]
        });
        alert.present();
    }

}
