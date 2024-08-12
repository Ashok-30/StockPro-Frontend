import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { ProductService } from '../../product.service';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../dash/sidebar/sidebar.component';
import { timer } from 'rxjs';



@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [FormsModule,CommonModule,SidebarComponent],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  product = {
    name: '',
    description: '',
    category: '',
    price: 0,
    quantity: 0,
    minimumQuantity: 0, 
    supplier: '',
    brand: '',
    attribute: '',
  };

  message: string | null = null;
  selectedFile: File | null = null;
  constructor(private productService: ProductService, private router: Router) { }
  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    this.selectedFile = target.files ? target.files[0] : null;
  }

  uploadFile() {
    if (this.selectedFile) {
      this.productService.uploadProductFile(this.selectedFile).subscribe(
        response => {
          this.message = 'File uploaded successfully!';
          timer(1500).subscribe(() => this.message = null);
        },
        error => {
          console.error('Error uploading file:', error);
          this.message = 'Failed to upload file.';
        }
      );
    } else {
      this.message = 'Please select a file to upload.';
    }
  }

  onSubmit(form: NgForm) {
    console.log('Product to be submitted', this.product);
    console.log('Form Submitted', form.valid);
    if (form.valid) {
      this.productService.addProduct(this.product).subscribe(
        response => {
          console.log('Response:', response);
          this.message = response; 
          form.resetForm();  
            timer(1500).subscribe(() => {
            this.message = null;
          });
        },
        error => {
          console.error('Error adding product', error);
          this.message = 'An error occurred while adding the product.';
        }
      );
    } else {
      this.message = 'Form is invalid. Please check the fields.';
      console.log('Form Errors', form.controls);
    }
  }
  
}
