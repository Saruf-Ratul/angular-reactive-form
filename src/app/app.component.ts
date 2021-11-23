import { Component } from "@angular/core";
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray
} from "@angular/forms";
import { CurrencyPipe } from "@angular/common";
import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { first } from "rxjs/operators";
import { LocalStorageService } from "ngx-webstorage";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  name = "Angular 10 reactive form with dynamic fields and validations example";
  exampleForm: FormGroup;
  totalSum: number = 0;
  myFormValueChanges$;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private storage: LocalStorageService,
    private currencyPipe: CurrencyPipe
  ) {}

  /**
   * Form initialization
   */
  ngOnInit() {
    // create form with validators and dynamic rows array
    this.exampleForm = this.formBuilder.group({
      companyName: ["", [Validators.required, Validators.maxLength(25)]],
      countryName: [""],
      city: [""],
      zipCode: [""],
      street: [""],
      units: this.formBuilder.array([
        // load first row at start
        this.getUnit()
      ])
    });
    // initialize stream on units
    this.myFormValueChanges$ = this.exampleForm.controls["units"].valueChanges;
    // subscribe to the stream so listen to changes on units
    this.myFormValueChanges$.subscribe(units =>
      this.updateTotalUnitPrice(units)
    );

    // preload some data into form fields
    const geoIpInfo = this.storage.retrieve("geoIpInfo");
    if (geoIpInfo) {
      this.exampleForm.patchValue({
        countryName: geoIpInfo.country_name,
        city: geoIpInfo.city,
        zipCode: geoIpInfo.postal,
        companyName: geoIpInfo.org
      });
    } else {
      this.getCountryByIpOnline()
        .pipe(first())
        .subscribe(
          (res: any) => {
            console.log("This is your IP information: ", res);
            // put responce into storage so no nedded request it again on reload
            this.storage.store("geoIpInfo", res);
            // update form data
            this.exampleForm.patchValue({
              countryName: res.country_name,
              city: res.city,
              zipCode: res.postal,
              companyName: res.org
            });
          },
          err => {
            this.exampleForm.patchValue({
              countryName: "N/A",
              city: "N/A",
              zipCode: "N/A"
            });
          }
        );
    }
  }

  /**
   * unsubscribe listener
   */
  ngOnDestroy(): void {
    this.myFormValueChanges$.unsubscribe();
  }

  /**
   * Save form data
   */
  save(model: any, isValid: boolean, e: any) {
    e.preventDefault();
    alert("Form data are: " + JSON.stringify(model));
  }

  /**
   * Create form unit
   */
  private getUnit() {
    const numberPatern = "^[0-9.,]+$";
    return this.formBuilder.group({
      unitName: ["", Validators.required],
      qty: [1, [Validators.required, Validators.pattern(numberPatern)]],
      unitPrice: ["", [Validators.required, Validators.pattern(numberPatern)]],
      unitTotalPrice: [{ value: "", disabled: true }]
    });
  }

  /**
   * Add new unit row into form
   */
  addUnit() {
    const control = <FormArray>this.exampleForm.controls["units"];
    control.push(this.getUnit());
  }

  /**
   * Remove unit row from form on click delete button
   */
  removeUnit(i: number) {
    const control = <FormArray>this.exampleForm.controls["units"];
    control.removeAt(i);
  }

  /**
   * This is one of the way how clear units fields.
   */
  clearAllUnits() {
    const control = <FormArray>this.exampleForm.controls["units"];
    while (control.length) {
      control.removeAt(control.length - 1);
    }
    control.clearValidators();
    control.push(this.getUnit());
  }

  /**
   * This is example how patch units array. Before patch you have to create
   * same number of FormArray controls. As we have already one control created
   * by default we start from i = 1 not 0. This way it could be implemented in
   * ngOnInit in case of update just you have to prepare FormArray and then patch
   * whole form object not just units.
   */
  addSomeUnitsFromArrayExample() {
    const unitsArray = [
      { unitName: "test unit 1", qty: 2, unitPrice: 22.44 },
      { unitName: "test unit 2", qty: 1, unitPrice: 4 },
      { unitName: "test unit 3", qty: 44, unitPrice: 1.5 }
    ];
    const control = <FormArray>this.exampleForm.controls["units"];
    for (let i = 1; i < unitsArray.length; i++) {
      control.push(this.getUnit());
    }
    this.exampleForm.patchValue({ units: unitsArray });
  }

  /**
   * Update prices as soon as something changed on units group
   */
  private updateTotalUnitPrice(units: any) {
    // get our units group controll
    const control = <FormArray>this.exampleForm.controls["units"];
    // before recount total price need to be reset.
    this.totalSum = 0;
    for (let i in units) {
      let totalUnitPrice = units[i].qty * units[i].unitPrice;
      // now format total price with angular currency pipe
      let totalUnitPriceFormatted = this.currencyPipe.transform(
        totalUnitPrice,
        "USD",
        "symbol-narrow",
        "1.2-2"
      );
      // update total sum field on unit and do not emit event myFormValueChanges$ in this case on units
      control
        .at(+i)
        .get("unitTotalPrice")
        .setValue(totalUnitPriceFormatted, {
          onlySelf: true,
          emitEvent: false
        });
      // update total price for all units
      this.totalSum += totalUnitPrice;
    }
  }

  /**
   * Get online geoIp information to pre-fill form fields country, city and zip
   */
  private getCountryByIpOnline(): Observable<any> {
    return this.http.get("https://ipapi.co/json/");
  }
}
