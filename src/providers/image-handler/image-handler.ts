import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import firebase from 'firebase';


@Injectable()
export class ImageHandlerProvider {

    nativePath: any;
    firestore = firebase.storage();
    constructor(public filechooser: FileChooser) {
    }



    uploadImage() {
        var promise = new Promise((resolve, reject) => {
            this.filechooser.open().then((url) => {
                (<any>window).FilePath.resolveNativePath(url, (result) => {
                    this.nativePath = result;
                    (<any>window).resolveLocalFileSystemURL(this.nativePath, (res) => {
                        res.file((resFile) => {
                            var reader = new FileReader();
                            reader.readAsArrayBuffer(resFile);
                            reader.onloadend = (evt: any) => {
                                var imgBlob = new Blob([evt.target.result], { type: 'image/jpeg' });
                                var imageStore = this.firestore.ref('/profileimages').child(firebase.auth().currentUser.uid);
                                imageStore.put(imgBlob).then((res) => {
                                    this.firestore.ref('/profileimages').child(firebase.auth().currentUser.uid).getDownloadURL().then((url) => {
                                        resolve(url);
                                    }).catch((err) => {
                                        reject(err);
                                    })
                                }).catch((err) => {
                                    reject(err);
                                })
                            }
                        })
                    })
                })
            })
        })
        return promise;
    }

    groupPicStore(groupName) {
        var promise = new Promise((resolve, reject) => {
            this.filechooser.open().then((url) => {
                (<any>window).FilePath.resolveNativePath(url, (result) => {
                    this.nativePath = result;
                    (<any>window).resolveLocalFileSystemURL(this.nativePath, (res) => {
                        res.file((resFile) => {
                            var reader = new FileReader();
                            reader.readAsArrayBuffer(resFile);
                            reader.onloadend = (evt: any) => {
                                var imgBlob = new Blob([evt.target.result], { type: 'image/jpeg' });
                                var imageStore = this.firestore.ref('/groupImages').child(firebase.auth().currentUser.uid).child(groupName);
                                imageStore.put(imgBlob).then((res) => {
                                    this.firestore.ref('/profileImages').child(firebase.auth().currentUser.uid).child(groupName).getDownloadURL().then((url) => {
                                        resolve(url);
                                    }).catch((err) => {
                                        reject(err);
                                    })
                                }).catch((err) => {
                                    reject(err);
                                })
                            }
                        })
                    })
                })
            })
        })
        return promise;
    }

    picMsgStore() {
        var promise = new Promise((resolve, reject) => {
            this.filechooser.open().then((url) => {
                (<any>window).FilePath.resolveNativePath(url, (result) => {
                    this.nativePath = result;
                    (<any>window).resolveLocalFileSystemURL(this.nativePath, (res) => {
                        res.file((resFile) => {
                            var reader = new FileReader();
                            reader.readAsArrayBuffer(resFile);
                            reader.onloadend = (evt: any) => {
                                var imgBlob = new Blob([evt.target.result], { type: 'image/jpeg' });
                                var uuid = this.guid();
                                var imageStore = this.firestore.ref('/picmsgs').child(firebase.auth().currentUser.uid).child('picmsg' + uuid);
                                imageStore.put(imgBlob).then((res) => {
                                    resolve(res.downloadURL);
                                }).catch((err) => {
                                    reject(err);
                                })
                                    .catch((err) => {
                                        reject(err);
                                    })
                            }
                        })
                    })
                })
            })
        })
        return promise;
    }

    guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

}