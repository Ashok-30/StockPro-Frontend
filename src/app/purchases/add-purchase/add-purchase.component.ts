import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { timer } from 'rxjs';

import { PurchaseService } from '../../purchase.service';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../dash/sidebar/sidebar.component';
import { Purchase } from '../../../purchase.model';

@Component({
  selector: 'app-add-purchase',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './add-purchase.component.html',
  styleUrls: ['./add-purchase.component.css']
})
export class AddPurchaseComponent {
  purchase= {
   
    name: '',
    price: 0,

    supplier: '',
    quantity: 0
  };

  message: string | null = null;

  constructor(private purchaseService: PurchaseService, private router: Router) { }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.purchaseService.addPurchase(this.purchase).subscribe({
        next: (response) => {
          console.log('Purchase added successfully:', response);
          this.message = 'Purchase added successfully!';
          timer(1500).subscribe(() => {
            this.router.navigate(['/purchase']);
            this.message = null;
          });
          form.resetForm();
        },
        error: (error) => {
          console.error('Error adding purchase:', error);
          this.message = 'An error occurred while adding the purchase.';
        }
      });
    } else {
      this.message = 'Form is invalid. Please check the fields.';
    }
  }
}
