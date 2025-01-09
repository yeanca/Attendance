import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { v4 as uuidv4 } from 'uuid';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { SignIn } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private dbPath = '/attendance';
  setTime=environment.setTime;
  constructor(private db: AngularFireDatabase) {}

  signIn(data: any): Promise<void> {
    const id = uuidv4(); // Generate a unique ID
    const timestamp = new Date(); // Get current time as a Date object
    const currentHours = timestamp.getHours(); // Get current hours
    const currentMinutes = timestamp.getMinutes(); // Get current minutes
    const [comparisonHours, comparisonMinutes] = this.setTime.split(':').map(Number);
    const late: boolean = (currentHours > comparisonHours) || 
                          (currentHours === comparisonHours && currentMinutes > comparisonMinutes);
    const dataWithIdAndTimestamp = { id, ...data, timestamp: timestamp.toISOString(), late }; // Add ID, timestamp, and late to data

  // console.log('Data to be saved:', dataWithIdAndTimestamp);

    return this.db.list(this.dbPath).set(id, dataWithIdAndTimestamp) 
      .then(() => {
        console.log('Data saved successfully with ID:', id);
      })
      .catch((error) => {
        console.error('Error saving data: ', error);
      });
}

  signOut(id: string, updatedData: Partial<SignIn>): Promise<void> {
      return this.db.list(this.dbPath).update(id, updatedData)
        .then(() => {
          console.log('Data updated successfully with ID:', id);
        })
        .catch((error) => {
          console.error('Error updating data: ', error);
        });
    }


  fetchDataByNameAndDate(name: string): Observable<SignIn | null> {
    const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

    return this.db.list(this.dbPath, ref => ref.orderByChild('name').equalTo(name)).snapshotChanges()
      .pipe(
        map(actions => 
          actions.map(a => {
            const data = a.payload.val();
            const id = a.payload.key;

            // Check if data is an object and return a new object
            if (data && typeof data === 'object') {
              return { id, ...data } as SignIn; // Cast to DataModel
            } else {
              return { id } as SignIn; // Return an object with just the id if data is not an object
            }
          })
        ),
        map(dataArray => dataArray.find(item => {
          const itemDate = item.timestamp ? item.timestamp.split('T')[0] : null; // Extract date from timestamp
          return itemDate === today; // Return the first matching item
        }))
      );
  }


  fetchDataByNameAndDateRange(name: string): Observable<SignIn[]> {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    return this.db.list(this.dbPath, ref => ref.orderByChild('name').equalTo(name)).snapshotChanges()
      .pipe(
        map(actions => 
          actions.map(a => {
            const data = a.payload.val();
            const id = a.payload.key;

            // Check if data is an object and return a new object
            if (data && typeof data === 'object') {
              return { id, ...data } as SignIn; // Cast to SignIn
            } else {
              return { id } as SignIn; // Return an object with just the id if data is not an object
            }
          })
        ),
        map(dataArray => dataArray.filter(item => {
          const itemDate = item.timestamp ? new Date(item.timestamp) : null; // Convert timestamp to Date object
          return itemDate && itemDate >= sevenDaysAgo && itemDate <= today; // Filter items within the last 7 days
        }))
      );
  }


  // Fetch data for the current month
  fetchCurrentMonthData(): Observable<SignIn[]> {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59).toISOString();

    return this.db.list<SignIn>(this.dbPath, ref => 
      ref.orderByChild('timestamp').startAt(startOfMonth).endAt(endOfMonth)
    ).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.val() as SignIn;
        const id = a.payload.key;
        return { id, ...data };
      }))
    );
  }

  // Fetch data over a specified time range
  fetchDataInRange(startDate: string, endDate: string): Observable<SignIn[]> {
    return this.db.list<SignIn>(this.dbPath, ref => 
      ref.orderByChild('timestamp').startAt(startDate).endAt(endDate)
    ).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.val() as SignIn;
        const id = a.payload.key;
        return { id, ...data };
      }))
    );
  }

  //fetch data for date
  fetchDataByDate(inputDate: string): Observable<SignIn[]> {
    return this.db.list(this.dbPath).snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.val();
            const id = a.payload.key;
  
            // Check if data is an object and return a new object
            if (data && typeof data === 'object') {
              return { id, ...data } as SignIn; // Cast to SignIn model
            } else {
              return { id } as SignIn; // Return an object with just the id if data is not an object
            }
          })
        ),
        map(dataArray =>
          dataArray.filter(item => {
            const itemDate = item.timestamp ? item.timestamp.split('T')[0] : null; // Extract date from timestamp
            return itemDate === inputDate; // Filter items matching the inputDate
          })
        )
      );
  }
  


}
