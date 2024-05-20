import { PreviewService } from 'app/services/preview.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, Output, Inject, ViewChild,EventEmitter  } from '@angular/core';
import { ListDossiersService } from 'app/services/list-dossiers.service';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthenticationService } from '@alfresco/adf-core';
import { environment } from 'environments/environment';
import { UploadFileModalComponent } from 'app/shared/upload-file-modal/upload-file-modal.component';
import { SuccessMessageComponent } from 'app/shared/success-message/success-message.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalComponent } from 'app/shared/confirmation-modal/confirmation-modal.component';



@Component({
  selector: 'app-phase-precontisieuse',
  templateUrl: './phase-precontisieuse.component.html',
  styleUrls: ['./phase-precontisieuse.component.css']
})
export class PhasePrecontisieuseComponent implements OnInit {
  @Output() newItemEvent = new EventEmitter();
  @ViewChild (MatPaginator) paginator: MatPaginator;
  public displayedTabColumns: string[] = ['periodicite','montant','datePremiereEchiancier'];
  public displayeCreancesTab: string[] = ['select','creances','montant','nature','datedeffdesir'];
  public displayVrsementTab: string[] = ['select','nomVersement' , 'dateVersement' ,'montantVersement', 'modeReglement' , 'affectaion','telecharger'];
  public displayFraisTab: string[] = ['select','fraisprecont','naturefrais' , 'typefrais' ,'tier', 'montants','datedeffdesir'];
  public displayGarantiesTab: string[] = ['select','typeGar','natureHypotheque','Rang','immatriculation','dateFinDeLHypotheque','montantDeLHypotheque','valeurEstimee','hypthequebanques','beneficiairehypotheque'];
  public displaySaisineTab: string[] = ['select','nomsaisine','region','typeDeTiers','nomDeTiers','piecejointe', 'nompiecejointe'];
  public nomDossier = this.route.snapshot.params.nomDossier;
  public baseUrl=`${environment.baseUrl}`
  public ticket=`?alf_ticket=${this.authService.getTicketEcm()}`
  public precontisieuse:string;
  public session: any;
  public creance:any;
  public versement:any;
  public frais:any;
  public garanties:any;
  public saisine:any;
  public file;
  public subscription:Subscription;
  showFileUploadPopup: boolean = false;
  selectedFile: File | null = null;

  submitted = false;
  public FormData:FormData;


  public tableauDamortissement:any;
  public titreCredit:any;
  public contratDePret:any;
  public acteDeCaution:any;
  public signature:any;
  public Contrathypothecaire:any;
  public formData = new FormData();
  dialogRef: any;
  // dialog: any;
   infodossierpre: any[];
   verifpre_form: FormGroup;
   isEditMode: boolean = false;
   selectedFile2: any;

   huissiersnom: string[] = [];

  public list:boolean = true;
  public add:boolean = false;
  public updateForm:boolean = false;

  public list1:boolean = true;
  public add1:boolean = false;
  public updateForm1:boolean = false;

  public list2:boolean = true;
  public add2:boolean = false;
  public updateForm2:boolean = false;

  public list3:boolean = true;
  public add3:boolean = false;
  public updateForm3:boolean = false;

  public list4:boolean = true;
  public add4:boolean = false;
  public updateForm4:boolean = false;
  task: any;
  selectedHuissier: { name: string, phoneNumber: string } | null = null;


  constructor(private dossiers : ListDossiersService, private api: PreviewService ,private route: ActivatedRoute,private sanitizer: DomSanitizer, private authService: AuthenticationService , private http: HttpClient, public dialog: MatDialog, ) { }


  ngOnInit(): void {
    //subscriptions by BehaviorSubject
    this.subscription =this.api.castTag.subscribe(data=>{ this.session = data
      console.log('session data',this.session)})
    //subscriptions by folder informations

    this.verifpre_form = new FormGroup({
      tableaudamortissementchamps: new FormControl('', Validators.required),
      titrecreditfield: new FormControl('', Validators.required),
      contratDePretchamps: new FormControl('', Validators.required),
      acteDeCautionchamps: new FormControl('', Validators.required),
      signaturechamps: new FormControl('', Validators.required),
      contratdeprethypothecairechamps: new FormControl('', Validators.required)
    });

    this.getAll();
    this.getdataprecontentieuse();
this.taskcourante();
this.getallacharge();

}
buttoncontrol(buttonname: string): boolean {
/*   console.log('rrrrrrrrrr',this.task.taskName,this.task && this.task.taskName === buttonname)
 */  if (this.task.taskName === "Alimentation dossier") {
    this.verifpre_form.enable();
  } else {

    this.verifpre_form.disable();
  }
  return this.task && this.task.taskName === buttonname;
}
taskcourante() {
  this.api.getcurrenttask(this.nomDossier).subscribe(
    response => {
      console.log(response);
      this.task = response;

      // Check if the response indicates "Alimentation dossier"

    },
    error => {
      console.error('Error:', error);
    }
  );

}
openDialogAffecter() {
  if (this.dialogRef) {
    this.dialogRef.close();
  }

  const dialogRef = this.dialog.open(SuccessMessageComponent, {
    width: '600px',
    height: '300px',
    data: {
      title_label: "Email de réception du mandat envoyé à l'huissier.",
      button_label: 'OK',
      success_icon: true,
      echec_icon: false
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
    if (result) {
      this.affecterhuissier();
    }
  });

  this.dialogRef = dialogRef;
}

openDialoglettrerecue() {
  if (this.dialogRef) {
    this.dialogRef.close();
  }

  const dialogRef = this.dialog.open(SuccessMessageComponent, {
    width: '600px',
    height: '200px',
    data: {
      title_label: "La lettre a été bien reçu au débiteur",
      button_label: 'OK',
      success_icon: false,
      echec_icon: false
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
    if (result) {
      this.lettrerecuebutton('lettre recue');
    }
  });

  this.dialogRef = dialogRef;
}

openDialoglettrenonrecue() {
  if (this.dialogRef) {
    this.dialogRef.close();
  }

  const dialogRef = this.dialog.open(SuccessMessageComponent, {
    width: '600px',
    height: '200px',
    data: {
      title_label: "La lettre n'a pas été bien reçue au débiteur",
      button_label: 'Signaler le dossier',
      success_icon: false,
      echec_icon: false
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
    if (result) {
      this.lettrerecuebutton('lettre recue');
    }
  });

  this.dialogRef = dialogRef;
}
openDialogpaye() {
  if (this.dialogRef) {
    this.dialogRef.close();
  }

  const dialogRef = this.dialog.open(SuccessMessageComponent, {
    width: '600px',
    height: '200px',
    data: {
      title_label: "Ce dossier est traitée",
      button_label: 'Valider',
      success_icon: false,
      echec_icon: false
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
    if (result) {
      this.verificationpaiementpre('Paye')
    }
  });

  this.dialogRef = dialogRef;
}

openDialognonpaye() {
  if (this.dialogRef) {
    this.dialogRef.close();
  }

  const dialogRef = this.dialog.open(SuccessMessageComponent, {
    width: '600px',
    height: '200px',
    data: {
      title_label: "Ce dossier sera qualifié pour la phase contentieuse",
      button_label: 'Valider',
      success_icon: false,
      echec_icon: false
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
    if (result) {
      this.verificationpaiementpre('Non Paye')
    }
  });

  this.dialogRef = dialogRef;
}

validerDonnees(){
  this.api.validerdossierprecontieurseAPi(this.nomDossier).subscribe(response => {
    this.taskcourante();
    console.log(response);

  });
}
signalerDonnees(){
  this.api.signalerdossierprecontieurseAPi(this.nomDossier).subscribe(response => {
    this.taskcourante();
    console.log(response);

  });
}
modifierdossier(){
  this.api.signalerdossierprecontieurseAPi(this.nomDossier).subscribe(response => {
    this.taskcourante();
    console.log(response);  });
}
/* toggleEditMode() { */
 /*  console.log("Task Name:", this.task.taskName);
  // Vérifiez si la tâche actuelle est celle attendue pour activer le mode d'édition
  if (this.task.taskName === "Alimentation dossier") {
    this.isEditMode = !this.isEditMode;
    this.verifpre_form.enable();
  } else {
    // Si la tâche actuelle n'est pas celle attendue, désactivez le mode d'édition
    this.isEditMode = false;
    this.verifpre_form.disable();
  }
} */
toggleEditMode() {
  this.isEditMode = !this.isEditMode;
  this.verifpre_form.enable();


}
openValiderpre() {
  const dialogRef = this.dialog.open(ConfirmationModalComponent, {
    width: '650px',
    height: '370px',
    data:{
      signaler:false,
      valider:true,
      title_label: 'Valider le dossier',
      sub_title_label: 'voulez-vous valider les donnees?',
      button_label_1: 'Annuler',
      button_label_2: 'OK'
    }
  });
  dialogRef.afterClosed().subscribe(res => {res
    this.api.validerdossierprecontieurseAPi( this.nomDossier).subscribe({
      complete: () => {
        this.taskcourante();
        this.api.OpenSuccessDialog();
        console.log('Validation submitted !!!');

      },
      error: (e) => {
        console.log(e);
      }})
  })
}
openSignalerpre() {
  const dialogRef = this.dialog.open(ConfirmationModalComponent, {
    width: '650px',
    height: '370px',
    data:{
      signaler:true,
      valider:false,
      title_label: 'Signaler le dossier',
      sub_title_label: 'voulez-vous signaler le dossier ?',
      button_label_1: 'Annuler',
      button_label_2: 'OK'
    }
  });
  dialogRef.afterClosed().subscribe(res => {res
    this.api.signalerdossierprecontieurseAPi( this.nomDossier).subscribe({
      complete: () => {
        this.taskcourante();
        this.api.OpenSuccessDialog();
        console.log('signaler submitted !!!');
      },
      error: (e) => {
        console.log(e);
      }})
  })
}
alimenterDonnees(){


  // Get values of other form fields
  const titreCredit = this.verifpre_form.get('titrecreditfield').value;
  const contratDePret = this.verifpre_form.get('contratDePretchamps').value;
  const acteDeCaution = this.verifpre_form.get('acteDeCautionchamps').value;
  const signature = this.verifpre_form.get('signaturechamps')?.value;
  const contratPretHypothecaire = this.verifpre_form.get('contratdeprethypothecairechamps').value;

  // Construct FormData object with file and other fields
  this.formData.append('tableauDamortissement', this.selectedFile2);
  this.formData.append('action', 'complet');
  this.formData.append('titreCredit', titreCredit);
 this.formData.append('contratDePret', contratDePret);
  this.formData.append('acteDeCaution', acteDeCaution);
  this.formData.append('specimenDeSignature', signature);
  this.formData.append('contratPretHypothecaire', contratPretHypothecaire);

  this.api.alimenterdossier(this.formData,this.nomDossier).subscribe(response => {
    this.taskcourante();
    console.log(response);  });





}
getdataprecontentieuse() {
  this.api.getStatusDossier(this.nomDossier).subscribe((response: any) => {
    // Assign API response data to component variables
    this.tableauDamortissement = response.tableauDamortissement;
    this.titreCredit = response.titreCredit;
    this.contratDePret = response.contratDePret;
    this.acteDeCaution = response.acteDeCaution;
    this.signature = response.specimenDeSignature;
    this.Contrathypothecaire = response.contratPretHypothecaire;

    // Patch form values with retrieved data
    this.verifpre_form.patchValue({
      tableaudamortissementchamps: "Drag & Drop or Click yo upload",//this.baseUrl+this.tableauDamortissement+this.ticket
      titrecreditfield: this.titreCredit,
      contratDePretchamps: this.contratDePret,
      acteDeCautionchamps: this.acteDeCaution,
      signaturechamps: this.signature,
      contratdeprethypothecairechamps: this.Contrathypothecaire
    });

    console.log('API Response:', response);
  },
  error => {
    console.error('Error fetching data:', error);
  });
}

  getAll(){
   this.dossiers.getDossierByName(this.nomDossier).subscribe((data:any) =>{
    this.precontisieuse = data.phaseprecontentieuse[0];
    this.creance =  new MatTableDataSource(data.creance);
    this.versement =  new MatTableDataSource(data.versement);
    this.frais =  new MatTableDataSource(data.fraisprecontent);
    this.garanties =  new MatTableDataSource(data.garantie);
    this.saisine =  new MatTableDataSource(data.saisine);

         console.log('info dossier all data',data);
         console.log('info dossier precontisieuse',this.precontisieuse);
         console.log('info creances',this.creance);
         console.log('info versement',this.versement);
         console.log('info frais',this.frais);
         console.log('info saisine',this.saisine);

    this.creance.paginator = this.paginator;
    this.versement.paginator = this.paginator;
    this.frais.paginator = this.paginator;
    this.garanties.paginator = this.paginator;
    this.saisine.paginator = this.paginator;
  });
}
Reload(event){
  event =this.getAll();
  event =this.show();
  event =this.show1();
  event =this.show2();
  event =this.show3();
  event =this.show4();
}
 selectCreance(Selected){
  console.log('Selected creance',Selected)
   this.api.SetSelctedCr(Selected);
   this.newItemEvent.emit(Selected)
 }
 selectVersement(Selected){
  console.log('Selected Versement',Selected)
   this.api.SetSelctedVers(Selected);
   this.newItemEvent.emit(Selected)
 }
 selectFrais(Selected){
  console.log('Selected Frais',Selected)
  this.api.SetSelctedFrais(Selected);
  this.newItemEvent.emit(Selected)
 }
 selectGarantie(Selected){
  console.log('Selected Garantie',Selected)
  this.api.SetSelctedGar(Selected);
  this.newItemEvent.emit(Selected)
 }
 selectSaisine(Selected){
  console.log('Selected Saisine',Selected)
  this.api.SetSelctedSaisine(Selected);
  this.newItemEvent.emit(Selected)
 }
  goToLink(base64String:string){
   window.open(base64String);
  }

  hide(){
    this.list = false;
    this.add = !this.add;
    if(this.add=true){
      this.list = false;
      this.updateForm=false
    }
  }

  show(){
    this.add = true;
    this.list = !this.list;
    if(this.list=true){
      this.add = false;
      this.updateForm=false
    }
  }

  update(){
    this.updateForm = true;
    this.list = !this.list;
    if(this.updateForm=true){
      this.add = false;
      this.list=false
     }
  }

  hide1(){
    this.list1 = false;
    this.add1 = !this.add1;
    if(this.add1=true){
      this.list1 = false;
      this.updateForm1=false
    }
  }

  show1(){
    this.add1 = true;
    this.list1 = !this.list1;
    if(this.list1=true){
      this.add1 = false;
      this.updateForm1=false
    }
  }

  update1(){
    this.updateForm1 = true;
    this.list1 = !this.list1;
    if(this.updateForm1=true){
      this.add1 = false;
      this.list1=false
     }
  }

  hide2(){
    this.list2 = false;
    this.add2 = !this.add2;
    if(this.add2=true){
      this.list2 = false;
      this.updateForm2=false
    }
  }

  show2(){
    this.add2= true;
    this.list2 = !this.list;
    if(this.list2=true){
      this.add2 = false;
      this.updateForm2=false
    }
  }

  update2(){
    this.updateForm2= true;
    this.list2 = !this.list2;
    if(this.updateForm2=true){
      this.add2= false;
      this.list2=false
     }
  }

  hide3(){
    this.list3 = false;
    this.add3 = !this.add3;
    if(this.add3=true){
      this.list3 = false;
      this.updateForm3=false
    }
  }

  show3(){
    this.add3 = true;
    this.list3 = !this.list3;
    if(this.list3=true){
      this.add3 = false;
      this.updateForm3=false
    }
  }

  update3(){
    this.updateForm3 = true;
    this.list3 = !this.list3;
    if(this.updateForm3=true){
      this.add3 = false;
      this.list3=false
     }
  }

  hide4(){
    this.list4 = false;
    this.add4 = !this.add4;
    if(this.add4=true){
      this.list4 = false;
      this.updateForm4=false
    }
  }

  show4(){
    this.add4 = true;
    this.list4 = !this.list4;
    if(this.list4=true){
      this.add4 = false;
      this.updateForm4=false
    }
  }

  update4(){
    this.updateForm4 = true;
    this.list4 = !this.list4;
    if(this.updateForm4=true){
      this.add4 = false;
      this.list4=false
     }
  }
  openModal(): void {
    this.showFileUploadPopup = true;
  }

  closeFileUploadPopup(): void {
    this.showFileUploadPopup = false;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] as File;
  }

  uploadFile(): void {
    // Handle file upload logic here
    // You can access the selected file using this.selectedFile
    // Close the popup
    this.showFileUploadPopup = false;
  }




  getallacharge() {
    this.api.getallhuissier().subscribe(
      (response: any) => {
        // Extract Huissier names
        const huissiers = response.tiers.Huissier;
        const huissierNames = huissiers.map(huissier => huissier.nomhuissier);

        // Log the names to verify
        console.log(huissierNames);

        // Assign the names to the component property
        this.huissiersnom = huissierNames;
      },
      error => {
        console.error('Error:', error);
      }
    );
  }






  onHuissierSelectionChange(huissierName: string) {
    this.api.gethuissiernumber(huissierName).subscribe(
      (response: any) => {
        console.log(response.huissiers[0].numeroHuissier)
        const phoneNumber = response.huissiers[0].numeroHuissier;
        this.selectedHuissier = { name: huissierName, phoneNumber: phoneNumber };
      },
      (error: any) => {
        console.error('Error fetching phone number:', error);
      }
    );
  }


  affecterForm = new FormGroup({
    action: new FormControl("affecter", [ Validators.required ]),
    agent: new FormControl("", [ Validators.required ]),
  });

  affecterhuissier() {
    if (!this.selectedHuissier) {
      console.error('No huissier selected');
      return;
    }
    const body = {
      "huissierName": this.selectedHuissier.name,
      "huissierPhoneNumber":this.selectedHuissier.phoneNumber
    }



this.api.affecterhuissierapi(this.nomDossier, body).subscribe(
  response => {
    console.log('Huissier assigned successfully:', response);
  },
  error => {
    console.error('Error assigning huissier:', error);
  }
);
  }

  openDialogVerification(status: any) {
    this.dialogRef.close();
    const dialogRef = this.dialog.open(SuccessMessageComponent, {
      width: '600px',
      height: '300px',
      data: {
        title_label: status !== null ?
                      (status ? 'Lettre reçue avec succès' : 'Lettre non reçue') :
                      'Statut de la lettre inconnu',
        sub_title_label: status !== null ?
                          (status ? 'Le client a confirmé la réception de la lettre.' : 'Le client n\'a pas encore confirmé la réception de la lettre.') :
                          'Le statut de la lettre n\'est pas encore confirmé par le client.',
        button_label: 'Ok',
        success_icon: status !== null ? status : false,
        echec_icon: status !== null ? !status : true
      }
    });
  }
  openPaymentValidationPopup(status: string | null) {
    this.dialogRef.close();
    const dialogRef = this.dialog.open(SuccessMessageComponent, {
      width: '600px',
      height: '300px',
      data: {
        title_label: status !== null ?
                      (status === 'paid' ? 'Paiement validé' : 'Paiement non validé') :
                      'Statut du paiement inconnu',
        sub_title_label: status !== null ?
                          (status === 'paid' ? 'Le paiement a été validé avec succès.' : 'Le paiement n\'a pas encore été validé.') :
                          'Le statut du paiement n\'est pas encore confirmé.',
        button_label: 'Ok',
        success_icon: status !== null ? (status === 'paid') : false,
        echec_icon: status !== null ? (status !== 'paid') : true
      }
    });
  }






  fileuploaddialog() {
    const dialogRef =
    this.dialog.open(UploadFileModalComponent,
      {
      data: {name: "upload File"},
      width:'700px',
      height:'480px',
      disableClose: true
      });
    dialogRef.afterClosed().subscribe((Myfile) => {
      console.log(Myfile,'after close popup file')
      this.selectedFile2 = Myfile
  })
  }

  lettrerecuebutton(action: string) {
    const body = { action: action };

    this.api.apireceptionlettre(body, this.nomDossier).subscribe(
      response => {
        console.log(response);
        this.taskcourante();
      },
      error => {
        console.error('Error:', error);
      }
    );}

    verificationpaiementpre(action: string) {
      const body = { action: action };

      this.api.apireverificationpaimentpre(body,this.nomDossier).subscribe(
        response => {
          console.log(response);
          this.taskcourante();
        },
        error => {
          console.error('Error:', error);
        }
      );}



}



