import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../dash/sidebar/sidebar.component';
import { ConfirmModalComponent } from '../../dash/confirm-modal/confirm-modal.component';
import { AuthService } from '../../auth.service';


@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, ConfirmModalComponent],
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  users: any[] = [];
  selectedUser: any;
  selectedFile: File | null = null;
  message: string = ''; 
  showModal: boolean = false; 
  showSuccessModal: boolean = false; 
  userToDelete: any = null;
  cdr: any;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.authService.getUsersByStore().subscribe(
      (data: any[]) => {
        this.users = data;
        console.log(this.users);
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  selectUser(user: any): void {
    this.selectedUser = { ...user };
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }
  

  updateUserImage(): void {
    if (this.selectedUser) {
      if (this.selectedFile) {
        this.authService.updateUserImage(this.selectedUser.id, this.selectedUser, this.selectedFile).subscribe(
          (response: any) => {
            console.log('User image updated successfully:', response);
            this.fetchUsers(); // Reload the user list to reflect changes
            this.resetForm();
          },
          (error) => {
            console.error('Error updating user image:', error); 
            this.message = 'Error updating user image';
            this.resetMessage();
          }
        );
      } else {
        this.authService.updateUser(this.selectedUser.id, this.selectedUser).subscribe(
          (response: any) => {
            console.log('User info updated successfully:', response);
            this.fetchUsers(); // Reload the user list to reflect changes
            this.resetForm();
          },
          (error) => {
            console.error('Error updating user info:', error);
            this.message = 'Error updating user info';
            this.resetMessage();
          }
        );
      }
    }
  }
  
  

  
  
  
  private resetForm(): void {
    this.message = 'User updated successfully!';
    this.selectedUser = null;
    this.selectedFile = null;
    this.resetMessage();
  }
  
  private resetMessage(): void {
    setTimeout(() => {
      this.message = '';
    }, 1000);
  }
  
  

  deleteUser(user: any): void {
    this.userToDelete = user;
    this.showModal = true;
  }

  confirmDelete(confirmed: boolean): void {
    this.showModal = false;
    if (confirmed && this.userToDelete) {
      this.authService.deleteUser(this.userToDelete.id).subscribe(
        (response) => {
          console.log(response);
          this.fetchUsers();
          this.message = 'User deleted successfully!';
          this.userToDelete = null;
          this.showSuccessModal = true;
        },
        (error) => {
          console.error('Error deleting user:', error);
          this.message = 'Error deleting user';
          this.userToDelete = null;
        }
      );
    }
  }

  handleSuccessModalClose(): void {
    this.showSuccessModal = false;
  }

  cancelEdit(): void {
    this.selectedUser = null;
  }
  
  
}