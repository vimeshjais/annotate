import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
var xml2js = require('xml2js');

@Component({
    selector: 'rightsidebar',
    template: require('./rightsidebar.component.html')
})
export class RightSideBarComponent implements OnInit {

    tagSelection: FormGroup;
    selectConceptId: Array<any>;
    selectTags: Array<any>;
    selectTag: Array<any> = new Array<any>();
    pushedData: Object;
    tagClass: string;

    //@Input() selectedData : string;
    @Input() startPoint: string;
    @Input() endPoint: string;
    @Input() formDefaults: string[];
    @Output() selectedColor = new EventEmitter<any>();
    @Output() reloadXML = new EventEmitter<any>();

    

    private _selectedData: string;
    @Input() public get selectedData(): string {
        return this._selectedData;
    }
    public set selectedData(v: string) {
        this._selectedData = v;
        if (this.tagSelection !== undefined) {
    //        console.log("set selectedData:");
    //        console.log(this.tagSelection);

            this.getDataFromStroage(this.startPoint, this.endPoint, v);
        }
    }


    constructor( @Inject(FormBuilder) private fb: FormBuilder) {

    }
    //constructor() { }

    ngOnInit() {
        this.tagSelection = this.fb.group({
            conceptId: [''],
            tagId: [''],
            selectedText: [],
            comment: ['']
        });

        this.selectConceptId = new Array<any>();
        this.selectConceptId.push({ Id: '1: None', conceptTag: 'None' });
        this.selectConceptId.push({ Id: '2043: Price Target', conceptTag: 'Price Target' });
        this.selectConceptId.push({ Id: '3: Revenue Target', conceptTag: 'Revenue Target' });
        this.selectConceptId.push({ Id: '4: Forcast', conceptTag: 'Forcast' });
        this.selectConceptId.push({ Id: '5: Equity Metric', conceptTag: 'Equity Metric' });
        this.selectConceptId.push({ Id: '145: Company Name', conceptTag: 'Company Name' });


        this.selectTags = new Array<any>();
        this.selectTags.push({ Id: 1, tag: 'corporation' });
        this.selectTags.push({ Id: 2, tag: 'exchange' });
        this.selectTags.push({ Id: 3, tag: 'EquityMetric' });
        this.selectTags.push({ Id: 4, tag: 'Upgrade' });
        this.selectTags.push({ Id: 5, tag: 'pricetarget' });
        this.initilizeData();

        // this.tagSelection.get('conceptId').valueChanges.subscribe(
        //     (value) => this.changeTags(value),
        //     (error: any) => console.log(error)
        // );
    }


    // private changeTags(value: any): void {
    //     this.selectTag = this.selectTags.filter((ele) => ele.conceptId.toString() === value.toString());
    //     console.log(this.selectTag);
    // }

    private getDataFromStroage(start: string, end: string, text: string): void {
        this.initilizeData();
        let flag = true;
        let data = JSON.parse(localStorage.getItem('dataJSON'));
   //     console.log(data);
        let annotation = data['annotations'][0]['named-entities'][0]['NE'];
        // alert(`${start} ${end} ${text}`);
        this.tagSelection.reset();
        // tslint:disable-next-line:forin
        annotation.forEach(element => {
            if (element['$']['start'].toString() === start.toString() && element['$']['end'].toString() === end.toString() && element['$']['text'].toString() === text.toString()) {
                flag = false;
                this.tagSelection.patchValue({
                    selectedText: text,
                    conceptId: element['$']['conceptID'] === undefined ? '1: None' : element['$']['conceptID'],
                    tagId: element['$']['type'],
                    comment: element['$']['comment']

                });
                this.tagClass = element['$']['type'];
            }
     //       console.log(element['$']['start'].toString() === start.toString());            
        });
        if (flag) {
            this.tagSelection.patchValue({
                selectedText: text
            });
        }

        this.pushedData = {
            type: this.tagSelection.get('tagId').value,
            text: this.tagSelection.get('selectedText').value,
            end: end,
            start: start,
            conceptID: this.tagSelection.get('conceptId').value,
            id: 'N' + annotation.length,
            comment: this.tagSelection.get('comment').value,
            flag: flag
        };
        
 //       console.log(this.pushedData);
    }

    private saveData(): void {
        this.tagClass='';
        let data = JSON.parse(localStorage.getItem('dataJSON'));
        let annotation = data['annotations'][0]['named-entities'][0]['NE'];
        this.pushedData['type'] = this.tagSelection.get('tagId').value;
        this.pushedData['text'] = this.tagSelection.get('selectedText').value;
        this.pushedData['conceptID'] = this.tagSelection.get('conceptId').value;
        this.pushedData['comment'] = this.tagSelection.get('comment').value||'';
        this.pushedData['color'] = this.tagSelection.get('tagId').value;
        let flag = this.pushedData['flag'];
        delete this.pushedData['flag'];
        if (flag) {
            annotation.push({ '$': this.pushedData });

        } else {
            let num = 0;
            annotation.forEach((element, index) => {
                if (element['$']['start'].toString() === this.pushedData['start'].toString() && element['$']['end'].toString() === this.pushedData['end'].toString() && element['$']['text'].toString() === this.pushedData['text'].toString()) {
                    this.pushedData['id'] = element['$']['id'];
                    num = index;
                }
            });
            annotation[num]['$'] = this.pushedData;
        }
        data['annotations'][0]['named-entities'][0]['NE'] = annotation;
        localStorage.setItem('dataJSON', JSON.stringify(data));
        this.selectedColor.emit(this.pushedData['color']);
        this.clear();
        this.reloadXML.emit();
    }

    private clear(): void {
        this.initilizeData();
        this.tagSelection.reset();
    }

    private finalSave(): void {
        let data = JSON.parse(localStorage.getItem('dataJSON'));
        var builder = new xml2js.Builder();
        var xml = builder.buildObject(data);
   //     console.log(xml);
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:attachment/xml,' + encodeURI(xml);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'myFile.xml';
        hiddenElement.click();
    }

    private initilizeData(): void {
        this.pushedData = {
            type: '',
            text: '',
            end: '',
            start: '',
            conceptID: '',
            id: '',
            comment: '',
            color: '',
            flag: true
        };
    }

    private changeTag(value: any) {
  //      console.log(value);
        this.tagClass = value;
       // this.selectedColor.emit(value);
    }

}
