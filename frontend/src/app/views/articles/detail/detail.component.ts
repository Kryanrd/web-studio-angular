import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { ArticleService } from 'src/app/shared/services/article.service';
import { CommentService } from 'src/app/shared/services/comment.service';
import { environment } from 'src/environments/environment';
import { ArticleType } from 'src/types/article.type';
import { CommentType } from 'src/types/comment.type';
import { UserActionType } from 'src/types/user-action.type';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  article!: ArticleType;
  relatedArticles: ArticleType[] = [];
  isLogged: boolean = false;
  allCommentsCount: number = 0;
  displayedComments: CommentType[] = [];
  commentText: string = '';
  userActions: { [key: string]: UserActionType } = {};
  isLoadingMore: boolean = false;

  serverStaticPath = environment.serverStaticPath;
  constructor(private articleService: ArticleService,
    private activatedRoute: ActivatedRoute,
    private commentService: CommentService,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {
    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
    })
    this.activatedRoute.params.subscribe(params => {
      this.articleService.getArticle(params['url'])
        .subscribe((articles: ArticleType) => {
          this.article = articles;
          this.loadComments(0);

          this.commentService.getArticleCommentActions(this.article.id)
            .subscribe(actions => {
              actions.forEach(item => {
                this.userActions[item.comment] = item.action;
              });
            });
        });

      this.articleService.getRelatedArticles(params['url'])
        .subscribe((relatedArticles: ArticleType[]) => {
          this.relatedArticles = relatedArticles;
        });
    });
  }

  loadComments(offset: number): void {
    this.commentService.getComments({
      article: this.article.id,
      offset: offset
    }).subscribe({
      next: (data) => {
        this.allCommentsCount = data.allCount;
        this.isLoadingMore = false;
        this.cdr.detectChanges();

        if (offset === 0) {
          this.displayedComments = data.comments.slice(0, 3);
        } else {
          this.displayedComments = [...this.displayedComments, ...data.comments];
        }
      },
      error: (err) => {
        console.error('Ошибка при загрузке комментариев:', err);
        this.isLoadingMore = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadMoreComments(): void {
    const currentLength = this.displayedComments.length;
    if (this.allCommentsCount > currentLength) {
      this.isLoadingMore = true;
      this.cdr.detectChanges();
      setTimeout(() => {
        this.loadComments(currentLength);
      }, 300);
    }
  }

  addComment(): void {
    const text = this.commentText.trim();
    if (!text) {
      this._snackBar.open('Напишите текст комментария');
      return;
    }

    this.commentService.addComment(this.article.id, text).subscribe({
      next: () => {
        this._snackBar.open('Комментарий опубликован!');
        this.commentText = '';
        this.loadComments(0);
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Ошибка при публикации комментария';
        this._snackBar.open(errorMessage, 'Закрыть', { duration: 3000 });
      }
    });
  }
}
