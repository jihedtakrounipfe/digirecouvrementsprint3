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
  dialogRef: any;
  dialog: any;

  constructor(private dossiers : ListDossiersService, private api: PreviewService ,private route: ActivatedRoute,private sanitizer: DomSanitizer, private authService: AuthenticationService , private http: HttpClient ) { }
  

  ngOnInit(): void {
    //subscriptions by BehaviorSubject
    this.subscription =this.api.castTag.subscribe(data=>{ this.session = data
      console.log('session data',this.session)})
    //subscriptions by folder informations
    this.getAll();
}
validerDonnees(){
  this.api.validerdossierprecontieurseAPi(this.nomDossier).subscribe(response => {
    console.log(response);

  });
}
openSignalerDossierDialog(){
  this.api.signalerdossierprecontieurseAPi(this.nomDossier).subscribe(response => {
    console.log(response);

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
  huissiers = [
    { name: 'aziz' },
    { name: 'ahmed'},
    { name: 'ranim' }
  ];
  
  selectedHuissier: { name: string, phoneNumber: string };
  
  onHuissierSelectionChange(huissierName: string) {
    const apiUrl = `https://your-api-url.com/huissiers/${huissierName}`;
    
    this.http.get(apiUrl).subscribe(
      (response: any) => {
        this.selectedHuissier = { name: huissierName, phoneNumber: response.phoneNumber };
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
  
  openDialogAffecter() {
    this.dialogRef.close();
    this.dialog.open(SuccessMessageComponent, {
      width: '600px',
      height: '300px',
      data:{
        title_label: 'Le dossier a été affecté avec succès',
        sub_title_label: 'un mail a été envoyé au huissier',
        button_label: 'Ok',
        success_icon:true,
        echec_icon:false
      }
    });

    this.dialogRef.close(this.affecterForm['value']);
  }

}



