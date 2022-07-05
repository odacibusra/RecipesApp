import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";
import { exhaustMap, map, take, tap } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";

@Injectable({providedIn: 'root'})
export class DataStorageService{
    constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService) {
        
    }

    storeRecipe() {
        const recipes = this.recipeService.getRecipes();
        return this.http
            .put('https://recipe-book-f7109-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
            recipes
        ).subscribe(res => {
            console.log(res);
        });
    }

    fetchRecipes() {
        return this.http.get<Recipe[]>('https://recipe-book-f7109-default-rtdb.europe-west1.firebasedatabase.app/recipes.json')
            .pipe(     
                map(recipes => {
                return recipes.map(recipe => {
                    return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] };
                });
            }),
                tap(recipes => {
                    this.recipeService.setRecipes(recipes);
                }));
    }
}