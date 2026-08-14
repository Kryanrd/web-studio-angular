import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ArticleType } from 'src/types/article.type';

@Component({
  selector: 'article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent {

  serverStaticPath = environment.serverStaticPath;
  @Input() article: ArticleType;

  constructor() {
    this.article = {
      id: '',
      title: '',
      description: '',
      image: '',
      date: '',
      category: '',
      url: ''
    }
  }

}
