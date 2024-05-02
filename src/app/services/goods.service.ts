import { EventEmitter, Injectable } from '@angular/core';
import { Good } from '../models/good';
import { HttpClient } from '@angular/common/http';
import { catchError, delay, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GoodsService {

  public goods:Good[]=[];

  public onGoodsCountChange=new EventEmitter();

  constructor(private http:HttpClient) { }

   

  public addGood(item:Good){
    this.goods.push(item);
    return this.http.post("https://kaledos-7fc07-default-rtdb.europe-west1.firebasedatabase.app/goods.json",item).pipe(
      tap(()=>this.onGoodsCountChange.emit())
    );
  }

  public loadData(){
    // Gauname observable
    return this.http
      .get<{[key:string]:Good}>("https://kaledos-7fc07-default-rtdb.europe-west1.firebasedatabase.app/goods.json")
      .pipe( 
          map( (data):Good[]=>{
            let goods=[];
            for (let x in data){
              goods.push({...data[x], id:x });
            }
            this.goods=goods;
            
            return goods;
          } ))
          /*
      .pipe(
          tap((data)=>{
      
            console.log("Duomenys is tap");
            this.goods=data;
          })
        )
        */
      /*.pipe(
        delay(1000)
      )*/ ;
  }

  public loadRecord(id:String){
    return this.http.get<Good>("https://kaledos-7fc07-default-rtdb.europe-west1.firebasedatabase.app/goods/"+id+".json");
  }
  

  public updateRecord(item:Good ){
    return this.http.patch("https://kaledos-7fc07-default-rtdb.europe-west1.firebasedatabase.app/goods/"+item.id+".json", item);

  }

  public deleteRecord(id:string){
    return this.http.delete("https://kaledos-7fc07-default-rtdb.europe-west1.firebasedatabase.app/goods/"+id+".json").pipe(
      tap(()=>this.onGoodsCountChange.emit())
    );
  }
}
