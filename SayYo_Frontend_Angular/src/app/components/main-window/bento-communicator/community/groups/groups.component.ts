import { finalize, Observable, of } from 'rxjs';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ContactsService } from '../../../../../services/contacts.service';
import { SpinnerService } from '../../../../../services/spinner.service';
import {
  SY_ChatDTO,
  SY_CreateGroupChatDTO,
  SY_FriendChatDTO,
  SY_GroupChatMemberDTO,
  SY_ResponseStatus,
} from '../../../../../models/dto';
import { ModalService } from '../../../../../services/modal.service';
import { MembershipService } from '../../../../../services/membership.service';
import { AccountService } from '../../../../../services/account.service';
import { ContextMenuService } from '../../../../../services/context-menu.service';
import { ContextMenu } from '../../../../../models/model';
import { ChatService } from '../../../../../services/chat.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css',
})
export class GroupsComponent implements OnInit {
  searchOpen: boolean = false;
  searchPattern: string = '';
  groupChats: Array<SY_ChatDTO> = [];
  Object = Object;

  constructor(
    private _chatService: ChatService,
    private _accountService: AccountService,
    private _contextMenuService: ContextMenuService,
    private _modalService: ModalService,
    private _membershipService: MembershipService,
    private _contacts: ContactsService,
    public spinnerService: SpinnerService
  ) {}

  showContextMenu(event: MouseEvent, chatInfo: SY_ChatDTO): void {
    event.stopPropagation();
    var menuInfo: ContextMenu = {
      name: '',
      menuItems: [],
    };

    menuInfo = this.prepareGroupMenu(chatInfo);

    this._contextMenuService.showMenu(event, menuInfo);
  }

  prepareGroupMenu(chatInfo: SY_ChatDTO): ContextMenu {
    var accountMember = chatInfo.members.find(
      (member) => member.guid == this._accountService.account.userGuid
    );

    // Default items
    var menuInfo: ContextMenu = {
      name: chatInfo.chatName,
      menuItems: [
        {
          label: 'Opuść grupe',
          action: () => {
            if (accountMember) {
              return this._membershipService.deleteChatMember(
                accountMember.membershipGuid
              );
            }
            return of(null);
          },
        },
      ],
    };

    // Admin items
    if (accountMember?.chatRole == 1) {
      menuInfo.menuItems.push({
        label: 'Usuń grupę',
        action: () => this._chatService.deleteChat(chatInfo.chatGuid),
      });
    }

    return menuInfo;
  }

  toggleSearch() {
    this.searchOpen = !this.searchOpen;
    this.searchPattern = '';
  }

  ngOnInit() {
    this.spinnerService.show();
    this.groupChats = [];
    this._contacts.getGroupChats().subscribe({
      next: (result: SY_ResponseStatus) => {
        if (result.success) {
          this.groupChats = this._contacts.groupChats.items;
        } else {
          this._modalService.showModal(result.message);
        }
      },
      error: (error) => {
        this._modalService.showModal('Wystąpił błąd podczas ładowania czatów.');
        console.error('Error during loading chats: ', error);
        this.spinnerService.hide();
      },
      complete: () => {
        this.spinnerService.hide();
      },
    });
  }

  // -------------------
  // modal
  // -------------------

  @ViewChild('createGroupModalTemplate')
  createGroupModalTemplate!: TemplateRef<any>;
  filterText: string = '';
  groupName: string = '';
  selectedFriends: { [guid: string]: boolean } = {};
  filteredFriendList: Array<{ userGuid: string; userName: string }> = [];

  openCreateGroupModal(): void {
    console.log('Group: open modal');
    this._modalService.showWithTemplate(this.createGroupModalTemplate, {
      groupName: this.groupName,
      filterText: this.filterText,
      selectedFriends: this.selectedFriends,
      filteredFriendList: this.filteredFriendList,
    });
    this.filterFriends();
  }

  filterFriends() {
    console.log('Group: filtered');
    this.filteredFriendList = this._contacts.friendsChats_Ok.items
      .filter((friendChat) =>
        friendChat.friend.userName
          .toLowerCase()
          .includes(this.filterText.toLowerCase())
      )
      .map((friendChat) => {
        console.log('Group: filtered map');
        return {
          userGuid: friendChat.friend.guid,
          userName: friendChat.friend.userName,
        };
      });
    this._modalService.showWithTemplate(
      this._modalService.modalComponent.modalTemplate,
      {
        groupName: this.groupName,
        filterText: this.filterText,
        selectedFriends: this.selectedFriends,
        filteredFriendList: this.filteredFriendList,
      }
    );
  }

  createGroup(): void {
    // If value is true for key (in this case for guid) return key (key of this dictionary is is guid)
    const selectedGuids = Object.keys(this.selectedFriends).filter(
      (guid) => this.selectedFriends[guid]
    );

    // Map to correct required type
    let selectedMembers: Array<SY_GroupChatMemberDTO> = selectedGuids.map(
      (selectedGuid) => {
        return {
          userGuid: selectedGuid,
          role: 0,
        };
      }
    );

    // Add creator with admin perms
    selectedMembers.push({
      userGuid: this._accountService.account.userGuid,
      role: 1,
    });

    const groupPayload: SY_CreateGroupChatDTO = {
      chatName: this.groupName,
      members: selectedMembers,
    };

    this._chatService
      .createGroup(groupPayload)
      .pipe(
        finalize(() => {
          this._modalService.hideModal();
          // Reset modal
          this.groupName = '';
          this.selectedFriends = {};
        })
      )
      .subscribe({
        next: () => {
          console.log('Grupa została utworzona!');
        },
        error: (error) => {
          console.error('Błąd podczas tworzenia grupy:', error);
        },
      });
  }
}
