/**
 *
 */
import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
let xml2jsParser = require('xml2js').parseString;


@Component({
  selector: 'annotator',
  template: require('./annotator.html'),
  styles: [require('./annotator.scss')],
})
export class AnnotatorComponent implements OnInit {
  Http;
  selectedtext = '';
  startPoint = 0;
  endPoint = 0;
  classes = [];
  public report: any;
  namedentities = [];
  annotations = [];
  relations = [];
  tags = [];
  showStyle = false;
  static parameters = [Http];
  reader = new FileReader();
  constructor(private http: Http) {
    this.Http = http;
  }
 counter = 0;
 annotationTypes = '';
 parentAnnotation: any = null;
  /**
   *
   */
  ngOnInit() {

  }


  public openFile(event: any) {
	  
    let input = event.target;
    // let annotation: any;
    // let pXML: any;
    // let toreplace = '';
    // let byreplace = '';
    // let start = 0;
    // let end = 0;
    // let adder = 0;
    this.reader.readAsText(input.files[0]);
    this.reader.onload = () => {
      // this 'text' is the content of the file
      promisesParser(this.reader.result)
        .then(function (result) {
       //   console.log(result);
          var key = Object.keys(result)[0];
          localStorage.setItem('dataJSON', JSON.stringify(result[key]));

        }).catch(function (err) {
          //error here
        });
    };

    this.reader.onloadend = () => {
      this.reloadFropmLocalStorage();
      //   pXML = JSON.parse(localStorage.getItem('dataJSON'));
      //   this.report = pXML.report;
      //   byreplace = this.report.toString();
      //   byreplace = byreplace.trim();
      //   this.annotations = pXML.annotations;
      //   this.namedentities = this.annotations['0']['named-entities']['0'].NE;   

      //   this.namedentities.sort(function(a, b){
      //      var keyA = parseInt(a.$.start),
      //          keyB = parseInt(b.$.start);
      //      if(keyA < keyB) return -1;
      //      if(keyA > keyB) return 1;
      //      return 0;
      //  });
      //   console.log(this.namedentities);
      //   for (let i = 0; i < this.namedentities.length; i++) {
      //     console.log(this.namedentities[i].$);
      //     annotation = this.namedentities[i].$;
      //     // if(annotation.comment == undefined)
      //     toreplace = '<span class="' + annotation.type + ' C ' + (annotation.conceptID?annotation.conceptID:'NULL') + ' C ' + (annotation.comment?annotation.comment:'NULL') + '">' + annotation.text + '</span>';        
      //     start = parseInt(annotation.start, 10) + adder;
      //     end = parseInt(annotation.end, 10) + adder;
      //     console.log('Start: ', start);
      //     console.log('End: ', end);
      //     console.log('comments: ',annotation.comment);
      //     console.log(byreplace.substring(start , end ));
      //     console.log(annotation.text);
      //     console.log('annotation text '+annotation.text +' by replace '+byreplace.substring(start , end ));
      //     if (annotation.text === byreplace.substring(start , end ) ) {
      //       console.log(byreplace.substring(start, end) +'---'+toreplace);
      //       byreplace = byreplace.replace(byreplace.substring(start, end), toreplace);
      //     }
      //   //  console.log(byreplace);
      //   console.log(toreplace.length);
      //   console.log(annotation.text.length);

      //     adder += toreplace.length - annotation.text.length;


      //   }
      //   // console.log(byreplace);
      //   this.report = byreplace;
    };
  }

  reloadFropmLocalStorage() {

    
    let annotation: any = null;
    let pXML: any;
    let toreplace = '';
    let byreplace = '';
    let start = 0;
    let end = 0;
    let adder = 0;
    pXML = JSON.parse(localStorage.getItem('dataJSON'));
    this.report = pXML.report;
    byreplace = this.report.toString();
    byreplace = byreplace.trim();
    this.annotations = pXML.annotations;
    this.namedentities = this.annotations['0']['named-entities']['0'].NE;   
    let lastAnnotation = null;
    let parentAnnotation = null;
    // console.log('before sorting');
    // console.log(this.namedentities);
    this.namedentities.sort(function(a, b){
       var keyA = parseInt(a.$.start),
           keyB = parseInt(b.$.start);
       if(keyA < keyB) return -1;
       if(keyA > keyB) return 1;
       return 0;
   });
    // console.log(this.namedentities);
    let endOutside =0;
    for (var i = 0; i < this.namedentities.length; i++) {
      
      console.log(this.namedentities[i].$);
      annotation = this.namedentities[i].$;
      // if(annotation.comment == undefined)
      
      start = parseInt(annotation.start, 10) + adder;
      end = parseInt(annotation.end, 10) + adder;

      console.log("stat and End "+start+" : "+end);
      // console.log('Start: ', start);
      // console.log('End: ', end);
      // console.log('comments: ',annotation.comment);
      // console.log(byreplace.substring(start , end ));
      // console.log(annotation.text);
      // console.log('annotation text '+annotation.text +' by replace '+byreplace.substring(start , end ));
      // if (annotation.text === byreplace.substring(start , end ) ) {
      //   console.log(byreplace.substring(start, end) +'---'+toreplace);
      //   byreplace = byreplace.replace(byreplace.substring(start, end), toreplace);
      // }
     // lastAnnotation = annotation;
    //console.log(byreplace);


     /* new code */

    
    if(lastAnnotation){
        // console.log(annotation.text.length);
        // var lastAnnotationText = byreplace.substring(start, annotation.text.length);
         
       //  console.log('current annotation : '+lastAnnotationText);
        // var occurences = (lastAnnotationText.match(/<\/span>/g) || []).length;
        // var occurences2 = (lastAnnotationText.match(/<span>/g) || []).length;
        // var occurencesDiff = occurences2 - occurences;

          if(parseInt(lastAnnotation.start) <= parseInt(annotation.start) && parseInt(lastAnnotation.end) >= parseInt(annotation.end)){
            this.annotationTypes = '';
            this.getSpanCount(i);
           
            console.log('count value .. : '+this.counter);
           
            start = parseInt(annotation.start, 10) + adder-(7*this.counter);
            end = parseInt(annotation.end, 10) + adder-(7*this.counter);
            console.log('overlapping 1 '+i);           
               
        }        
        else if(parseInt(lastAnnotation.end) >= parseInt(annotation.start) && parseInt(annotation.end) > parseInt(lastAnnotation.end)){
            //start in current annotation and end with outside
             start = parseInt(annotation.start, 10) + adder-7;           
            // toreplace +='</span>';
             console.log('overlapping 2 '+i); 
            // adder -=7;  
            //endOutside = 1;
             
            // var lastIndex =  lastAnnotationText.lastIndexOf("</span>",annotation.start);
            // if(lastIndex == -1) toreplace +='</span>';

            //toreplace +='</span>';
            //let temp = toreplace;
            
            
            
            //toreplace ='</span>'+temp;
            //console.log('to replace '+toreplace);
            
            //console.log("span occurences "+occurences);
           // start = parseInt(annotation.start, 10) + adder -(7* (occurences>0?occurences+1:1));
            //end+=7;
            
            adder -=7;  
           // end = parseInt(annotation.end, 10) + adder-7;

           
         }
         else {console.log("entered else.... ");this.annotationTypes = annotation.type;} 

         //else if(occurences>0){
        //   toreplace +='</span>';
        // }
        
    }
     else {console.log("entered lastAnnotation  null/blank ");this.annotationTypes = annotation.type;} 
     this.counter = 0;
     //if (lastAnnotation == null || lastAnnotation == ''){console.log("entered lastAnnotation  null/blank ");this.annotationTypes = annotation.type;} 
     console.log('this.annotationTypes .. : '+this.annotationTypes);
     
     lastAnnotation = annotation; 
     toreplace = '<span title="Annotation Type : ' + this.annotationTypes +'" class="' + annotation.type + ' C ' + (annotation.conceptID?annotation.conceptID:'NULL') + ' C ' + (annotation.comment?annotation.comment:'NULL') + 'C '+ (annotation.multiplecommentclass?annotation.multiplecommentclass:'NULL') +' '+ (annotation.multipletagclass?annotation.multipletagclass:'NULL')+'">' + annotation.text + '</span>';   
      
       let contentEnd = (endOutside==1)?byreplace.substring(end, byreplace.length)  :byreplace.substring(start+annotation.text.length, byreplace.length);
       let contentStart = byreplace.substring(0, (start>1?start:0));
       byreplace = contentStart + toreplace + contentEnd;
       endOutside = 0;

      // adder = counter==1?adder-7:adder;
      // counter = 0;
       

    /* End */   

    // console.log(toreplace.length);
    // console.log(annotation.text.length);
   //  adder = counter==1?adder-7:adder;
     adder += toreplace.length - annotation.text.length;
      

    }
    // console.log(byreplace);
    this.report = byreplace;


  }


  getSpanCount(k:any,annotation?: any){
    console.log('conter..................................');
    console.log(annotation);
    //checking whether annotation type is alredy there or not
    if( this.annotationTypes.search(this.namedentities[k].$.type)==-1)
      this.annotationTypes += this.namedentities[k].$.type + ' ';

    //console.log("loop count "+this.counter);
   // console.log("last start and end "+this.namedentities[k-1].$.start+' : '+this.namedentities[k-1].$.end);
    // console.log("next start and end "+this.namedentities[k].$.start+' : '+this.namedentities[k].$.end);
    // console.log("next annotation type"+this.namedentities[k].$.type);
    if(k>0){
        if(parseInt(this.namedentities[k-1].$.start) <= parseInt(this.namedentities[k].$.start) && parseInt(this.namedentities[k-1].$.end) >= parseInt(this.namedentities[k].$.end)){
         this.counter++;   
         console.log('inside counter ');      
         this.getSpanCount(k-1);
        
      }
      // else{
      //   return this.counter;
      // }
      // else if(annotation &&(parseInt(this.namedentities[k].$.start) <= parseInt(annotation.$.start) && parseInt(this.namedentities[k].$.end) >= parseInt(annotation.$.end))){
          
      //      this.counter++;   
      //      alert('conter '+this.counter);
      //      this.getSpanCount(k-1,annotation);
      //  // return this.counter;
      // }else{
      //   this.getSpanCount(k-1);
      // }
    }else{
     return this.counter;
    }
    //console.log("this.annotationTypes: " + this.annotationTypes);
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
    //  console.log("window.getSelection().focusNode.parentElement.className: "+window.getSelection().focusNode.parentElement.className);
      //console.log(document["selection"]);

      // Get the text that was selected
      text = window.getSelection().toString();
  //    console.log("text:"+text);
      if (text !== '') {
        if (window.getSelection().focusNode.parentElement.className) {
          var className = window.getSelection().focusNode.parentElement.className;
          this.classes = className.split(' C ');
  //        console.log("classes"+this.classes);
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

        console.log("startPoint: "+this.startPoint + ' ' +"endPoint: "+ this.endPoint);


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
 //   console.log(value);
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

