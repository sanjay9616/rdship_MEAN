import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { distinctUntilChanged, startWith } from 'rxjs/operators';
import { MESSAGES } from 'src/app/config/message';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { AlertMessageService } from 'src/app/modules/shared/_services/alert-message.service';
import { HomeService } from '../../services/home.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {

  formGroup!: FormGroup;
  isOpenFilers: boolean = false;
  toggleAllBrandsCheckboxState: boolean = false;
  toggleAllSubcategoriesCheckboxState: boolean = false;
  routeParams: any = {};
  subCategoriesListOptions: Array<any> = [];
  brandsListOptions: Array<any> = [];
  priceList: Array<any> = [
    { view: '₹901 - ₹1000', value: 1000 },
    { view: '₹801 - ₹900', value: 900 },
    { view: '₹701 - ₹800', value: 800 },
    { view: '₹601 - ₹700', value: 700 },
    { view: '₹501 - ₹600', value: 600 },
    { view: '₹401 - ₹500', value: 500 },
    { view: '₹301 - ₹400', value: 400 },
    { view: '₹201 - ₹300', value: 300 },
    { view: '₹101 - ₹200', value: 200 },
    { view: '₹1 - ₹100', value: 100 },
  ];
  ratingList: Array<any> = [
    { view: 5, value: 5 },
    { view: 4, value: 4 },
    { view: 3, value: 3 },
    { view: 2, value: 2 },
    { view: 1, value: 1 },
  ];
  discountPercent: Array<any> = [
    { view: '70% or more', value: 70 },
    { view: '60% or more', value: 60 },
    { view: '50% or more', value: 50 },
    { view: '40% or more', value: 40 },
    { view: '30% or more', value: 30 },
    { view: '20% or more', value: 20 },
    { view: '10% or more', value: 10 },
    { view: '0% or more', value: 0 },
  ];
  pageDetails: any = {};
  subCategoryMultiFilterCtrl: FormControl = new FormControl(null);
  brandMultiFilterCtrl: FormControl = new FormControl(null);

  constructor(private activatedRoute: ActivatedRoute,
    private alertMessage: AlertMessageService,
    private homeService: HomeService,
    private router: Router,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((routeParams: any) => {
      this.routeParams = routeParams;
    })
    this.initFormGroup();
    this.getProductDetails();
  }

  openCloseFilters() {
    this.isOpenFilers = !this.isOpenFilers;
  }

  initFormGroup() {
    this.formGroup = new FormGroup({
      searchStr: new FormControl(this.routeParams?.searchStr || null),
      category: new FormControl(this.routeParams?.category?.length ? [this.routeParams?.category] : []),
      subCategories: new FormControl([]),
      brands: new FormControl([]),
      sellingPrice: new FormControl(null),
      rating: new FormControl(null),
      discountPercent: new FormControl(null),
      itemsPerPage: new FormControl(10),
      currentPage: new FormControl(1),
    })
    this.formGroupValueChanges();
  }

  formGroupValueChanges() {
    this.formGroup.valueChanges.pipe(
      distinctUntilChanged((prev: any, next: any) => JSON.stringify(prev) == JSON.stringify(next))
    ).subscribe(() => {
      this.getProductDetails();
    });
  }

  getProductDetails() {
    this.homeService.getProductDetails(this.formGroup?.value).subscribe((res: any) => {
      if (res?.status == 200 && res?.success) {
        this.pageDetails = res?.data;
        this.pageDetails.items = this.authService.addIsFavoriteAndIsCartItemsKey(this.pageDetails.items);
        this.subCategoryMultiFilterCtrlValueChanges();
        this.brandMultiFilterCtrlValueChanges();
        this.formGroup.get('currentPage')?.patchValue(1, { emitEvent: false });
      } else {
        this.alertMessage.addError(MESSAGES.ERROR.SOMETHING_WENT_WRONG).show();
      }
    }, (err: any) => {
      this.alertMessage.addError(MESSAGES.ERROR.SOMETHING_WENT_WRONG).show();
    })
  }

  removeFilter(formControlName: string, i?: number) {
    if (i == undefined) {
      this.formGroup.get(formControlName)?.patchValue(null);
    } else {
      let formControlValue = this.formGroup.get(formControlName)?.value;
      formControlValue.splice(i, 1)
      this.formGroup.get(formControlName)?.patchValue(formControlValue);
      this.getProductDetails();
    }
    this.toggleSubCategories();
    this.toggleBrand();
  }

  clearFilter() {
    this.initFormGroup();
    this.formGroup.updateValueAndValidity();
    this.toggleAllSubcategoriesCheckboxState = false;
    this.toggleAllBrandsCheckboxState = false;
  }


  subCategoryMultiFilterCtrlValueChanges() {
    this.subCategoryMultiFilterCtrl.valueChanges
      .pipe(
        startWith(''),
        distinctUntilChanged((prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
      )
      .subscribe(() => {
        this.subCategoriesListOptions = this.subCategoryListFilter(this.subCategoryMultiFilterCtrl?.value);
      });
  }

  brandMultiFilterCtrlValueChanges() {
    this.brandMultiFilterCtrl.valueChanges
      .pipe(
        startWith(''),
        distinctUntilChanged((prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
      )
      .subscribe(() => {
        this.brandsListOptions = this.brandListFilter(this.brandMultiFilterCtrl?.value);
      });
  }

  subCategoryListFilter(value: string) {
    const filterValue: string = (value != null || value != undefined) ? value.toString().toLowerCase() : "";
    return this.pageDetails?.subCategories.filter((subcategory: any) => (subcategory).toLowerCase().includes(filterValue));

  }

  brandListFilter(value: string) {
    const filterValue: string = (value != null || value != undefined) ? value.toString().toLowerCase() : "";
    return this.pageDetails?.brands.filter((brand: any) => (brand).toLowerCase().includes(filterValue));
  }

  toggleAllSubCategories(event: boolean) {
    this.formGroup.get('subCategories')?.patchValue(event ? this.pageDetails.subCategories : []);
    this.toggleSubCategories();
  }

  toggleAllBrands(event: boolean) {
    this.formGroup.get('brands')?.patchValue(event ? this.pageDetails.brands : []);
    this.toggleBrand();
  }

  toggleSubCategories() {
    this.toggleAllSubcategoriesCheckboxState = JSON.stringify(this.pageDetails?.subCategories) == JSON.stringify(this.formGroup.get('subCategories')?.value);
  }

  toggleBrand() {
    this.toggleAllBrandsCheckboxState = JSON.stringify(this.pageDetails?.brands) == JSON.stringify(this.formGroup.get('brands')?.value);
  }

  search(event: any) {
    this.formGroup.get('currentPage')?.patchValue(event, { emitEvent: false });
  }

  addCartItem(item: any) {
    this.homeService.addCartItem(this.authService.getUserId(), item).subscribe((res: any) => {
      if (res?.status == 204 && res?.success) {
        this.alertMessage.addWarning(MESSAGES.WARNING.ALREADY_ADDED_IN_CART).show();
      } else if (res?.status == 200 && res?.success) {
        this.authService.setCartItems(res?.data);
        this.pageDetails.items = this.authService.addIsFavoriteAndIsCartItemsKey(this.pageDetails.items);
        this.alertMessage.addSuccess(MESSAGES.SUCCESS.ADDED_CART_ITEM).show();
      } else {
        this.alertMessage.addError(MESSAGES.ERROR.SOMETHING_WENT_WRONG).show();
      }
    }, (err: any) => {
      this.alertMessage.addError(MESSAGES.ERROR.SOMETHING_WENT_WRONG).show();
    })
  }

  addRemoveFavoriteItem(item: any) {
    if (item?.isFavorite) {
      this.homeService.deleteFavoriteItem(this.authService.getUserId(), item._id).subscribe((res: any) => {
        if (res?.status == 200 && res?.success) {
          this.authService.setFevoriteItems(res?.data);
          this.pageDetails.items = this.authService.addIsFavoriteAndIsCartItemsKey(this.pageDetails.items);
          this.alertMessage.addSuccess(MESSAGES.SUCCESS.FAVORITE_ITEM_DELETED).show();
        } else {
          this.alertMessage.addError(MESSAGES.ERROR.SOMETHING_WENT_WRONG).show();
        }
      }, (err: any) => {
        this.alertMessage.addError(MESSAGES.ERROR.SOMETHING_WENT_WRONG).show();
      })
    } else {
      this.homeService.addFavoriteItem(this.authService.getUserId(), item).subscribe((res: any) => {
        if (res?.status == 204 && res?.success) {
          this.alertMessage.addWarning(MESSAGES.WARNING.ALREADY_ADDED_IN_WISH_LIST).show();
        } else if (res?.status == 200 && res?.success) {
          this.authService.setFevoriteItems(res?.data);
          this.pageDetails.items = this.authService.addIsFavoriteAndIsCartItemsKey(this.pageDetails.items);
          this.alertMessage.addSuccess(MESSAGES.SUCCESS.ADDED_FAVORITE_ITEM).show();
        } else {
          this.alertMessage.addError(MESSAGES.ERROR.SOMETHING_WENT_WRONG).show();
        }
      }, (err: any) => {
        this.alertMessage.addError(MESSAGES.ERROR.SOMETHING_WENT_WRONG).show();
      })
    }
  }

  viewItemDetail(item: any) {
    this.router.navigate([`view-item/${item?._id}`]);
  }

}
