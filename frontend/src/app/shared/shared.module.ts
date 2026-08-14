import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogComponent } from './components/dialog/dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ArticleCardComponent } from './components/article/article-card.component';
import { RouterModule } from '@angular/router';
import { CommentItemComponent } from './components/comment-item/comment-item.component';


@NgModule({
  declarations: [
    DialogComponent,
    ArticleCardComponent,
    CommentItemComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    RouterModule
],
  exports: [DialogComponent, ArticleCardComponent, CommentItemComponent]
})
export class SharedModule { }
