import { Component, EventEmitter, Input, Output } from '@angular/core';

// 使用装饰器定义组件的元数据
@Component({
  selector: 'app-report-table', // 组件的选择器，用于在模板中引用此组件
  templateUrl: './report-table.component.html', // 组件的 HTML 模板文件路径
  styleUrls: ['./report-table.component.css'] // 组件的样式文件路径
})
export class ReportTableComponent {
  @Input() reports!: any[]; // 输入属性，用于从父组件接收报告数据
  @Output() editRequested = new EventEmitter<any>(); // 用于向父组件发送编辑请求的事件发射器
  @Output() detailRequested = new EventEmitter<any>(); // 用于向父组件发送详情查看请求的事件发射器

  @Output() reportStatusChanged = new EventEmitter<any>(); // 用于向父组件发送报告状态更改请求的事件发射器
  @Output() reportDeleted = new EventEmitter<any>(); // 用于向父组件发送报告删除请求的事件发射器

  changeStatus(report: any) {
    // 更改报告状态的方法，触发 reportStatusChanged 事件
    this.reportStatusChanged.emit(report);
  }

  deleteReport(report: any) {
    // 删除报告的方法，触发 reportDeleted 事件
    this.reportDeleted.emit(report);
  }

  requestEdit(report: any) {
    // 请求编辑报告的方法，触发 editRequested 事件
    this.editRequested.emit(report);
  }

  requestDetail(report: any) {
    // 请求查看报告详情的方法，触发 detailRequested 事件
    this.detailRequested.emit(report);
  }

  sortColumn: string = ''; // 用于跟踪当前排序的列
  sortDirection: 'asc' | 'desc' | '' = ''; // 当前排序方向

  sortReports(column: string): void {
    // 根据指定列对报告进行排序的方法
    if (this.sortColumn === column) {
      // 如果当前已经按这个列排序，则改变排序方向
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // 否则，设置新的排序列和方向
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    // 执行排序逻辑
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
    // 根据当前排序状态获取排序图标的方法
    if (this.sortColumn === column) {
      return this.sortDirection === 'asc' ? 'icon-up' : 'icon-down';
    }
    return 'icon-default';
  }
}

