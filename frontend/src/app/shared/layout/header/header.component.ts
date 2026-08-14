import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isLogged: boolean = false;
  userName: string | null = null;
  private subscription: Subscription = new Subscription();

  constructor(private authService: AuthService, private _snackBar: MatSnackBar,
    private router: Router) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {
    this.subscription.add(
      this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
        this.isLogged = isLoggedIn;
      })
    );
    this.subscription.add(
      this.authService.userName$.subscribe((name: string | null) => {
        this.userName = name;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  logout(): void {
    this.authService.logout()
      .subscribe({
        next: () => {
          this.doLogOut();

        },
        error: () => {
          this.doLogOut();
        }
      })
  }

  doLogOut(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this.authService.clearUserName();
    this._snackBar.open('Вы вышли из системы');
    this.router.navigate(['/']);
  }
}
