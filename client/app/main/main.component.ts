import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { AnnotatorComponent } from '../annotator/annotator.component';

@Component({
  selector: 'main',
  template: require('./main.html'),
  styles: [require('./main.scss')],
})
export class MainComponent implements OnInit {
  Http;

  awesomeThings = [];
  newThing = '';

  static parameters = [Http];
  constructor(private http: Http) {
    this.Http = http;

  }

  ngOnInit() {
    return this.Http.get('/api/things')
      .map(res => res.json())
      // .catch(err => Observable.throw(err.json().error || 'Server error'))
      .subscribe(things => {
        this.awesomeThings = things;

      });
  }


  addThing() {
    if (this.newThing) {
      let text = this.newThing;
      this.newThing = '';

      return this.Http.post('/api/things', { name: text })
        .map(res => res.json())
        .catch(err => Observable.throw(err.json().error || 'Server error'))
        .subscribe(thing => {
          console.log('Added Thing:', thing);
        });
    }
  }

  deleteThing(thing) {
    return this.Http.delete(`/api/things/${thing._id}`)
      .map(res => res.json())
      .catch(err => Observable.throw(err.json().error || 'Server error'))
      .subscribe(() => {
        console.log('Deleted Thing');
      });
  }
}
