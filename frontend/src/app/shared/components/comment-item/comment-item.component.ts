import { Component, Input, OnInit } from '@angular/core';
import { CommentType } from 'src/types/comment.type';
import { CommentService } from '../../services/comment.service';
import { UserActionType } from 'src/types/user-action.type';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'comment-item',
  templateUrl: './comment-item.component.html',
  styleUrls: ['./comment-item.component.scss']
})
export class CommentItemComponent implements OnInit {

  @Input() comment: CommentType;
  currentLikes: number = 0;
  currentDislikes: number = 0;
  currentAction: UserActionType | null = null;
  readonly UserActionType = UserActionType;
  private _userAction: UserActionType | null = null;
  @Input() set userAction(value: UserActionType | null) {
    this._userAction = value;
    this.currentAction = value;
  }

  constructor(private commentService: CommentService, private _snackBar: MatSnackBar) {
    this.comment = {
      id: '',
      text: '',
      date: '',
      likesCount: 0,
      dislikesCount: 0,
      user: {
        id: '',
        name: ''
      }
    }
  }

  get userAction(): UserActionType | null {
    return this._userAction;
  }

  ngOnInit(): void {
    this.currentLikes = this.comment.likesCount;
    this.currentDislikes = this.comment.dislikesCount;
  }

  handleAction(action: UserActionType): void {
    if (action === UserActionType.violate) return;

    const previousAction = this.currentAction;
    const previousLikes = this.currentLikes;
    const previousDislikes = this.currentDislikes;

    if (previousAction === action) {
      this.currentAction = null;
      if (action === UserActionType.like) this.currentLikes--;
      if (action === UserActionType.dislike) this.currentDislikes--;
    } else {
      if (previousAction === UserActionType.like) this.currentLikes--;
      if (previousAction === UserActionType.dislike) this.currentDislikes--;

      this.currentAction = action;
      if (action === UserActionType.like) this.currentLikes++;
      if (action === UserActionType.dislike) this.currentDislikes++;
    }

    this.commentService.applyAction(this.comment.id, action).subscribe({
      next: () => {
        this._snackBar.open('Ваш голос учтен');
        this.comment.likesCount = this.currentLikes;
        this.comment.dislikesCount = this.currentDislikes;
      },
      error: (err) => {
        this.currentAction = previousAction;
        this.currentLikes = previousLikes;
        this.currentDislikes = previousDislikes;
        this._snackBar.open(err.error?.message || 'Ошибка');
      }
    });
  }

  handleViolate(): void {
    this.commentService.applyAction(this.comment.id, UserActionType.violate).subscribe({
      next: () => {
        this._snackBar.open('Жалоба отправлена');
      },
      error: (err) => {
        if (err.status === 400) {
          this._snackBar.open('Жалоба уже отправлена');
        } else {
          this._snackBar.open('Ошибка при отправке жалобы');
        }
      }
    });
  }

}
