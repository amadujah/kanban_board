import { Component, OnInit, Inject } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { faEdit, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FicheService } from 'src/app/service/fiche.service';
import { TableauService } from 'src/app/service/tableau.service';
import { Section } from 'src/app/models/tableau';
import { ActivatedRoute } from '@angular/router';
import { AddFicheComponent } from '../add-fiche/add-fiche.component';
import { Fiche } from 'src/app/models/fiche';
import { DetailsComponent } from '../details/details.component';
import { UpdateComponent } from '../update/update.component';
import { AddSectionComponent } from 'src/app/add-section/add-section.component';
import { FormSearchFiche } from 'src/app/search/search.component';


export interface DialogData {
  id: any;
}


@Component({
  selector: 'app-list-fiches',
  templateUrl: './list-fiches.component.html',
  styleUrls: ['./list-fiches.component.css']
})
export class ListFichesComponent implements OnInit {
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faPlus = faPlus;
  sections: Section[] = [];
  tableauId: any;
  tableauNom: string;
  formSearchFiche = new FormSearchFiche('');
  searchText: any

  constructor(
    private modalService: NgbModal,
    public dialog: MatDialog,
    private ficheService: FicheService,
    private tableauService: TableauService,
    private routeActive: ActivatedRoute) {

  }

  rechercherFiche(nomFiche) {
    console.log(nomFiche)
    this.sections = this.ficheService.rechercherFiche(nomFiche, this.sections);
  }

  open(content) {
    let modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openModal(sectionId: any) {
    let modalRef = this.modalService.open(AddFicheComponent);
    modalRef.componentInstance.sectionId = sectionId;
  }

  openDetails(fiche: Fiche) {
    console.log(fiche)
    let modalRef = this.modalService.open(DetailsComponent);
    modalRef.componentInstance.fiche = fiche;
  }

  openEditPage(fiche: Fiche) {
    let modalRef = this.modalService.open(UpdateComponent);
    modalRef.componentInstance.fiche = fiche;
  }

  openDialog(ficheId: any): void {
    const dialogRef = this.dialog.open(DialogDelete, {
      width: '250px',
      data: { id: ficheId }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getSections();
      console.log('The dialog was closed');
    });
  }

  ngOnInit(): void {
    let tableau = this.routeActive.snapshot.paramMap.get('tableauId');
    this.tableauId = tableau.split('-')[0];
    this.tableauNom = tableau.split('-')[1];
    this.getSections();
  }



  delete(id: any): void {
    this.ficheService.deleteFiche(id);
  }

  getSections(): void {
    this.tableauService.getTableauById(this.tableauId).subscribe((data) => {
      this.sections = []
      data.sections.forEach(value => this.sections.push(value));
    })
  }

  openAddSection(tableauId: any) {
    let modalRef = this.modalService.open(AddSectionComponent);
    modalRef.componentInstance.tableauId = tableauId;
  }

}

@Component({
  selector: 'dialog_delete',
  templateUrl: 'dialog_delete.html',
})
export class DialogDelete {

  constructor(
    public dialogRef: MatDialogRef<DialogDelete>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private ficheService: FicheService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  delete(id: any): void {
    this.ficheService.deleteFiche(id).subscribe(resp => {
      this.dialogRef.close();
    }, () => {
      this.dialogRef.close();
    });
  }


}
