import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Report } from '../report.model';

@Component({
  selector: 'app-report-edit',
  templateUrl: './report-edit.component.html',
  styleUrls: ['./report-edit.component.css']
})
export class ReportEditComponent {
  @Input() report: any;
  @Input() locations: string[] = []; // 接收位置列表


  @Output() reportUpdated = new EventEmitter<any>();
  @Output() newLocationAdded = new EventEmitter<string>();

  newLocation: string = ''; // 新位置输入

  saveReport() {
    if (this.newLocation) {
      this.locations.push(this.newLocation);
      this.report.location = this.newLocation;
      this.newLocationAdded.emit(this.newLocation);
      this.newLocation = '';
    }


    this.reportUpdated.emit(this.report);
    // 重置表单逻辑
  }

}
