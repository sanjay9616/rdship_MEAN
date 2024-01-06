import { Injectable } from "@angular/core";
import { ApiService } from "../../shared/_services/api.service";
import { environment as env, environment } from "src/environments/environment";
import { URL_LIST } from "src/app/config/urlList";
@Injectable({
  providedIn: 'root'
})
export class HomeService {

  userDetail: any = {};
  isAuthenticated: boolean = false;

  constructor(private apiService: ApiService,
  ) { }

  getProductDetails(data: any) {
    let url: string = `${env.rdShip.baseUrl}${URL_LIST.API.HOME.PRODUCT_DETAILS.URL}`;
    return this.apiService.post(url, data);
  }

  getItemInfo(id: string) {
    let url: string = `${env.rdShip.baseUrl}${URL_LIST.API.HOME.ITEM_INFO.URL}/${id}`;
    return this.apiService.get(url);
  }

  addCartItem(id: string, data: any) {
    let url: string = `${env.rdShip.baseUrl}${URL_LIST.API.CART_ITEMS.ADD_ITEM_TO_CART.URL}/${id}`;
    return this.apiService.post(url, data);
  }

  addFavoriteItem(id: string, data: any) {
    let url: string = `${env.rdShip.baseUrl}${URL_LIST.API.FAVORITE_ITEMS.ADD_FAVORITE_ITEM.URL}/${id}`;
    return this.apiService.post(url, data);
  }

  getCartItems(id: string) {
    let url: string = `${env.rdShip.baseUrl}${URL_LIST.API.CART_ITEMS.GET_CART_ITEMS.URL}/${id}`;
    return this.apiService.get(url);
  }

  getFavoriteItems(id: string) {
    let url: string = `${env.rdShip.baseUrl}${URL_LIST.API.FAVORITE_ITEMS.GET_FAVORITE_ITEMS.URL}/${id}`;
    return this.apiService.get(url);
  }

  deleteCartItem(userId: string, itemId: string) {
    let url: string = `${env.rdShip.baseUrl}${URL_LIST.API.CART_ITEMS.DELETE_CART_ITEM.URL}/${userId}/${itemId}`;
    return this.apiService.delete(url);
  }

  deleteFavoriteItem(userId: string, itemId: string) {
    let url: string = `${env.rdShip.baseUrl}${URL_LIST.API.FAVORITE_ITEMS.DELETE_FAVORITE_ITEM.URL}/${userId}/${itemId}`;
    return this.apiService.delete(url);
  }

  updateCartQty(userId: string, itemId: string, data: any) {
    let url: string = `${env.rdShip.baseUrl}${URL_LIST.API.CART_ITEMS.UPDATE_CART_QTY.URL}/${userId}/${itemId}`;
    return this.apiService.patch(url, data);
  }

  changeProductSpecification(itemId: string, data: any) {
    let url: string = `${env.rdShip.baseUrl}${URL_LIST.API.HOME.CHANGE_SPECIFICATION.URL}/${itemId}`;
    return this.apiService.post(url, data);
  }

  addRecentlyViewItems(useId: string, data: any) {
    let url: string = `${env.rdShip.baseUrl}${URL_LIST.API.RECENTLY_VIEW.ADD_RECENTLY_VIEW_ITEM.URL}/${useId}`;
    return this.apiService.post(url, data);
  }

  getHomeDetails(useId: string) {
    let url: string = `${env.rdShip.baseUrl}${URL_LIST.API.HOME.HOME_DETAILS.URL}/${useId}`;
    return this.apiService.get(url);
  }

  submitProductReview(userId: string, itemId: string, data: any) {
    let url: string = `${env.rdShip.baseUrl}${URL_LIST.API.REVIEW.SUBMIT_PRODUCT_REVIEW.URL}/${userId}/${itemId}`;
    return this.apiService.post(url, data);
  }

  submitQuestion(userId: string, itemId: string, data: any) {
    let url: string = `${env.rdShip.baseUrl}${URL_LIST.API.QUESTION_ANSWER.SUBMIT_QUESTION.URL}/${userId}/${itemId}`;
    return this.apiService.post(url, data);
  }

  ratingVote(userId: string, itemId: string, ratingId: string, vote: string, data: any) {
    let url: string = `${env.rdShip.baseUrl}${URL_LIST.API.REVIEW.VOTE.URL}/${userId}/${itemId}/${ratingId}/${vote}`;
    return this.apiService.patch(url, data);
  }

  questionVote(userId: string, itemId: string, questionId: string, vote: string, data: any) {
    let url: string = `${env.rdShip.baseUrl}${URL_LIST.API.QUESTION_ANSWER.VOTE.URL}/${userId}/${itemId}/${questionId}/${vote}`;
    return this.apiService.patch(url, data);
  }

}