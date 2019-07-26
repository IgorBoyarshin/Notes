==============================================================================;
=============================== TECH =========================================;
==============================================================================;
ng serve --poll=2000
==============================================================================;
=============================== GENERAL ======================================;
==============================================================================;
// Specifying Cmponent info
@Component({
    // selector: '[app-root]', // <div app-root></div>
    // selector: '.app-root',  // <div class=".app-root"></div>
    selector: 'app-root',      // <app-root></app-root>
    templateUrl: './app.component.html',
    // template: `
    //    <p>Some</p>`,
    styleUrls: ['./app.component.css']
    // styles: [`
    //   h3 {
    //     color: dodgerblue;
    //   }
    // `]
})
==============================================================================;
// Inline style
<div
    [ngStyle]="{backgroundColor: online ? 'yellow' : 'blue', margin: '0.3em'}">
</div>
==============================================================================;
// Inline class
// Specify 'true' if a class is to be present
<div
    [ngClass]="{'positive': allowNewServer, 'negative': !allowNewServer}"
</div>
==============================================================================;
// Button click
<button
    (click)="onReport()">
Report</button>
==============================================================================;
// One-way binding from input to code
<input type="text"
    (input)="onUpdateServerName($event)">
// In code:
onUpdateServerName(event: Event) {
    this.serverName = (<HTMLInputElement>event.target).value;
}
==============================================================================;
// Two-way binding
<input type="text"
    [(ngModel)]="serverName">
// Usage:
<p>Server name: {{ serverName }}</p>
==============================================================================;
// Local template variable.
// Note: the same can be done for child component!
<input type="text"
    #theName>
// It can then be referenced throughout the template:
<button
    (click)="onClick(theName.value)">
</button>
==============================================================================;
// Passing data into child Component (from parent)
// Parent:
<app-child
    [serverName]="serverNames[0]">
</app-child>
// ... and in code of Child:
import { Input } from '@angular/core';
{
    @Input('serverName') name: string = 'Noname'; // exposed as 'serverName'(optional)
}
==============================================================================;
// Passing data into parent Component (from child)
// Child:
import { Output, EventEmitter } from '@angular/core';
{
    @Output() reportMe = new EventEmitter<{name: string, id: number}>();
    // ...
    this.reportMe.emit({name: this.name, id: this.serverId});
}
// ... and in code of Parent
<app-child
    (reportMe)="onThisEvent($event)">
</app-child>

onThisEvent(data: {name: string, id: number}) {
    this.reportedServer = data;
}
==============================================================================;
// For loop
<div
    *ngFor="let elem of array; index as i">
</div>
==============================================================================;
// Conditional
<p
    *ngIf="condition">
</p>
==============================================================================;
=============================== SERVICE ======================================;
==============================================================================;
// Creation:
export class ServiceName {}

// Place into Module or Component as
providers: [ServiceName]
// ... to make available throughout the whole module or get a new instance per
// each new Component of that type and share it down the hierarchy.
// Put into Module to use in another Service.

// To use ServiceA in ServiceB, make ServiceB @Injectable

// Use a Service:
constructor(private name: ServiceName) {}

// Communication through Service
1) Create an event in Service with the data(specify type)
2) Emit it in ComponentA(with injected Service) with the data
3) Subscribe to it in ComponentB(with injected Service), receiving the data
==============================================================================;
// MODERN WAY
import { Injectable } from '@angular/core';
@Injectable({providedIn:'root'}) // instead of specifying it in 'providers' of the main Module
export class PostsService {}
==============================================================================;
=============================== ROUTER =======================================;
==============================================================================;
// Inside main Module
import {Router, RouterModule} from "@angular/router";
const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'users', component: UsersComponent},
];
// .. and in the NgModule add:
imports: [RouterModule.forRoot(appRoutes)]
// .. and add <router-outlet></router-outlet> inside the main component.
// Usage:
<a routerLink="/users">Users</a>;
// OR:
<a [routerLink]="['/users']">Users</a>;
// (can pass any path there. '/' means absolute path, otherwise relative.
// 'users' is the same as './users'
==============================================================================;
// Add
routerLinkActive="myClass"
// to specify what class to append upon link becoming active.
// Also add into the '/' link
[routerLinkActiveOptions]="{exact: true}"
// to account for the whole path, not just being part of it.
// For setup:
// '' -> '1', '1', '2'
// specify pathMatch='full'
==============================================================================;
// To use in code, inject as:
import {Router} from "@angular/router";
constructor(private router: Router) {}
this.router.navigate(['/users']);
==============================================================================;
// By default, when in code it does not know where the relative path starts.
// To specify that:
import {Router, ActivatedRoute} from "@angular/router";
constructor(private router: Router, private route: ActivatedRoute) {}
this.router.navigate(['/users'], {relativeTo: this.route});
==============================================================================;
// To generate paths dynamically:
const appRoutes: Routes = [
    {path: 'users/:id/:name', component: UserComponent},
];
// To access this in the Component:
import {ActivatedRoute} from "@angular/router";
constructor(private route: ActivatedRoute) {}
const id = this.route.snapshot.params['id'];
const name = this.route.snapshot.params['name'];
==============================================================================;
// If we change the route from inside this Component, the Component won't get
// reloaded (reinstantiated). So we cannot use snapshot. Instead use the Observable:
import {ActivatedRoute, Params} from "@angular/router";
this.route.params.subscribe(
    (params: Params) => {
        const id = params['id'];
    }
);
// If the component you are on may never be reloaded from within this component,
// then no need for this. So the component will always be recreated when reached.
==============================================================================;
// On the same element as
<a [routerLink]="['/users', 5, 'edit']" queryParams="{allowEdit: '1'}" fragment="loading">Link</a>;
// The same in code:
this.router.navigate(
    ['/users', 5, 'edit'],
    {queryParams: {allowEdit: '1'}, fragment: 'loading'});
// Access:
this.route.snapshot.queryParams;
this.route.snapshot.fragment;
// If needed, subscribe:
this.route.queryParams.subscribe(()=>{});
this.route.fragment.subscribe(()=>{});
==============================================================================;
// Children routing
const appRoutes: Routes = [
    {path: 'users', component: UsersComponent, children: [
        {path: ':id', component: UserComponent},
        {path: ':id/edit', component: EditUserComponent}
    ]},
];
// Add a new
<router-outlet></router-outlet>;
// inside UsersComponent
==============================================================================;
// There is a
preserveQueryParams
// field for
this.router.navigate();
==============================================================================;
// Default redirection
1) Create a not-found Component and make a route for it: '/not-found'
2) Specify
    {path: '**', redirectTo: '/not-found'}
3) MAKE IT THE LAST ONE as the routes are parsed top-to-bottom
==============================================================================;
// Router guards
// XXX: CanActivateChild is optional.
// Create auth-guard.service.ts:
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from '@rxjs/Observable';
export class AuthGuard implements CanActivate, CanActivateChild {
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> | Promise<boolean> | boolean {
        const can = true;
        if (can) {
            return true;
        } else {
            this.router.nagivate(['/']);
            return false; // optional, since the previous line will reset the navigation anyway
        }
    }
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> | Promise<boolean> | boolean {
        this.canActivate(route, state)
    }
}
// Usage:
    {path: 'users', component: UsersComponent, canActivate: [AuthGuard]}
// OR (if using children)
    {path: 'users', component: UsersComponent, canActivateChild: [AuthGuard]}
// ...having added AuthGuard as (providers) inside the Module
==============================================================================;
=============================== Observable, Subscription =====================;
==============================================================================;
import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
export class SomeComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    ngOnInit() {
        this.subscription = interval(1000).subscribe(count => console.log(count));
    }
    ngOnDestrot() {
        this.subscription.unsubscribe();
    }
}
==============================================================================;
// Create Observable
import { Observable } from 'rxjs';
const obs = Observable.create(observer => {
    let count = 0;
    setInterval(() => {
        observer.next(count); // .error(), .complete()
        count++;
    }, 1000);
});
obs.subscribe(data => console.log(data));
==============================================================================;
// Operators
import { map } from 'rxjs/operators'
someObservable = someObservable.pipe(map(data => data * 2));
==============================================================================;
=============================== Subject ======================================;
==============================================================================;
// To be used instead of Emitters to communicate between Components via Services.
// If, on the other hand, @Input or @Output is used, use the old Emitters.
import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'}) // Instead of manually adding in the main Module
export class MyService {
    subject = new Subject<boolean>();
}
export class ComponentA implements OnInit, OnDestroy {
    private sub:  Subscription;
    private data;

    constructor(private service: MyService) {}

    ngOnInit() {
        this.sub = this.service.subject.subscribe(data => this.data = data);
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
export class ComponentB {
    constructor(private service: MyService) {}

    onButtonClick() {
        this.service.subject.next(data);
    }
}
==============================================================================;
=============================== Forms ========================================;
==============================================================================;
<form (ngSubmit)="onSubmit(f)" #f="ngForm">
    <input
        type="text"
        id="username"
        ngModel
        name="username"
        #thename="ngModel"
        [pattern]="<REGEX HERE>"
        required> // is a Validator
    <span *ngIf="!thename.valid && thename.touched">Please enter a valid name</span>
    <button
        type="submit"
        [disabled]="!f.valid">Press Me</button
</form>;

import { NgForm } from '@angular/core';
export class SomeComponent {
    onSubmit(form: NgForm) {
        console.log(form);
    }
}
// Alternatively
import { NgForm, ViewChild } from '@angular/core';
export class SomeComponent {
    @ViewChild('f') signupForm: NgForm;

    onSubmit() {
        console.log(this.signupForm);
    }
}
// Access ViewChild as:
this.signupForm.value.<NAME_IN_HTML>;
// Available added classes:
.ng-touched, .ng-invalid, .ng-valid
// To update some value of the form:
// Note: use this.signupForm.setValue() to override the whole form.
this.signupForm.form.patchValue({
    userData: {
        userName: 'newname'
    }
});
==============================================================================;
// Reactive form
// Import ReactiveFormsModule instead of FormsModule from '@angular/forms' inside Module
// Note: Also available: Validator.pattern(/^[1-9]+[0-9]*$/)
import { FormGroup, FormControl, Validators } from '@angular/forms';
const signupForm: FormGroup = new FormGroup({
    'userData': new FormGroup({
        'username': new FormControl('Default username', Validators.required),
        'email': new FormControl(null, [Validator.required, Validator.email]),
    }),
    'gender': new FormControl('male'),
});
console.log(this.signupForm);

<form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
    <div formGroupName="userData">
        <input
            type="text"
            formControlName="username">
        <input
            type="text"
            formControlName="email">
    </div>
    <input
        [disabled]="!signupForm.valid"
        type="radio"
        formControlName="gender">
</form>;

// Access from html:
*ngIf="signupForm.get('userData.username').valid"
==============================================================================;
// Create own validator
myValidator(control: FormControl): {[s: string]: boolean} {
    const invalid = control.value === 'smth';
    if (invalid) {
        return {'shortErrorCode': true};
    }
    return null;
}
// Now just pass a ref to this func:
this.myValidator.bind(this)
==============================================================================;
=============================== Pipes ========================================;
==============================================================================;
// Create a new Pipe 'shorten.pipe.ts'
import { Pipe, PipeTransform } from '@angular/cure';
@Pipe({
    name: 'shorten'
})
export class ShortenPipe implements PipeTransform {
    transform(value: any, limit: number) {
        return value.substr(0, limit);
    }
}
// Now add it into Module in declarations:
declarations: [ShortenPipe]
==============================================================================;
// Make a filter
1) bind Input [(ngModel)]="filterText"
2) create the pipe that accepts the filterText and a property by which check
3) To filter by the 'status' property after the array add | filter:filterText:'status'
==============================================================================;
=============================== Model ========================================;
==============================================================================;
// mymodel.model.ts
export interface MyModel {
    str: string;
    num: number;
    id?: number;
}
==============================================================================;
=============================== Resolver =====================================;
==============================================================================;
// Will run the Resolver before loading the specified Route
export { Injectable } from '@angular/core';
export { Resolve } from '@angular/router';
@Injectable({providedIn: 'root'})
export class MyResolverService implements Resolve<Recipe[]> {
    // Will subscribe itself
    resolve() {
        return this.someService.fetchStuff(); // no subscribe
    }
}
// Add into Route:
{path: 'users', component: UsersComponent, resolve: [MyResolverService]}
==============================================================================;
=============================== Interceptor ==================================;
==============================================================================;
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';
import { take, exhaustMap } from 'rxjs/operators';
@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return this.authService.userSubject.pipe(
            take(1),
            exhaustMap(user => {
                if (!user) {
                    return next.handle(req);
                }
                const modifiedReq = req.clone({
                    params: new HttpParams().set('auth': user.token)
                });
                return next.handle(modifiedReq);
            })
        );
    }
}
// Inside main Module:
import { HTTP_INTERCEPTORS } from '@angular/common/http';
providers: [..., {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorService,
    multi: true // even if using only one
}]
==============================================================================;
=============================== Animations ===================================;
==============================================================================;
import { trigger, state, style, transition } from '@angular/core';
// In Component @:
// XXX: must use the same coding style for same properties ('' or camel)
anumations: [
    trigger('divState', [
        state('normal', style({
            'background-color': 'red',
            transform: 'translateX(0)'
        })),
        state('highlighted', style({
            'background-color': 'blue',
            transform: 'translateX(100)'
        })),
        transition('normal => highlighted', animate(300)),
        transition('highlighted => normal', animate(800)),
        // OR
        transition('normal <=> highlighted', animate(300)),
    ]),
    trigger('woldState', [
        state('normal', style({
            'background-color': 'red',
            transform: 'translateX(0) scale(1)'
        })),
        state('highlighted', style({
            'background-color': 'blue',
            transform: 'translateX(100) scale(1)'
        })),
        state('shrunken', style({
            'background-color': 'green',
            transform: 'translateX(100) scale(0.5)'
        })),
        transition('normal => highlighted', animate(300)),
        transition('highlighted => normal', animate(800)),
        transition('shrunken <=> *', [
            style({
                'background-color': orange,
            }),
            animate(100, style({
                borderRadius: '50px'
            })),
            animate(500)
        ]),
    ]),
]

export class AppComponent {
    state = 'normal';
    wildState = 'normal';
}

// Now in code somewhere toggle the _state variable content.

// ... in html:
<div [@divState]="state">
</div>;
<div [@wildState]="state">
</div>;
==============================================================================;
// List animation
// "void" --- the element wasn't added, or is to be removed from the DOM
import { trigger, state, style, transition, keyframes } from '@angular/core';
anumations: [
    trigger('list1', [
        // NOTE: not using 'in'!!
        state('in', style({
            opacity: 1,
            transform: 'translateX(0)'
        })),
        transition('void => *', [
            style({
                opacity: 0,
                transform: 'translateX(-100px)'
            })
            animate(300),
        ]), 
        transition('* => void', [
            animate(300, style({
                opacity: 0,
                transform: 'translateX(100px)'
            })),
        ]),
    ]),
==============================================================================;
// Keyframes
    trigger('list2', [
        // NOTE: not using 'in'!!
        state('in', style({
            opacity: 1,
            transform: 'translateX(0)'
        })),
        transition('void => *', [
            animate(300, keyframes([
                style({
                    transform: 'translateX(-100px)',
                    opacity: 0,
                    offset: 0,
                }),
                style({
                    transform: 'translateX(-50px)',
                    opacity: 0.5
                    offset: 0.3,
                }),
                style({
                    transform: 'translateX(-20px)',
                    opacity: 1,
                    offset: 0.8,
                }),
                style({
                    transform: 'translateX(0px)',
                    opacity: 1,
                    offset: 1,
                }),
            ])),
        ]), 
        transition('* => void', [
            animate(300, style({
                opacity: 0,
                transform: 'translateX(100px)'
            })),
        ]),
    ]),
]

export class AppComponent {
    state = 'normal';
}

// Now in code somewhere toggle the _state variable content.

// ... in html:
<li [@lsit1] (click)="onDelete()">
</li>;
==============================================================================;
// Group (to make them run in parallel)
transition('* => void', [
    group([ // To make them 
        animate(300, style({
            color: 'red',
        })),
        animate(800, style({
            opacity: 0,
            transform: 'translateX(100px)',
        })),
    ])
]),
==============================================================================;
// Events
<div
    [@divState]="state"
    (@divState.start)="onStart($event)"
    (@divState.done)="onDone($event)">
</div>
