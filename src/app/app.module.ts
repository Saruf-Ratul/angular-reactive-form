import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";
import { CurrencyPipe } from "@angular/common";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgxWebstorageModule } from "ngx-webstorage";

import { AppComponent } from "./app.component";
import { HelloComponent } from "./hello.component";
import { ErrorIntercept } from "./error.interceptor";

import { A11yModule } from "@angular/cdk/a11y";
import { BidiModule } from "@angular/cdk/bidi";
import { ObserversModule } from "@angular/cdk/observers";
import { OverlayModule } from "@angular/cdk/overlay";
import { PlatformModule } from "@angular/cdk/platform";
import { PortalModule } from "@angular/cdk/portal";

import { CdkStepperModule } from "@angular/cdk/stepper";
import { CdkTableModule } from "@angular/cdk/table";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatTableModule } from "@angular/material/table";

/**
 * NgModule that includes all Material modules that are required to serve
 * the Plunker.
 */
@NgModule({
  exports: [
    // CDK
    A11yModule,
    BidiModule,
    ObserversModule,
    OverlayModule,
    PlatformModule,
    PortalModule,
    CdkStepperModule,
    CdkTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatDividerModule,
    MatIconModule,
    MatToolbarModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule
  ]
})
export class MaterialModule {}

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgxWebstorageModule.forRoot(),
    MaterialModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  declarations: [AppComponent, HelloComponent],
  bootstrap: [AppComponent],
  providers: [
    CurrencyPipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorIntercept,
      multi: true
    }
  ]
})
export class AppModule {}
