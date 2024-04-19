import { Component, OnInit } from '@angular/core';
import { SuccessMessageComponent } from '../success-message/success-message.component';

@Component({
  selector: 'app-signaler-precont',
  templateUrl: './signaler-precont.component.html',
  styleUrls: ['./signaler-precont.component.scss']
})
export class SignalerPrecontComponent implements OnInit {
  dialogRef: any;
  dialog: any;
  signalerForm: any;

  constructor() { }

  ngOnInit(): void {
  }
  openDialogSignialerDossier() {
    this.dialogRef.close();
    this.dialog.open(SuccessMessageComponent, {
      width: '600px',
      height: '300px',
      data:{
        title_label: 'Le dossier a été signalé avec succès',
        sub_title_label: 'un mail a été envoyer au débiteur',
        button_label: 'Ok',
        success_icon:true,
        echec_icon:false
      }
    });
   this.dialogRef.close(this.signalerForm['value']);
}
}
