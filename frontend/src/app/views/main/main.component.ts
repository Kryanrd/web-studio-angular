import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ArticleType } from 'src/types/article.type';
import { ArticleService } from 'src/app/shared/services/article.service';
import { NoopScrollStrategy } from '@angular/cdk/overlay';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(private dialog: MatDialog, private arcticleService: ArticleService) { }

  popularAcrticles: ArticleType[] = [];

  customOptionsStocks: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    margin: 25,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      }
    }
  }

  customOptionsReviews: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 3
      },
      400: {
        items: 3
      },
      740: {
        items: 3
      }
    }
  }

  stocks = [
    {
      name: 'Предложение месяца',
      text: 'Продвижение в Instagram для вашего бизнеса',
      extraText: '-15%',
      sign: '!',
      description: '',
      firstSpan: false,
      image: 'stock1.png',
      serviceType: 'Продвижение'
    },
    {
      name: 'Акция',
      text: 'Нужен грамотный',
      sign: '?',
      extraText: 'копирайтер',
      description: 'Весь декабрь у нас действует акция на работу копирайтера.',
      firstSpan: false,
      image: 'stock2.png',
      serviceType: 'Копирайтинг'
    },
    {
      name: 'Новость дня',
      text: 'в ТОП-10 SMM-агенств Москвы',
      extraText: '6 место',
      sign: '!',
      description: 'Мы благодарим каждого, кто голосовал за нас!',
      firstSpan: true,
      image: 'stock3.png',
      serviceType: 'SMM'
    },
  ];

  reviews = [
    {
      image: 'review1.png',
      name: 'Станислав',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.'
    },
    {
      image: 'review2.png',
      name: 'Алёна',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.'
    },
    {
      image: 'review3.png',
      name: 'Мария',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!'
    },
    {
      image: 'review1.png',
      name: 'Антон',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!'
    },
    {
      image: 'review2.png',
      name: 'Вика',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.'
    },
    {
      image: 'review3.png',
      name: 'Анжела',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.'
    },
  ];

  services = [
    {
      image: 'service1.png',
      title: 'Создание сайтов',
      text: 'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
      price: '7 500',
      serviceType: 'Фриланс'
    },
    {
      image: 'service2.png',
      title: 'Продвижение',
      text: 'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
      price: '3 500',
      serviceType: 'SMM'
    },
    {
      image: 'service3.png',
      title: 'Реклама',
      text: 'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.',
      price: '1000',
      serviceType: 'Таргет'
    },
    {
      image: 'service4.png',
      title: 'Копирайтинг',
      text: 'Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.',
      price: '750',
      serviceType: 'Копирайтинг'
    },
  ];

  ngOnInit(): void {
    this.arcticleService.getPopularArticles()
      .subscribe((data: ArticleType[]) => {
        this.popularAcrticles = data;
      });
  }

  openConsultationDialog(): void {
    this.dialog.open(DialogComponent, {
      width: '727px',
      panelClass: 'dialog',
    });
  }

  openServiceDialog(serviceType: string): void {
    this.dialog.open(DialogComponent, {
      width: '727px',
      panelClass: 'dialog',
      scrollStrategy: new NoopScrollStrategy(),
      data: {
        mode: 'service',
        serviceType: serviceType
      }
    });
  }

  openStockDialog(serviceType: string): void {
    this.dialog.open(DialogComponent, {
      width: '727px',
      panelClass: 'dialog',
      scrollStrategy: new NoopScrollStrategy(),
      data: {
        mode: 'service',
        serviceType: serviceType
      }
    });
  }
}
