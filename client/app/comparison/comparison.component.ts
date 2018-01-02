/**
 *
 */
import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
let xml2jsParser = require('xml2js').parseString;
let xml2js = require('xml2js');


@Component({
    selector: 'comparison',
    template: require('./comparison.component.html'),

})
export class ComparisonComponent implements OnInit {
    Http;
    selectedtext = '';
    startPoint = 0;
    endPoint = 0;
    classes = [];
    public report: any;
    public first: any;
    public second: any;
    public third: any;
    public compared: any;
    namedentities = [];
    annotations = [];
    relations = [];
    tags = [];
    showStyle = false;
    a;
    b;
    static parameters = [Http];
    reader = new FileReader();
    constructor(private http: Http) {
        this.Http = http;
    }

    ngOnInit() {

    }



    public openFile(event: any, name) {
        console.log(name);
        let input = event.target;
        this.reader.readAsText(input.files[0]);
        this.reader.onload = () => {
            // this 'text' is the content of the file
            promisesParser(this.reader.result)
                .then(function (result) {
                    console.log(result);
                    var key = Object.keys(result)[0];

                    localStorage.setItem('dataJSON' + name, JSON.stringify(result[key]));
                    console.log(result[key]);

                }).catch(function (err) {
                    //error here
                });
        };

        this.reader.onloadend = () => {
            this.reloadFropmLocalStorage(name);

        };
    }


    comparison() {
        this.a = JSON.parse(localStorage.getItem('dataJSONfirst'));
        this.b = JSON.parse(localStorage.getItem('dataJSONsecond'));
        // console.log(this.a);
        //console.log(this.b);


        var firstFile = this.a['annotations'][0]['named-entities']['0'].NE;
        var secondFile = this.b['annotations'][0]['named-entities']['0'].NE;
        //console.log(firstFile);
        //console.log(secondFile);
        let annotationsFirstFile = [];
        let annotationsSecondFile = [];

        for (var j = 0, i = 0; j <= secondFile.length - 1; j++) {
            //    console.log("bObj: ....");
            //  console.log(secondFile[j]);
            var bObj = {
                "start": secondFile[j]["$"]["start"],
                "end": secondFile[j]["$"]["end"]
            };
            // console.log(bObj);

            var matchFound = false;
            for (i = 0; i <= firstFile.length - 1; i++) {
                // console.log(firstFile.length+' '+secondFile.length);

                var aObj = {
                    "start": firstFile[i]["$"]["start"],
                    "end": firstFile[i]["$"]["end"]
                };
                //  console.log(aObj);
                // console.log("aObj: ....");
                // console.log(aObj);
                if (JSON.stringify(aObj) == JSON.stringify(bObj)) {
                    //then look for type/text
                    //    console.log('matched');
                    if (firstFile[i]["$"]["type"] != secondFile[j]["$"]["type"]) {
                        firstFile[i]["$"]["type"] += " " + secondFile[j]["$"]["type"];
                        firstFile[i]["$"]["multipletagclass"] = "multipletag";
                        console.log('not matched type');
                    }

                    if (firstFile[i]["$"]["comment"] != secondFile[j]["$"]["comment"]) {
                        firstFile[i]["$"]["comment"] += " " + secondFile[j]["$"]["comment"];
                        firstFile[i]["$"]["multiplecommentclass"] = "multiplecomment";
                        console.log('not matched comment');
                    }

                    matchFound = true;
                    continue;
                }


                if (i == firstFile.length - 1 && matchFound == false) { //New change found. Push into firstJson
                    console.log('new elem '); console.log(bObj); console.log('end new');
                    firstFile.push(secondFile[j]);

                    /* if(a[i]["-start"] <= b[j]["-start"]){
                     
                     }
                     if(a[i]["-end"] > b[j]["-end"]){
                     }*/
                }

                //Store all annotation of first file in an array
                annotationsFirstFile.push(aObj);
            }
            //Store all annotation of second file in an array
            annotationsSecondFile.push(bObj);
        }
        // Check deletion of tags(If business case required)

        for (var m = 0, n = 0; m < annotationsFirstFile.length; m++) {

            for (n = 0; n < annotationsSecondFile.length; n++) {

                if (annotationsFirstFile[m] == annotationsFirstFile[n]) {
                    // matched found, break and keep searching other tags
                    break;
                }
                if (n == annotationsSecondFile.length - 1 && annotationsSecondFile[n] != annotationsFirstFile[m]) {
                    // tag was deleted/doesnt exist in second file
                    //deletion handler     
                }
            }

        }

        // console.log(firstFile);
        // console.log(secondFile);
        this.a['annotations'][0]['named-entities']['0']["NE"] = firstFile;
        localStorage.setItem('dataJSONCompared', JSON.stringify(this.a));
        this.reloadFropmLocalStorage('Compared');
        //  console.log(this.a['annotations'][0]['named-entities']['0']["NE"]);
        //this.reloadFropmLocalStorage('third');
        // this.createNewFile();
    }

    createNewFile() {
        let data = this.a//JSON.parse(localStorage.getItem('dataJSON'));
        var builder = new xml2js.Builder();
        var xml = builder.buildObject(data);
        //      console.log(xml);
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:attachment/xml,' + encodeURI(xml);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'myFile.xml';
        hiddenElement.click();
    }

    reloadFropmLocalStorage(name) {
        let annotation: any;
        let pXML: any;
        let toreplace = '';
        let byreplace = '';
        let start = 0;
        let end = 0;
        let adder = 0;
        pXML = JSON.parse(localStorage.getItem('dataJSON' + name));
        this.report = pXML.report;
        byreplace = this.report.toString();
        byreplace = byreplace.trim();
        this.annotations = pXML.annotations;
        this.namedentities = this.annotations['0']['named-entities']['0'].NE;

        this.namedentities.sort(function (a, b) {
            var keyA = parseInt(a.$.start),
                keyB = parseInt(b.$.start);
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
        });
        console.log(this.namedentities);
        for (let i = 0; i < this.namedentities.length; i++) {
            console.log(this.namedentities[i].$);
            annotation = this.namedentities[i].$;
            // if(annotation.comment == undefined)
            toreplace = '<span class="' + annotation.type + ' C ' + (annotation.conceptID ? annotation.conceptID : 'NULL') + ' C ' + (annotation.comment ? annotation.comment : 'NULL') + '">' + annotation.text + '</span>';
            start = parseInt(annotation.start, 10) + adder;
            end = parseInt(annotation.end, 10) + adder;
            console.log('Start: ', start);
            console.log('End: ', end);
            console.log('comments: ', annotation.comment);
            console.log(byreplace.substring(start, end));
            console.log(annotation.text);
            console.log('annotation text ' + annotation.text + ' by replace ' + byreplace.substring(start, end));
            if (annotation.text === byreplace.substring(start, end)) {
                console.log(byreplace.substring(start, end) + '---' + toreplace);
                byreplace = byreplace.replace(byreplace.substring(start, end), toreplace);
            }
            //  console.log(byreplace);
            console.log(toreplace.length);
            console.log(annotation.text.length);

            adder += toreplace.length - annotation.text.length;


        }
        // console.log(byreplace);
        this.report = byreplace;
        if (name == "Compared") {
            this.compared = byreplace;
        }
        else if (name == "first") {
            this.first = byreplace;
            console.log('test first');
        }
        else if (name == "third") {
            this.third = byreplace;
            console.log('test first');
        }
        else {
            this.second = byreplace;
            console.log('test third');
        }
    }

    /**
     *
     * @param target
     * @param event
     */
    showSelectedText(target: any, event: any) {
        let element = event; // this was mostly for testing

        var text = '';
        if (window.getSelection) {
            console.log(window.getSelection().focusNode.parentElement.className);
            //console.log(document["selection"]);

            // Get the text that was selected
            text = window.getSelection().toString();

            if (text !== '') {
                if (window.getSelection().focusNode.parentElement.className) {
                    var className = window.getSelection().focusNode.parentElement.className;
                    this.classes = className.split(' C ');
                    console.log(this.classes);
                }
                var start = 0, end = 0;
                var priorRange;
                // See where the selection is and attach popper to it
                var selection = window.getSelection().getRangeAt(0);
                priorRange = selection.cloneRange();
                var mainDiv = document.getElementById("content");
                priorRange.selectNodeContents(mainDiv);
                priorRange.setEnd(selection.startContainer, selection.startOffset);
                this.startPoint = priorRange.toString().length;
                this.endPoint = this.startPoint + selection.toString().length;

                console.log(this.startPoint + ' ' + this.endPoint);


                // Setting up the tooltip (popper)


                // Show popper
                this.showStyle = true;
            } else {
                // Hide popper
                this.showStyle = false;
            }

        } else {
            this.showStyle = false;
        }

        // Value of the selected Text

        this.selectedtext = text;

    }
    getStyle() {
        if (this.showStyle) {
            return 'block';
        } else {
            return 'none';
        }
    }
    changeTextColor(value: any) {
        console.log(value);
    }
}


function promisesParser(string) {
    return new Promise(function (resolve, reject) {
        xml2jsParser(string, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

