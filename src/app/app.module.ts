import { HttpClientModule } from '@angular/common/http';
import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  TuiAlert,
  TuiButton,
  TuiDataList,
  TuiDialog,
  TuiError,
  TuiFallbackSrcPipe,
  TuiIcon,
  TuiInitialsPipe,
  TuiLoader,
  TuiRoot,
  TuiSurface,
} from '@taiga-ui/core';
import { NG_EVENT_PLUGINS } from '@taiga-ui/event-plugins';
import {
  TuiInputModule,
  TuiInputPasswordModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/legacy';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TuiFor, TuiLet } from '@taiga-ui/cdk';
import { TuiAvatar, TuiChip, TuiFieldErrorPipe } from '@taiga-ui/kit';
import { TuiCardLarge } from '@taiga-ui/layout';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SearchComponent } from './search/search.component';
import { AuthInterceptorProvider } from './services/auth-interceptor.service';
import { AuthenticationService } from './services/authentication.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SearchComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    BrowserAnimationsModule,
    ReactiveFormsModule,
    TuiRoot,
    TuiDialog,
    TuiAlert,
    TuiInputModule,
    TuiError,
    TuiFieldErrorPipe,
    TuiInputPasswordModule,
    TuiButton,
    TuiChip,
    TuiTextfieldControllerModule,
    ...TuiDataList,
    TuiAvatar,
    TuiLet,
    CommonModule,
    TuiFor,
    TuiLoader,
    TuiCardLarge,
    TuiSurface,
    TuiIcon,
    TuiFallbackSrcPipe,
    TuiInitialsPipe,
  ],
  providers: [AuthenticationService, AuthInterceptorProvider, NG_EVENT_PLUGINS],
  bootstrap: [AppComponent],
  exports: [HeaderComponent],
})
export class AppModule {}
