import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../auth.service';
import { SidebarComponent } from '../../../dash/sidebar/sidebar.component';
import { ConfirmModalComponent } from '../../../dash/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, ConfirmModalComponent],
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  users: any[] = [];
  selectedUser: any = null;
  message: string = ''; 
  showModal: boolean = false; 
  showSuccessModal: boolean = false; 
  userToDelete: any = null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.authService.getUsersByStore().subscribe(
      (data: any[]) => {
        this.users = data;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  selectUser(user: any): void {
    this.selectedUser = { ...user };
  }

  updateUser(): void {
    if (this.selectedUser) {
      this.authService.updateUser(this.selectedUser.id, this.selectedUser).subscribe(
        (updatedUser: any) => {
          this.fetchUsers();
          this.selectedUser = null;
          this.message = 'User updated successfully!';
        },
        (error) => {
          console.error('Error updating user:', error);
          this.message = 'Error updating user';
        }
      );
    }
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
