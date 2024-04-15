import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AccountService } from '../../../services/account.service';
import { CommunicatorService } from '../../../services/communicator.service';


@Component({
  selector: 'app-communicator',
  templateUrl: './communicator.component.html',
  styleUrl: './communicator.component.css'
})
export class CommunicatorComponent {

  constructor(
    private communicator: CommunicatorService,
    private _accountService: AccountService,
    private _router: Router
  ) { }
  UserGuid: string = ""; // logged in user needed for comparison in html for display properly messages
  packageId: any;


  // ---------------------------------------------------------------------------------
  // Management of: friendship, private chats
  // ---------------------------------------------------------------------------------

  // DATA
  friendshipList: any; // id, userId, friendId, status, blockFromUser, blockFromFriend
  usersDTOList: any; // list of all userDTO (id, userName, email)
  strangersDTOList: any; // list of strangers UserDTO type
  friends: any; // only friends - id, name, status, isSelected (creating group purposes), options (0 - closed, 1 - opened), isBlockedFriend (not in sql: false, true), invitation (not in sql: false, true)
  friendsChats: any; // list of: chatId, chatType, chatName, friend(id, memberId, userName, email, chatRole, friendshipStatus)
  chatsMessages: any; // list of (chatId, list of message(id, chatId, senderId, content, sentAt, date, time, otherDate))
  myMessage: string = ""; // from writearea
  activeFriend: any; // friend retrieved from friends
  activeChatContent: any; // active chat retrieved from friendsChats
  activeChatMessages: any;// active chat content retrieved from chatsMessages
  // FLAGS
  activeChat: Boolean = false; // true if there are messages
  isSearchAreaActive: Boolean = false;

  // ---------------------------------------------------------------------------------
  // Management of: group chats
  // ---------------------------------------------------------------------------------

  // DATA
  groupsChats: any; // list of: chatId, chatType, chatName, list of members(id, memberId, userName, email, chatRole, friendshipStatus), options (0 - closed, 1 - opened this field is created automatically when clicked options button)
  activeGroupChatCreator: Boolean = false;
  groupName: any;
  activeGroupOptions: Boolean = false;
  currentGroupChat: any; // retrieved from groupChats
  isGroupAdmin: Boolean = false;
  friendsExcludingCurrentGroupMembers: any; // friends - currentGroupChat.members

  // ---------------------------------------------------------------------------------
  // modal windows
  // ---------------------------------------------------------------------------------

  // DATA
  isModalBackgroundActive: Boolean = false; // display background for modal
  isModalAddToGroupActive: Boolean = false; //  display form for adding members to group

  // ---------------------------------------------------------------------------------


  x() {
    console.log(this.currentGroupChat);
    //var user = this.communicator.getUser().subscribe(res=>{
      //console.log(res);
    //});
  }

  logoClick() {
    this.activeChat = false;
    delete this.activeFriend;
    delete this.activeChatMessages;
    delete this.activeChatContent;
  }

  toggleModalAddToGroup(){
    this.isModalAddToGroupActive = !this.isModalAddToGroupActive;
    this.isModalBackgroundActive = !this.isModalBackgroundActive;
  }

  openModalAddToGroup() {
    this.toggleModalAddToGroup();
    delete this.friendsExcludingCurrentGroupMembers;
    this.friendsExcludingCurrentGroupMembers = [];
    var members = this.currentGroupChat.members;
    this.friends.find((f: { isSelected: boolean; id: any; })=>{
      let add = true;
      members.forEach((m: { id: any; })=>{
        f.isSelected = false;
        if(f.id == m.id)
          add = false;
      });
      if(add && !this.friendsExcludingCurrentGroupMembers.find((fe: { id: any; }) => fe.id == f.id)){
        this.friendsExcludingCurrentGroupMembers.push(f);
      }
    });
  }

  hideModalWindows(){
    this.isModalAddToGroupActive = false;
    this.isModalBackgroundActive = false;
  }

  addToGroup(){
    this.friendsExcludingCurrentGroupMembers.forEach((f: { isSelected: boolean; id: string; }) => {
      if (f.isSelected) {
          this.communicator.addChatMember(this.currentGroupChat.chatId, f.id, 0).subscribe(_res => { });
      }
      f.isSelected = false;
    });
    this.toggleModalAddToGroup();
  }

  groupChatClick(_chat: any) {

  }

  grantAdmin(member: { memberId: string; id: string; }) {
    this.communicator.updateChatMember(member.memberId, member.id, this.currentGroupChat.chatId, 1).subscribe(_res => { });;
  }

  denyAdmin(member: { memberId: string; id: string; }) {
    this.communicator.updateChatMember(member.memberId, member.id, this.currentGroupChat.chatId, 0).subscribe(_res => { });;
  }

  removeFromGroup(id: string) {
    this.communicator.deleteChatMember(id).subscribe(_res=>{ });
  }

  leaveGroup() {
    var members = this.currentGroupChat.members;
    members.forEach((m: { id: string; memberId: string; })=>{
      console.log(m.id);
      console.log(this.UserGuid);
      if(m.id == this.UserGuid){
        console.log(m.memberId);
        this.communicator.deleteChatMember(m.memberId).subscribe(_res => {});
      }
    });
  }

  toggleGroupChatCreator() {
    if (this.activeGroupChatCreator) {
      this.activeGroupChatCreator = false;
      this.friends.forEach((f: { isSelected: boolean; }) => {
        f.isSelected = false;
      });
    }
    else
      this.activeGroupChatCreator = true;
  }

  // but first open creator
  createGroupChat() {
    let chatGuid = "";
    this.communicator.createChat(1, this.groupName).subscribe(async res => {
      chatGuid = String(res);
      // Creator of the group chat is it's owner
      this.communicator.addChatMember(chatGuid, this.UserGuid, 2).subscribe(_res => { });
      this.friends.forEach((f: { isSelected: boolean; id: string; }) => {
        if (f.isSelected) {
          // Other members have "normal" status by default
          this.communicator.addChatMember(chatGuid, f.id, 0).subscribe(_res => { });
          f.isSelected = false;
        }
      });
    });
    this.activeGroupChatCreator = false;
  }

  toggleSearchArea() {
    if (this.isSearchAreaActive) this.isSearchAreaActive = false;
    else {
      if (!this.strangersDTOList)
        this.strangersDTOList = [];
      if (Object.keys(this.strangersDTOList).length === 0) {
        this.strangersDTOList = this.communicator.getStrangers().subscribe(data => {
          this.strangersDTOList = data;
          // console.log("refresh strangers");
        });
      }
      this.isSearchAreaActive = true;
    }
  }

  hideGroupOptions() {
    this.activeGroupOptions = false;
  }

  showGroupOptions(item: any) {
    if (!this.activeGroupOptions)
      this.activeGroupOptions = true;
    else
      this.activeGroupOptions = false;
    this.currentGroupChat = item;
    this.currentGroupChat.members = this.currentGroupChat.members.sort((a: { chatRole: number; }, b: { chatRole: number; }) => a.chatRole < b.chatRole);
    let found = this.currentGroupChat.members.find((m: { chatRole: number; id: string; })=>m.chatRole > 0 && m.id == this.UserGuid);
    console.log(found);
    if(found) this.isGroupAdmin=true;
    console.log(this.isGroupAdmin);
  }

  showOptions(item: { options: number | undefined; }) {
    if (item.options == 0 || item.options == undefined)
      item.options = 1;
    else
      item.options = 0;
  }

  deleteFriend(friendId: any) {
    let uId = this.communicator.SY_UserGuid;
    let fsGuid = "";
    this.friendshipList.forEach((fs: { userId: any; friendId: any; id: string; }) => {
      if ((fs.userId == uId || fs.friendId == uId) && (fs.userId == friendId || fs.friendId == friendId))
        fsGuid = fs.id;
    });
    this.communicator.deleteFriendship(fsGuid).subscribe(_res => { });
  }

  blockFriend(friendId: string) {
    let uId = this.communicator.SY_UserGuid;
    let fsGuid = "";
    let fsStatus = 3;
    let blockFromUser = 0;
    let blockFromFriend = 0;
    // this.friendshipList.forEach(fs => {
    //   if ((fs.userId == uId || fs.friendId == uId) && (fs.userId == friendId || fs.friendId == friendId))

    //   fsGuid = fs.id;
    // });

    var friendship = this.friendshipList.find((fs: { userId: any; friendId: any; }) => (fs.userId == uId || fs.friendId == uId) && (fs.userId == friendId || fs.friendId == friendId));
    fsGuid = friendship.id;
    fsStatus = friendship.status;
    if(friendship.userId == this.UserGuid)
      blockFromUser = 1;
    if(friendship.friendId == this.UserGuid)
      blockFromFriend = 1;

    this.communicator.updateFriendshipStatus(fsGuid, friendId, fsStatus, blockFromUser, blockFromFriend).subscribe(_res => { });
  }

  unlockFriend(friend: { id: string; }) {
    let uId = this.communicator.SY_UserGuid;
    let fsGuid = "";
    let fsStatus = 3;
    let blockFromUser = 0;
    let blockFromFriend = 0;
    // this.friendshipList.forEach(fs => {
    //   if ((fs.userId == uId || fs.friendId == uId) && (fs.userId == friend.id || fs.friendId == friend.id))
    //     fsGuid = fs.id;
    // });
    var friendship = this.friendshipList.find((fs: { userId: any; friendId: any; }) => (fs.userId == uId || fs.friendId == uId) && (fs.userId == friend.id || fs.friendId == friend.id));
    fsGuid = friendship.id;
    fsStatus = friendship.status;
    if(friendship.userId == this.UserGuid)
      blockFromUser = 0;
    if(friendship.friendId == this.UserGuid)
      blockFromFriend = 0;

    this.communicator.updateFriendshipStatus(fsGuid, friend.id, fsStatus, blockFromUser, blockFromFriend).subscribe(_res => { });
  }

  rejectInvitation(friend: { id: string; }) {
    let uId = this.communicator.SY_UserGuid;
    let fsGuid = "";
    this.friendshipList.forEach((fs: { userId: any; friendId: any; id: string; }) => {
      if ((fs.userId == uId || fs.friendId == uId) && (fs.userId == friend.id || fs.friendId == friend.id))
        fsGuid = fs.id;
    });
    // User is the one who invites friend, so when friend reject - set blockFromFriend
    this.communicator.updateFriendshipStatus(fsGuid, friend.id, 2, 0, 1).subscribe(_res => { });
  }

  acceptInvitation(friend: { id: string; }) {
    let uId = this.communicator.SY_UserGuid;
    let fsGuid = "";
    this.friendshipList.forEach((fs: { userId: any; friendId: any; id: string; }) => {
      if ((fs.userId == uId || fs.friendId == uId) && (fs.userId == friend.id || fs.friendId == friend.id))
        fsGuid = fs.id;
    });
    this.communicator.updateFriendshipStatus(fsGuid, friend.id, 1, 0, 0).subscribe(_res => { });
  }

  inviteFriend(stranger: { id: string; }) {
    this.communicator.inviteFriend(stranger.id).subscribe(_res => {});
  }

  friendClick(friend: { id: any; }) {
    this.activeFriend = friend;
    this.activeChat = false;
    this.activeChatContent = this.friendsChats.find((fc: { friend: { id: any; }; }) => fc.friend.id == friend.id);
    if (this.activeChatContent) {
      this.chatClicked(this.activeChatContent);
    }
  }

  startChatClick() {
    // 1. Create chat
    // 2. Add ChatMembers
    var chatGuid = "";
    this.communicator.createChat(0, this.activeFriend.name).subscribe(async res => {
      chatGuid = String(res);
      // They are both admins in private chat
      this.communicator.addChatMember(chatGuid, this.UserGuid, 1).subscribe(_res => { });
      this.communicator.addChatMember(chatGuid, this.activeFriend.id, 1).subscribe(_res => {
      });
      //TODO: refreshing doesnt wor
      //this.loadChats();
      // this.activeChatContent = this.friendsChats.find(fc=>fc.chatId == chatGuid);
      // this.chatClicked(this.activeChatContent);
    });
  }

  //TODO: refreshing messages

  chatClicked(chat: { friend: any; chatId: string; }) {
    // console.log("friendsChats: ",this.friendsChats);
    delete this.activeChatMessages;
    this.activeChat = false;
    this.activeChatContent = chat;
    this.activeFriend = chat.friend;

    if (!this.chatsMessages)
      this.chatsMessages = [];
    this.activeChatMessages = this.chatsMessages.find((ch: { chatId: any; }) => ch.chatId == this.activeChatContent.chatId);
    if (this.activeChatMessages != null)
      this.activeChat = true;

    if (!this.activeChat) {
      // Load messages for the chat
      forkJoin(this.communicator.getMesseges(chat.chatId))
        .subscribe(data => {
          let cMessages = data.flatMap((message: any) => message);
          // Sort messages
          cMessages = cMessages.sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
          let chatMessages = {
            chatId: chat.chatId,
            messages: cMessages
          };
          // Update messages for chat
          let addContent: Boolean = true;
          this.chatsMessages.forEach((con: { chatId: any; messages: any[]; }) => {
            if (con.chatId == chatMessages.chatId) {
              con.messages = chatMessages.messages;
              addContent = false;
            }
          });
          // If chat not in cache then add messages
          if (addContent) {
            this.activeChatMessages = chatMessages;
            // =this.chatsMessages.find(ch => ch.chatId == this.activeChatContent.chatId);

            // Make messages to have separated time
            let listOfMessages = this.activeChatMessages.messages;
            let listOfNewMessages: { id: any; chatId: any; senderId: any; content: any; sentAt: any; date: string; time: string; otherDate: number; }[] = [];
            let previousDate = "";
            listOfMessages.forEach((m: { sentAt: string | number | Date; id: any; chatId: any; senderId: any; content: any; }) => {
              let date = new Date(m.sentAt);
              // date
              let day = String(date.getDate()).padStart(2, '0');
              let month = String(date.getMonth() + 1).padStart(2, '0');;
              let year = String(date.getFullYear()).padStart(2, '0');;
              // time
              let hours = String(date.getHours()).padStart(2, '0');;
              let minutes = String(date.getMinutes()).padStart(2, '0');;

              let othDate = 0;
              if (previousDate !== day + "." + month + "." + year)
                othDate = 1;
              previousDate = day + "." + month + "." + year;

              let message = {
                id: m.id,
                chatId: m.chatId,
                senderId: m.senderId,
                content: m.content,
                sentAt: m.sentAt,
                date: day + "." + month + "." + year,
                time: hours + ":" + minutes,
                otherDate: othDate
              }
              listOfNewMessages.push(message);
            });
            this.activeChatMessages.messages = listOfNewMessages;
            // Add sorted messages to list
            this.chatsMessages.push(this.activeChatMessages);
            this.activeChat = true;
          }
        });
    }
  }

  sendMessegeClick() {
    if (this.myMessage && this.myMessage.length > 0) {
      this.communicator.sendMessage(this.activeChatContent.chatId, this.myMessage).subscribe(_res => {
        this.chatClicked(this.activeChatContent);
      });
      this.myMessage = "";
    }
  }

  loadChats() {
    if (!this.friendsChats)
      this.friendsChats = [];

    // Get friends chats for user
    forkJoin([this.communicator.getFriendsChats()])
      .subscribe(([chats]) => {
        this.friendsChats = chats;
      });

    if (!this.groupsChats)
      this.groupsChats = [];

    // Get groups chats for user
    forkJoin([this.communicator.getGroupChats()])
      .subscribe(([chats]) => {
        this.groupsChats = chats;
      });
  }

  // TODO : maybe it should be done on server side (and as result only list of match)
  loadFriends() {
    if (this.friendshipList) {
      let match: { id: any; invitation?: any; isBlockedFriend?: any; name?: any; status?: any; isSelected?: boolean; };
      this.friendshipList.forEach((fs: { userId: string; status: any; friendId: string; blockFromUser: any; blockFromFriend: any; }) => {
        this.usersDTOList.forEach((u: { id: any; userName: any; }) => {
          if (u.id == fs.userId && this.communicator.SY_UserGuid != fs.userId) match = { id: fs.userId, name: u.userName, status: fs.status, isSelected: false };
          if (u.id == fs.friendId && this.communicator.SY_UserGuid != fs.friendId) match = ({ id: fs.friendId, name: u.userName, status: fs.status, isSelected: false });
        });
        let addFriend: boolean = true;
        if (match) {
          this.friends.forEach((f: { id: any; }) => {
            if (f.id === match.id)
              addFriend = false;
          })
          // Check which user blocked his friend
          // Check which user send invitation
          if(fs.userId == this.UserGuid){
            match.invitation = false;
            if(fs.blockFromUser)
              match.isBlockedFriend = true;
          }
          else if(fs.friendId == this.UserGuid){
            match.invitation = true;
            if(fs.blockFromFriend)
              match.isBlockedFriend = true;
          }
          else{
            match.invitation = false;
            match.isBlockedFriend = true;
          }
          // Add friend to the list
          if (addFriend){
            this.friends.push(match);
          }
        }
      });
    }
  }

  ngOnInit(): void {
    if(!this._accountService.isLoggedIn){
      //this._router.navigate(['/start/login']);
    }

    this.UserGuid = this.communicator.SY_UserGuid;
    if (!this.friends) this.friends = [];
    // simultaneous downloading of data from both sources
    forkJoin([this.communicator.getFriendsList(),
    this.communicator.getUsersSearchList("")
    ]).subscribe(([friendsData, usersData]) => {
      this.friendshipList = friendsData;
      this.usersDTOList = usersData;

      // console.log("friendship:", this.friendshipList);
      // console.log("users:", this.usersList);
      // After fetch data invoke function refreshData()
      this.loadFriends();
      this.loadChats();
    });

    // TODO: make better select with join - better api? if needed
  }



}
