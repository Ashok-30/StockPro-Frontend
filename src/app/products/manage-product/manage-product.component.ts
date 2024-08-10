import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../product.service';
import { SidebarComponent } from '../../dash/sidebar/sidebar.component';
import { ConfirmModalComponent } from '../../dash/confirm-modal/confirm-modal.component';
import { CeilPipe } from '../../ceil.pipe';
import { timer } from 'rxjs';

@Component({
  selector: 'app-manage-product',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent, SidebarComponent, CeilPipe],
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.css']
})
export class ManageProductComponent implements OnInit {
  products: any[] = [];
  paginatedProducts: any[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  totalProducts: number = 0;
  selectedProduct: any = null;
  showModal: boolean = false;
  productToDelete: any = null;
  showSuccessModal: boolean = false;
  message: string | null = null;
  searchValue: string = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productService.getAllProducts(this.currentPage - 1, this.pageSize).subscribe({
      next: (data: any) => {
        this.products = data.content;
        this.totalProducts = data.totalElements;
        this.setPage(this.currentPage);
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      }
    });
  }

  setPage(page: number): void {
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    this.paginatedProducts = this.products.slice(startIndex, startIndex + this.pageSize);
  }

  nextPage(): void {
    if (this.currentPage * this.pageSize < this.totalProducts) {
      this.currentPage++;
      this.fetchProducts();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchProducts();
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.fetchProducts();
  }

  selectProduct(product: any): void {
    this.selectedProduct = { ...product };
  }

  updateProduct(): void {
    if (this.selectedProduct) {
      this.productService.updateProduct(this.selectedProduct.id, this.selectedProduct).subscribe(
        response => {
          this.fetchProducts();
          this.selectedProduct = null;
          this.message = response;
          timer(1500).subscribe(() => {
            this.message = null;
          });
        },
        error => {
          console.error('Error updating product:', error);
          this.message = 'Error updating product';
        }
      );
    }
  }

  deleteProduct(product: any): void {
    this.productToDelete = product;
    this.showModal = true;
  }

  confirmDelete(confirmed: boolean): void {
    if (confirmed && this.productToDelete) {
      this.productService.deleteProduct(this.productToDelete.id).subscribe(
        response => {
          this.fetchProducts();
          this.message = 'Product deleted successfully!';
          timer(1500).subscribe(() => {
            this.message = null;
          });
          this.productToDelete = null;
        },
        error => {
          console.error('Error deleting product:', error);
          this.message = 'Error deleting product. Please try again later.';
          this.productToDelete = null;
        }
      );
    }
  }

  handleSuccessModalClose(): void {
    this.showSuccessModal = false;
  }

  cancelEdit(): void {
    this.selectedProduct = null;
  }

  searchProducts(): void {
    if (this.searchValue) {
      this.productService.searchProducts(this.searchValue).subscribe({
        next: (data) => {
          this.products = data;
          this.totalProducts = this.products.length;
          this.setPage(1); // Reset to first page of search results
        },
        error: (error) => {
          console.error('Error searching products:', error);
        }
      });
    } else {
      this.fetchProducts(); // fetch all products if search is cleared
    }
  }
}
