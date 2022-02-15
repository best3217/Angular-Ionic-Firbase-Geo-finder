import { Injectable } from '@angular/core';
import { Action, AngularFirestore, DocumentChangeAction, DocumentData, DocumentReference, DocumentSnapshot, Query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  estados = {
    todos: [true,false],
    activos: [true],
    inactivos: [false]
  };

  constructor(private db: AngularFirestore) { }

  insert(collection: string, data: Partial<any>): Promise<DocumentReference> {
    return this.db.collection(collection).add(data);
  }

  update() {

  }
  
  delete(collection: string, id: string): Promise<void> {
    return this.db.doc(`${collection}/${id}`).delete();
  }

  async deleteAll(collection: string) {
    const qry = await this.db.collection(collection).ref.get();

    qry.forEach(doc => {
       doc.ref.delete();
    });
 }

  getById(collection: string, id: string) {
    return this.db.doc(`${collection}/${id}`).valueChanges({ idField: 'id' }) as Observable<any>;
  }

  getAll(collection: string): Observable<DocumentChangeAction<any>[]> {
    return this.db.collection(collection).snapshotChanges().pipe(
      take(1),
      map((item: any) =>
        item.map((action: any) => {
          const data = action.payload.doc.data() as any;
          return { ...data };
        })
      )
    );
  }

  updateById(collection: string, id: string, data: Partial<any>): Promise<void> {
    return this.db.doc(`${collection}/${id}`).set(data, { merge: true });
  }
}

