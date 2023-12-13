import { Component, OnInit } from '@angular/core';
import { Md5 } from 'ts-md5';
import { HttpClient } from '@angular/common/http';
import { Report } from './report.model';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
  
export class AppComponent implements OnInit {
  private apiBaseUrl = 'https://272.selfip.net/apps/Erd97XR9Zp/collections/reports/documents/';
  title = 'httpMod';
  i = new Date().getTime()
  constructor(private http: HttpClient){}
  ngOnInit(): void {
    this.http.get<any[]>('https://272.selfip.net/apps/Erd97XR9Zp/collections/reports/documents/')
      .subscribe((response) => {
        this.reports = response.map(item => {
          try {
            const dataString = typeof item.data === 'string' ? item.data : JSON.stringify(item.data);
            const parsedData = JSON.parse(dataString);
            return {
              reporterName: parsedData.reporterName,
              reporterPhone: parsedData.reporterPhone,
              troublemakerName: parsedData.troublemakerName,
              location: parsedData.location,
              longitude: parsedData.longitude,
              latitude: parsedData.latitude,
              pictureUrl: parsedData.pictureUrl,
              extraInfo: parsedData.extraInfo,
              timeDate: parsedData.timeDate,
              status: parsedData.status,
              key: parsedData.Key,
            } as Report;
          } catch (error) {
            console.error('Error parsing JSON:', error);
            return null;
          }
        }).filter(report => report !== null);
      }, error => {
        console.error('Error fetching reports:', error);
      });
  }
  


  // title(title: any) {
  //   throw new Error('Method not implemented.');
  // }
  
  reports: any[] = [];
  selectedReport: any = null;
  editMode: boolean = false;

  validPasswordHash = 'fcab0453879a2b2281bc5073e3f5fe54'; // MD5 hash of "BaggyJeans"

  locations: string[] = ['Location 1', 'Location 2']; // 位置列表
  addLocation(newLocation: string) {
    if (newLocation && !this.locations.includes(newLocation)) {
      this.locations.push(newLocation);
    }
  }

  addReport(newReport: any) {

    const currentTime = new Date(); // 获取当前时间
  
    const reportWithDetails = {
      ...newReport,
      id: this.reports.length + 1, // 生成唯一的报告 ID
      timeDate: currentTime, // 记录提交时间和日期
      status: 'OPEN' // 初始状态设为 OPEN
    };
  
    // 更新报告数组的引用以触发变更检测
    this.reports = [...this.reports, reportWithDetails];
  
    this.selectedReport = null;
  
    console.log('New report added:', reportWithDetails);
    console.log('Updated reports array:', this.reports);
  }
  

  selectReportForDetail(report: any) {
    this.selectedReport = report;
    this.editMode = false;
  }

  selectReportForEdit(report: any) {
    this.selectedReport = { ...report };
    this.editMode = true;
  }

  updateReport(updatedReport: any) {
    const index = this.reports.findIndex(r => r.id === updatedReport.id);
    if (index > -1) {
      this.reports[index] = updatedReport;

      this.reports = [...this.reports];
    }
    this.selectedReport = null;
    this.editMode = false;
  }

  validatePassword(inputPassword: string): boolean {
    return Md5.hashStr(inputPassword) === this.validPasswordHash;

  }

  changeReportStatus(report: any) {
    console.log('key is ', report.key)
    const password = prompt('Enter password to change status:');
    if (password === null) {
      alert('Password is required');
      return;
    }
  
    if (!this.validatePassword(password)) {
      alert('Invalid password');
      return;
    }
  
    // 更新报告状态
    const updatedStatus = report.status === 'OPEN' ? 'RESOLVED' : 'OPEN';
  
    // 准备更新后的报告数据
    const updatedReportData = {
      ...report,
      status: updatedStatus
    };
  
    // 发送 PUT 请求到 API 以更新报告
    this.http.put(`${this.apiBaseUrl}/${report.key}`, { "key": report.key, "data": updatedReportData })
      .subscribe(response => {
        // 更新本地报告数组中的状态
        const index = this.reports.findIndex(r => r.key === report.key);
        if (index > -1) {
          this.reports[index] = updatedReportData;
        }
      }, error => {
        console.error('Error updating report status:', error);
      });
  }
  
  
  handleReportDeletion(report: any) {
    console.log('key is ', report.key)
    console.log('Initiating report deletion process...');
  
    const password = prompt('Enter password to delete report:');
    if (password === null) { // 用户点击取消或未输入任何内容
      alert('Password is required');
      return; // 直接返回，不再进行后续的密码验证
    }
    
    if (!this.validatePassword(password)) {
      alert('Invalid password');
      return;
    }
    
    console.log('Password validated, proceeding with deletion...');
    console.log('key is ', report.key)
    // 删除报告的逻辑，例如发送 HTTP DELETE 请求
    this.http.delete(`${this.apiBaseUrl}/${report.key}`).subscribe(
      response => {
        console.log(`Report with key ${report.key} deleted successfully.`);
        // 处理响应，例如从本地报告数组中移除报告
        this.reports = this.reports.filter(r => r.key !== report.key);
      },
      error => {
        console.error('Error deleting report:', error);
      }
    );
  }
  
  
}
