import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Report } from '../report.model'; // 导入 Report 类型
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.css']
})
export class ReportFormComponent implements OnInit {

  showForm: boolean = false;

  toggleFormDisplay() {
    this.showForm = !this.showForm;
  }
  
  locations: string[] = []; // 存储位置数据
  private apiBaseUrl = 'https://272.selfip.net/apps/Erd97XR9Zp/collections/reports/documents/';
  title = 'httpMod';

  constructor(private http: HttpClient) { }
  ngOnInit(): void {
      

    this.http.get<any[]>(this.apiBaseUrl).subscribe((response) => {
      // 使用 Set 来存储唯一的 locations
      const uniqueLocations = new Set<string>();

      this.reports = response.map(item => {
        try {
          const dataString = typeof item.data === 'string' ? item.data : JSON.stringify(item.data);
          const parsedData = JSON.parse(dataString);
          const report = {
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

          // 添加 location 到 uniqueLocations Set 中
          if (report.location) {
            uniqueLocations.add(report.location);
          }

          return report;
        } catch (error) {
          console.error('Error parsing JSON:', error);
          return null;
        }
      }).filter(report => report !== null);

      // 将 uniqueLocations Set 转换为数组
      this.locations = Array.from(uniqueLocations);
    }, error => {
      console.error('Error fetching reports:', error);
    });
  }



  addLocation() {
    if (this.newLocation && !this.locations.includes(this.newLocation)) {
      this.locations.push(this.newLocation);
      this.selectedLocation = this.newLocation;
      this.newLocation = '';
      // 可以选择在此处将新位置发送到 API
    }
  }

  reports: any[] = [];
  selectedReport: any = null;
  editMode: boolean = false;

  
  @Output() reportCreated = new EventEmitter<Report>();
  @Output() newLocationAdded = new EventEmitter<string>();
  
  newReport: Report = {
    reporterName: '',
    reporterPhone: '',
    troublemakerName: '',
    location: '',
    longitude: '',
    latitude: '',
    pictureUrl: '',
    extraInfo: ''
  };

   // 添加位置列表
  //  locations: string[] = ['Location 1', 'Location 2']; // 初始位置列表
   selectedLocation: string = ''; // 选中的位置
   newLocation: string = ''; // 新位置输入


  createReport() {

  const reportKey = uuidv4(); // 为每个新报告生成一个 UUID
  const currentTime = new Date(); // 获取当前时间


  if (this.newLocation) {
    // 如果用户输入了新的位置，将其添加到位置列表
    this.locations.push(this.newLocation);
    this.newReport.location = this.newLocation;
    this.newLocation = ''; // 重置新位置输入
  } else {
    // 如果没有新位置输入，使用选择的下拉列表位置
    this.newReport.location = this.selectedLocation;
  }
  
    // 准备要发送到 API 的报告数据，不包含 id
    const reportData = {
      ...this.newReport,
      timeDate: currentTime.toISOString(), // 使用 ISO 格式的时间字符串
      status: 'OPEN',// 初始状态设为 OPEN
      Key: reportKey
    };
  
  // 发送新报告到 API
  this.http.post<any>(this.apiBaseUrl, { "key": reportKey, "data": reportData })
    .subscribe(response => {
      // 假设 API 返回报告的 ID
      const newReportWithKey = { ...reportData, id: response.id };
      this.reports.push(newReportWithKey); // 使用包含 key 的报告数据

      // 重置表单
    this.newReport = {
            reporterName: '',
            reporterPhone: '',
            troublemakerName: '',
            location: '',
            longitude: '',
            latitude: '',
            pictureUrl: '',
              extraInfo: '',
               }
      this.selectedLocation = '';

      // 保存报告的 key 到本地存储
      localStorage.setItem(newReportWithKey.id, reportKey);

    }, error => {
      console.error('Error creating report:', error);
    });


    
}
}
