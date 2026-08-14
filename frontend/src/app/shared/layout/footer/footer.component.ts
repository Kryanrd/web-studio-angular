import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { RepositionScrollStrategy } from '@angular/cdk/overlay';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openConsultationDialog(): void {
    this.dialog.open(DialogComponent, {
      width: '727px',
      panelClass: 'dialog',
      scrollStrategy: new NoopScrollStrategy(),
      data: { mode: 'consultation' }
    });
  }

}
