import {Injectable} from '@angular/core';
import {Events} from "ionic-angular";
import firebase from 'firebase';

/*
USed to send the messages.
*/
@Injectable()
export class GroupProvider {

    fireGroup = firebase.database().ref('/groups');
    myGroups: Array<any> = [];
    currentGroup: Array<any> = [];
    currentGroupName;
    groupPic;
    groupMsgs;

    constructor(public events: Events) {

    }

    //adds  a new group
    addGroup(newGroup) {
        var promise = new Promise((resolve , reject) => {
                this.fireGroup.child(firebase.auth().currentUser.uid).child(newGroup.groupName).set({
                    groupImage: newGroup.groupPic,
                    msgBoard: '',
                    owner: firebase.auth().currentUser.uid
                }).then(() => {
                    resolve(true);
                }).catch((err) => {
                    reject(err);
                })
            });

        return promise;
    }

    getMyGroups() {
        this.fireGroup.child(firebase.auth().currentUser.uid).once('value', (snapshot) => {
            this.myGroups = [];
            if (snapshot.val() != null) {
                var temp = snapshot.val();
                for (var key in temp) {
                    var newGroup = {
                        groupName: key,
                        groupImage: temp[key].groupImage
                    };
                    this.myGroups.push(newGroup);
                }
            }
            this.events.publish('newGroup')
        })
    }

    getIntoGroup(groupName){
        if(groupName != null) {
            this.fireGroup.child(firebase.auth().currentUser.uid).child(groupName).once('value', (snapshot) => {
                if(snapshot.val() != null) {
                    var temp = snapshot.val().members;
                    this.currentGroup = [];
                    for (var key in temp) {
                        this.currentGroup.push(temp[key]);
                    }
                    this.currentGroupName = groupName;
                    this.events.publish('goIntoGroup');
                }
            })
        }
    }

    getOwnership(groupName) {
        var promise = new Promise((resolve, reject) => {
            this.fireGroup.child(firebase.auth().currentUser.uid).child(groupName).once('value', (snapshot) => {
                var temp = snapshot.val().owner;
                if(temp == firebase.auth().currentUser.uid){
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            }).catch((err) => {
                reject(err);
            })
        });
        return promise;
    }

    getGroupImage() {
        return new Promise((resolve, reject) =>
        this.fireGroup.child(firebase.auth().currentUser.uid).child(this.currentGroupName).once('value', (snapshot) => {
            this.groupPic = snapshot.val().groupImage;
            resolve(true)
        }))
    }

    addMember(newMember) {
        this.fireGroup.child(firebase.auth().currentUser.uid).child(this.currentGroupName).child('members' ).push(newMember).then(() => {
            this.getGroupImage().then(() => {
                this.fireGroup.child(newMember.uid).child(this.currentGroupName).set ({
                    groupImage: this.groupPic,
                    owner: firebase.auth().currentUser.uid,
                    msgBoard: ''
                }).catch((err) => {

                })
            })
            this.getIntoGroup(this.currentGroupName);
        })
    }

    deleteMember(member) {
        this.fireGroup.child(firebase.auth().currentUser.uid).child(this.currentGroupName)
            .child('members').orderByChild('uid').equalTo(member.uid).once('value', (snapshot) => {
            snapshot.ref.remove().then(() => {
                this.fireGroup.child(member.uid).child(this.currentGroupName).remove().then(() => {
                    this.getIntoGroup(this.currentGroupName);
                })
            })
        })
    }

    getGroupMembers() {
        this.fireGroup.child(firebase.auth().currentUser.uid).child(this.currentGroupName).once('value', (snapshot) => {
            var tempData = snapshot.val().owner;
            this.fireGroup.child(tempData).child(this.currentGroupName).child('members').once('value', (snapshot) => {
                var tempVar = snapshot.val();
                for (var key in tempVar) {
                    this.currentGroup.push(tempVar[key]);
                }
            })
        })
        this.events.publish('gotMembers');
    }

    leaveGroup() {
        return new Promise((resolve, reject) => {
            this.fireGroup.child(firebase.auth().currentUser.uid).child(this.currentGroupName).once('value', (snapshot) => {
                var tempOwner = snapshot.val().owner;
                this.fireGroup.child(tempOwner).child(this.currentGroupName).child('members').orderByChild('uid')
                    .equalTo(firebase.auth().currentUser.uid).once('value', (snapshot) => {
                    snapshot.ref.remove().then(() => {
                        this.fireGroup.child(firebase.auth().currentUser.uid).child(this.currentGroupName).remove().then(() => {
                            resolve(true);
                        }).catch((err) => {
                            reject(err);
                        })
                    }).catch((err) => {
                        reject(err);
                    })
                })
            })
        })
    }

    deleteGroup() {
        return new Promise((resolve, reject) => {
            this.fireGroup.child(firebase.auth().currentUser.uid).child(this.currentGroupName).child('members').once('value', (snapshot) => {
                var tempMembers = snapshot.val();

                for (var key in tempMembers) {
                    this.fireGroup.child(tempMembers[key].uid).child(this.currentGroupName).remove();
                }

                this.fireGroup.child(firebase.auth().currentUser.uid).child(this.currentGroupName).remove().then(() => {
                    resolve(true);
                }).catch((err) => {
                    reject(err);
                })

            })
        })
    }

    addGroupMsg(newMessage) {
        return new Promise((resolve) => {


            this.fireGroup.child(firebase.auth().currentUser.uid).child(this.currentGroupName).child('owner').once('value', (snapshot) => {
                var tempOwner = snapshot.val();
                this.fireGroup.child(firebase.auth().currentUser.uid).child(this.currentGroupName).child('msgBoard').push({
                    sentBy: firebase.auth().currentUser.uid,
                    displayName: firebase.auth().currentUser.displayName,
                    photoURL: firebase.auth().currentUser.photoURL,
                    message: newMessage,
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                }).then(() => {
                    if (tempOwner != firebase.auth().currentUser.uid) {
                        this.fireGroup.child(tempOwner).child(this.currentGroupName).child('msgBoard').push({
                            sentBy: firebase.auth().currentUser.uid,
                            displayName: firebase.auth().currentUser.displayName,
                            photoURL: firebase.auth().currentUser.photoURL,
                            message: newMessage,
                            timestamp: firebase.database.ServerValue.TIMESTAMP
                        })
                    }
                    var tempMembers = [];
                    this.fireGroup.child(tempOwner).child(this.currentGroupName).child('members').once('value', (snapshot) => {
                        var tempMembersObj = snapshot.val();
                        for (var key in tempMembersObj)
                            tempMembers.push(tempMembersObj[key]);
                    }).then(() => {
                        let postedMsgs = tempMembers.map((item) => {
                            if (item.uid != firebase.auth().currentUser.uid) {
                                return new Promise((resolve) => {
                                    this.postMsgs(item, newMessage, resolve);
                                })
                            }
                        })
                        Promise.all(postedMsgs).then(() => {
                            this.getGroupMsgs(this.currentGroupName);
                            resolve(true);
                        })
                    })
                })
            })
        })
    }

    postMsgs(member, msg, cb) {
        this.fireGroup.child(member.uid).child(this.currentGroupName).child('msgBoard').push({
            sentBy: firebase.auth().currentUser.uid,
            displayName: firebase.auth().currentUser.displayName,
            photoURL: firebase.auth().currentUser.photoURL,
            message: msg,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
            cb();
        })
    }

    getGroupMsgs(groupName) {
        this.fireGroup.child(firebase.auth().currentUser.uid).child(groupName).child('msgBoard').on('value', (snapshot) => {
            var tempMsgHolder = snapshot.val();
            this.groupMsgs = [];
            for (var key in tempMsgHolder)
                this.groupMsgs.push(tempMsgHolder[key]);
            this.events.publish('newGroupMsg');
        })
    }
}
