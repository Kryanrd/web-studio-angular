import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommentParamsType } from 'src/types/comment-params.type';
import { CommentType } from 'src/types/comment.type';
import { DefaultResponseType } from 'src/types/default-response.type';
import { UserActionType } from 'src/types/user-action.type';

@Injectable({
    providedIn: 'root'
})
export class CommentService {

    constructor(private http: HttpClient) { }

    getComments(params: CommentParamsType): Observable<{ allCount: number, comments: CommentType[] }> {
        return this.http.get<{ allCount: number, comments: CommentType[] }>(environment.api + 'comments', {
            params: params
        })
    }

    addComment(id: string, text: string): Observable<DefaultResponseType> {
        return this.http.post<DefaultResponseType>(environment.api + 'comments', {
            article: id,
            text: text
        })
    }

    applyAction(id: string, action: UserActionType): Observable<DefaultResponseType> {
        return this.http.post<DefaultResponseType>(environment.api + 'comments/' + id + '/apply-action', {
            action
        })
    }

    getArticleCommentActions(articleId: string): Observable<{ comment: string, action: UserActionType }[]> {
        return this.http.get<{ comment: string, action: UserActionType }[]>(
            environment.api + 'comments/article-comment-actions',
            {
                params: { articleId: articleId }
            }
        );
    }
}
