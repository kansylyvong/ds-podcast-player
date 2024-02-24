import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PodcastListComponent } from './components/podcasts/podcast-list.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { MatButtonModule } from "@angular/material/button";
import { MatListModule } from "@angular/material/list";
import { MatSliderModule } from "@angular/material/slider";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from '@angular/material/divider';
import { StarComponent } from './shared/star.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PodcastDetailComponent } from './components/podcasts/podcast-detail.component';
import { RouterModule } from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { appReducer } from './store/podcasts.reducer';
import { EffectsModule } from '@ngrx/effects';
import { PodcastEffects } from './store/podcasts.effects';
import { LoginComponent } from './components/login/login.component';
import { JwtInterceptor } from './services/jwtinterceptor.service';


@NgModule({
  declarations: [
    AppComponent,
    PodcastListComponent,
    StarComponent,
    PodcastDetailComponent,
    LoginComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    MatListModule,
    MatSliderModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatDividerModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    RouterModule,
    StoreModule.forRoot({podcasts: appReducer}),
    EffectsModule.forRoot([PodcastEffects]),
    BrowserAnimationsModule
  ],
  exports: [  MatButtonModule,
    MatListModule,
    MatSelectModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
