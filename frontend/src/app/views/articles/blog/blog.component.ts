import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from 'src/app/shared/services/article.service';
import { ActiveParamsUtil } from 'src/app/shared/utils/active-params.util';
import { ActiveParamsType } from 'src/types/active-params.type';
import { ArticleType } from 'src/types/article.type';
import { debounceTime } from 'rxjs';
import { AppliedFilterType } from 'src/types/applied-filter.type';
import { CategoryService } from 'src/app/shared/services/category.service';
import { CategoryType } from 'src/types/category.type';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  constructor(private articleService: ArticleService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService) { }

  categories: CategoryType[] = [];
  articles: ArticleType[] = [];
  pages: number[] = [];
  activeParams: ActiveParamsType = {};
  filterOpen: boolean = false;
  appliedFilters: AppliedFilterType[] = [];

  ngOnInit() {
    this.activatedRoute.queryParams
      .subscribe(params => {
        this.activeParams = ActiveParamsUtil.processParams(params);

        if (this.categories.length === 0) {
          this.categoryService.getCategories().subscribe(categories => {
            this.categories = categories;
            this.updateAppliedFilters();
            this.loadArticles(); // Загружаем статьи уже с учетом фильтров
          });
        } else {
          this.updateAppliedFilters();
          this.loadArticles();
        }
      });
  }

  private loadArticles() {
    this.articleService.getAllArticles(this.activeParams)
      .subscribe((data) => {
        this.pages = [];
        for (let i = 1; i <= data.pages; i++) {
          this.pages.push(i);
        }
        this.articles = data.items;
      });
  }

  updateAppliedFilters(): void {
    this.appliedFilters = [];
    if (this.activeParams.categories && this.activeParams.categories.length > 0) {
      this.activeParams.categories.forEach(catUrl => {
        const foundCategory = this.categories.find(c => c.url === catUrl);
        if (foundCategory) {
          this.appliedFilters.push({
            name: foundCategory.name,
            urlParam: foundCategory.url
          });
        }
      });
    }
  }

  isCategorySelected(url: string): boolean {
    return this.activeParams.categories?.includes(url) || false;
  }

  toggleCategory(url: string): void {
    let cats = this.activeParams.categories || [];
    cats = cats.includes(url) ? cats.filter(c => c !== url) : [...cats, url];
    if (cats.length === 0) delete this.activeParams.categories;
    else this.activeParams.categories = cats;
    this.activeParams.page = 1;
    this.router.navigate(['/blog'], { queryParams: this.activeParams });
  }

  removeAppliedFilter(filter: AppliedFilterType): void {
    this.toggleCategory(filter.urlParam);
  }

  openPage(page: number) {
    this.activeParams.page = page;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    });
  }
  openPrevPage() {
    const currentPage = this.activeParams.page || 1;
    if (currentPage > 1) {
      this.activeParams.page = currentPage - 1;
      this.router.navigate(['/blog'], { queryParams: this.activeParams });
    }
  }

  openNextPage() {
    const currentPage = this.activeParams.page || 1;
    if (currentPage < this.pages.length) {
      this.activeParams.page = currentPage + 1;
      this.router.navigate(['/blog'], { queryParams: this.activeParams });
    }
  }

  toggleSorting() {
    this.filterOpen = !this.filterOpen;
  }

  @ViewChild('filterContainer') filterContainer!: ElementRef<HTMLElement>;
  @HostListener('document:click', ['$event'])
  click(event: Event) {
    if (this.filterOpen) {
      if (!this.filterContainer?.nativeElement.contains((event.target as HTMLElement))) {
        this.filterOpen = false;
      }
    }
  }

}
