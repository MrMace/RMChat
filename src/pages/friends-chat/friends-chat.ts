import {Component, NgZone, ViewChild} from '@angular/core';
import {Content, Events, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {ChatProvider} from "../../providers/chat/chat";
import {ImageHandlerProvider} from "../../providers/image-handler/image-handler"
import firebase from 'firebase';

/**
 * Generated class for the FriendsChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-friends-chat',
    templateUrl: 'friends-chat.html',
})
export class FriendsChatPage {

    @ViewChild('content') content: Content;
    friend: any;
    newMessage;
    allMessages = [];
    photoURL;
    imgornot;

    constructor(public navCtrl: NavController, public navParams: NavParams, public chatService: ChatProvider,
                public events: Events, public zone: NgZone, public loadingCtrl: LoadingController, public imgStore: ImageHandlerProvider) {

        this.friend = this.chatService.friend;
        this.photoURL = firebase.auth().currentUser.photoURL;
        this.scrollTo();
        this.events.subscribe('newMessage', () => {
            this.allMessages = [];
            this.imgornot = [];
            this.zone.run(() => {
                this.allMessages = this.chatService.friendMessages;
                for (var key in this.allMessages) {
                    if (this.allMessages[key].message.substring(0, 4) == 'http')
                        this.imgornot.push(true);
                    else
                        this.imgornot.push(false);
                }
            })


        })
    }

    addMessage() {
        this.chatService.addNewMessage(this.newMessage).then(() => {
            this.content.scrollToBottom();
            this.newMessage = '';
        })
    }

    ionViewDidEnter() {
        this.chatService.getFriendMessages();
    }

    scrollTo() {
        setTimeout(() => {
            this.content.scrollToBottom();
        }, 5000);
    }

    sendPicMsg() {
        let loader = this.loadingCtrl.create({
            content: 'Please wait'
        });
        loader.present();
        this.imgStore.picMsgStore().then((imgurl) => {
            loader.dismiss();
            this.chatService.addNewMessage(imgurl).then(() => {
                this.scrollTo();
                this.newMessage = '';
            })
        }).catch((err) => {
            alert(err);
            loader.dismiss();
        })
    }

}
