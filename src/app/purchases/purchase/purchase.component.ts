import { Component, OnInit } from '@angular/core';
import { Purchase } from '../../../purchase.model';
import { PurchaseService } from '../../purchase.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../dash/sidebar/sidebar.component';

import { ConfirmModalComponent } from '../../dash/confirm-modal/confirm-modal.component';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-purchase',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent,ConfirmModalComponent],
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {
  purchases: Purchase[] = [];
  selectedPurchase: Purchase | null = null;
  showModal: boolean = false;
  purchaseToDelete: Purchase | null = null;
  message: string | null = null;
  showSuccessModal: boolean = false;

  constructor(private purchaseService: PurchaseService) {}

  ngOnInit(): void {
    this.fetchPurchases();
  }

  fetchPurchases(): void {
    this.purchaseService.getAllPurchases().subscribe({
      next: (data) => this.purchases = data,
      error: (error) => console.error('Error fetching purchases:', error)
    });
  }

  selectPurchase(purchase: Purchase): void {
    this.selectedPurchase = { ...purchase };
  }

  updatePurchase(): void {
    if (this.selectedPurchase) {
      this.purchaseService.updatePurchase(this.selectedPurchase.id!, this.selectedPurchase).subscribe({
        next: () => {
          this.fetchPurchases();
          this.selectedPurchase = null;
          this.message = 'Purchase updated successfully!';
          setTimeout(() => this.message = null, 1500);
        },
        error: (error) => {
          console.error('Error updating purchase:', error);
          this.message = 'Error updating purchase';
        }
      });
    }
  }



  deletePurchase(id: number): void {
   
    this.purchaseToDelete = this.purchases.find(purchase => purchase.id === id)!;
    this.showModal = true;
  }
  

 
  confirmDelete(confirmed: boolean): void {
    this.showModal = false;
    if (confirmed && this.purchaseToDelete) {
      this.purchaseService.deletePurchase(this.purchaseToDelete.id!).subscribe({
        next: () => {
          this.fetchPurchases();
          this.message = 'Purchase deleted successfully!';
          setTimeout(() => this.message = null, 1500);
          this.purchaseToDelete = null;
        },
        error: (error) => {
          console.error('Error deleting purchase:', error);
          this.message = 'Error deleting purchase. Please try again later.';
          this.purchaseToDelete = null;
        }
      });
    }
    this.showModal = false; // Ensure modal is closed after handling the confirmation
  }
  

  handleSuccessModalClose(): void {
    this.showSuccessModal = false;
  }

  cancelEdit(): void {
    this.selectedPurchase = null;
  }
  downloadExcel(): void {
    // Create a new workbook and name the sheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.purchases);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Purchases');

    // Write the workbook to a blob
    const wbout: Blob = new Blob([XLSX.write(wb, { bookType: 'xlsx', type: 'array' })], {
      type: 'application/octet-stream'
    });

    // Save the file
    saveAs(wbout, 'Purchases.xlsx');
  }
}
