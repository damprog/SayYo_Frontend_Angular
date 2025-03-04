import { ChatService } from './../../../../services/chat.service';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AccountService } from '../../../../services/account.service';
import { SY_ChatDTO } from '../../../../models/dto';
import { Chat } from '../../../../models/model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(
    protected chatService: ChatService,
    protected accountService: AccountService
  ) {}

  @ViewChild('messagesContainer', { static: false })
  private messagesContainer!: ElementRef;
  private messageSubscription!: Subscription;

  @Input() chat!: Chat;

  getSenderName(senderGuid: string): string {
    const senderName: string = this.chatService.getSenderName(senderGuid);
    return senderName;
  }

  private isScrolledToBottom(): boolean {
    if (!this.messagesContainer) return false;
    const { scrollTop, scrollHeight, clientHeight } =
      this.messagesContainer.nativeElement;
    return scrollTop + clientHeight >= scrollHeight - 10; // Check if bottom of messages container
  }

  private scrollToBottom(): void {
    if (!this.messagesContainer) return;

    setTimeout(() => {
      console.log('scrollToBottom ok');

      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    }, 0);
  }

  onNewMessage(): void {
    if (this.isScrolledToBottom()) {
      this.scrollToBottom();
      console.log('scrollToBottom');
    }
  }

  startChatClick(friendChat: SY_ChatDTO) {
    this.chatService.startPrivateChat(friendChat);
  }

  sendMessageClick(chat: Chat) {
    const message = chat.currentMessage?.trim();
    if (message && message.length !== 0) {
      this.chatService.sendMessage(chat.chatInfo.chatGuid, message);
    }
    chat.currentMessage = '';
  }

  ngOnInit(): void {
    if (this.accountService.isLoggedIn) {
      this.chatService.setupChatService();
      this.messageSubscription = this.chatService.onNewMessage.subscribe(() => {
        this.onNewMessage();
      });
    }
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
      this.scrollToBottom();
  }
}
