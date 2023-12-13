import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-report-table',
  templateUrl: './report-table.component.html',
  styleUrls: ['./report-table.component.css']
})
export class ReportTableComponent {
  @Input() reports!: any[];
  @Output() editRequested = new EventEmitter<any>();
  @Output() detailRequested = new EventEmitter<any>();

  @Output() reportStatusChanged = new EventEmitter<any>();
  @Output() reportDeleted = new EventEmitter<any>();

  changeStatus(report: any) {
    this.reportStatusChanged.emit(report);
  }

  deleteReport(report: any) {
    this.reportDeleted.emit(report);
    
  }
  



  requestEdit(report: any) {
    this.editRequested.emit(report);
  }

  requestDetail(report: any) {
    this.detailRequested.emit(report);
  }

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' | '' = '';

  sortReports(column: string): void {
    if (this.sortColumn === column) {
      // 如果已经按这个列排序，就改变排序方向
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.reports.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];
      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
  getSortIcon(column: string): string {
    if (this.sortColumn === column) {
      return this.sortDirection === 'asc' ? 'icon-up' : 'icon-down';
    }
    return 'icon-default';
  }
}
