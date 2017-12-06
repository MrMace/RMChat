import {Component, NgZone} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {UserProvider} from "../../providers/user/user";
import {ImageHandlerProvider} from "../../providers/image-handler/image-handler";

/**
 * Generated class for the ProfilePicturePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile-picture',
  templateUrl: 'profile-picture.html',
})
export class ProfilePicturePage {
    imgurl = '';
    moveon: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public imageService: ImageHandlerProvider,
              public zone: NgZone, public userService: UserProvider, public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePicturePage');
  }

    chooseImage() {
        let loader = this.loadingCtrl.create({
            content: 'Please wait'
        })
        loader.present();
        this.imageService.uploadImage().then((uploadedurl: any) => {
            loader.dismiss();
            this.zone.run(() => {
                this.imgurl = uploadedurl;
                this.moveon = false;
            })
        })
    }

    updateProceed() {
        let loader = this.loadingCtrl.create({
            content: 'Please wait'
        })
        loader.present();
        this.userService.updateImage(this.imgurl).then((res: any) => {
            loader.dismiss();
            if (res.success) {
                this.navCtrl.setRoot('TabsPage');
            }
            else {
                alert(res);
            }
        })
    }

    proceed() {
        this.navCtrl.setRoot('TabsPage');
    }

}