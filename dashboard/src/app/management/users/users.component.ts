import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../core/models/user.model';
import { UserService } from '../../core/services/user.service';
import { NotificationComponent } from '../../shared/notification/notification.component';
import { EditComponent } from './edit/edit.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  durationInSeconds = 5;

  public users: User[] = [];

  constructor(private userService: UserService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
    ) { }

 public ngOnInit(): void {
   this.loadUsers();
  }

  private loadUsers(){
    this.userService.get()
    .then(d=> {
      this.users = d;
    })
  }
  public newUser(){
    const dialogRef = this.dialog.open(EditComponent,{
      width: '80%',
      //height: '80%',
     data: {
      
     }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.result){
        this.loadUsers();
        this.snackBar.openFromComponent(NotificationComponent, {
          duration: this.durationInSeconds * 1000,
          panelClass: 'panel-success',
          data: {
            type: 'success',
            message: 'User created successfuly'
          }
        });
      }
      
    });

  }

  public edit(user: User){
    const dialogRef = this.dialog.open(EditComponent,{
      width: '80%',
      //height: '80%',
     data: {
       user: user
     }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.result){
        this.loadUsers();
        this.snackBar.openFromComponent(NotificationComponent, {
          duration: this.durationInSeconds * 1000,
          panelClass: 'panel-success',
          data: {
            type: 'success',
            message: 'User updated successfuly'
          }
        });
      }
      
    });

  }

  public delete(user: User){
    
  }
}
