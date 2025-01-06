import { Component } from '@angular/core';
import { ChatService } from '../../../services/chat.service';

@Component({
  selector: 'app-bento-communicator',
  templateUrl: './bento-communicator.component.html',
  styleUrl: './bento-communicator.component.css'
})
export class BentoCommunicatorComponent {

  constructor(
    protected chatService: ChatService,
  ){ }


}
