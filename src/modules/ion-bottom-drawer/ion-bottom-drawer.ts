import { Component, Input, ElementRef, Renderer2, Output, EventEmitter, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { Platform, DomController } from 'ionic-angular';

import { DrawerState } from './drawer-state';

@Component({
  selector: 'ion-bottom-drawer',
  templateUrl: 'ion-bottom-drawer.html',
  styleUrls: ['ion-bottom-drawer.scss']
})
export class IonBottomDrawerComponent implements AfterViewInit, OnChanges {


  @Input() dockedHeight: number = 50;

  @Input() shouldBounce: boolean = true;

  @Input() disableDrag: boolean = false;

  @Input() distanceTop: number = 0;

  @Input() transition: string = '0.25s ease-in-out';

  @Input() state: DrawerState = DrawerState.Bottom;

  @Input() minimumHeight: number = 0;

  @Output() stateChange: EventEmitter<DrawerState> = new EventEmitter<DrawerState>();

  private _startPositionTop: number;
  private readonly _BOUNCE_DELTA = 30;

  constructor(
    private _element: ElementRef,
    private _renderer: Renderer2,
    private _domCtrl: DomController,
    private _platform: Platform
  ) {

    //alert("costruncro");

  }

  ngAfterViewInit() {
    this._renderer.setStyle(this._element.nativeElement.querySelector('.ion-bottom-drawer-scrollable-content .scroll-content'), 'touch-action', 'none');
    this._renderer.setStyle(this._element.nativeElement.querySelector('.ion-bottom-drawer-scrollable-content .scroll-content'),"left", "-73px");
    this._renderer.setStyle(this._element.nativeElement.querySelector('.ion-bottom-drawer-scrollable-content .scroll-content'),"border-top-left-radius", "420px");
    this._renderer.setStyle(this._element.nativeElement.querySelector('.ion-bottom-drawer-scrollable-content .scroll-content'),"border-top-right-radius", "420px");
    this._renderer.setStyle(this._element.nativeElement.querySelector('.ion-bottom-drawer-scrollable-content .scroll-content'),"background-size", "350px");
    this._renderer.setStyle(this._element.nativeElement.querySelector('.ion-bottom-drawer-scrollable-content .scroll-content'),"background-color","#6cca91");
    this._renderer.setStyle(this._element.nativeElement.querySelector('.ion-bottom-drawer-scrollable-content .scroll-content'),"margin-top", "30px !important");
    this._setDrawerState(this.state);

    //Registro un listener su un elemento html
    const hammer = new Hammer(this._element.nativeElement.querySelector('.div-draggable'));
    hammer.get('pan').set({ enable: true, direction: Hammer.DIRECTION_VERTICAL });
    hammer.on('pan panstart panend', (ev: any) => {
      if (this.disableDrag) return;

      switch (ev.type) {
        case 'panstart':
          this._handlePanStart();
          break;
        case 'panend':
          this._handlePanEnd(ev);
          break;
        default:
          this._handlePan(ev);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.state) return;
    this._setDrawerState(changes.state.currentValue);
  }

  private _setDrawerState(state: DrawerState) {
    this._renderer.setStyle(this._element.nativeElement, 'transition', this.transition);
    switch (state) {
      case DrawerState.Bottom:
        this._setTranslateY('calc(100vh - ' + this.minimumHeight + 'px)');
        break;
      case DrawerState.Docked:
        this._setTranslateY((this._platform.height() - this.dockedHeight) + 'px');
        break;
      default:
        this._setTranslateY(this.distanceTop + 'px');
    }
  }

  private _handlePanStart() {
    this._startPositionTop = this._element.nativeElement.getBoundingClientRect().top;
  }

  private _handlePanEnd(ev) {
    if (this.shouldBounce && ev.isFinal) {
      this._renderer.setStyle(this._element.nativeElement, 'transition', this.transition);

      switch (this.state) {
        case DrawerState.Docked:
          this._handleDockedPanEnd(ev);
          break;
        case DrawerState.Top:
          this._handleTopPanEnd(ev);
          break;
        default:
          this._handleBottomPanEnd(ev);
      }
    }
    this.stateChange.emit(this.state);
  }

  private _handleTopPanEnd(ev) {
    if (ev.deltaY > this._BOUNCE_DELTA) {
      this.state = DrawerState.Docked;
    } else {
      this._setTranslateY(this.distanceTop + 'px');
    }
  }

  private _handleDockedPanEnd(ev) {
    const absDeltaY = Math.abs(ev.deltaY)
    if (absDeltaY > this._BOUNCE_DELTA && ev.deltaY < 0) {
      this.state = DrawerState.Top;
    } else if (absDeltaY > this._BOUNCE_DELTA && ev.deltaY > 0) {
      this.state = DrawerState.Bottom
    } else {
      this._setTranslateY((this._platform.height() - this.dockedHeight) + 'px');
    }
  }

  private _handleBottomPanEnd(ev) {
    if (-ev.deltaY > this._BOUNCE_DELTA) {
      this.state = DrawerState.Docked;
    } else {
      this._setTranslateY('calc(100vh - ' + this.minimumHeight + 'px)');
    }
  }


  private modificaopacita = function(){
    var draggableDivY = this._element.nativeElement.querySelector('.div-draggable');
    var rect = draggableDivY.getBoundingClientRect();

  var position = {
  top: rect.top + window.pageYOffset,
  left: rect.left + window.pageXOffset
  };
  var opacita = 0;
  opacita = 1-((position.top)*0.0062);
    if(position.top >= 440) {
        this._renderer.setStyle(this._element.nativeElement.querySelector('.sub-div-bottom'),"opacity", 0);
  opacita = 0;
    } else if (position.top <= 5){
      opacita = 1;
      this._renderer.setStyle(this._element.nativeElement.querySelector('.sub-div-bottom'),"opacity", 1);
    }
    else {

      if(opacita < 0) opacita = 0;
      if(opacita > 1) opacita = 1;
      this._renderer.setStyle(this._element.nativeElement.querySelector('.sub-div-bottom'),"opacity", opacita );
      this._renderer.setStyle(this._element.nativeElement.querySelector('.titlelista'),"opacity", opacita );

    }

    var radius = Math.round(0.0022 * position.top * 200);

      this._renderer.setStyle(this._element.nativeElement.querySelector('.ion-bottom-drawer-scrollable-content .scroll-content'),"border-top-left-radius",radius+"px");
      this._renderer.setStyle(this._element.nativeElement.querySelector('.ion-bottom-drawer-scrollable-content .scroll-content'),"border-top-right-radius", radius+"px");

  var DraggableDiv = this._element.nativeElement.querySelector('.div-draggable');
  var SubDraggableDiv = this._element.nativeElement.querySelector('.sub-div-draggable');
  var minWidth = 40;
  var minHeight = 1;
  var height = 5- (0.0022 * position.top * 5);
  var width = 100-((0.16*position.top));
  if (width<minWidth){
    width = minWidth;
  }
  if (height<minHeight){
    height = minHeight;
  }
  var leftDistance = position.top*0.067;
  this._renderer.setStyle(SubDraggableDiv,"width",width+"%");
  this._renderer.setStyle(DraggableDiv,"width",width+"%");
  this._renderer.setStyle(SubDraggableDiv,"height",height+"%");
  this._renderer.setStyle(DraggableDiv,"margin-left",leftDistance+"%");

  }

  private _handlePan(ev) {
    const pointerY = ev.center.y;
    this._renderer.setStyle(this._element.nativeElement, 'transition', 'none');
    if (pointerY > 0 && pointerY < this._platform.height()) {
      if (ev.additionalEvent === 'panup' || ev.additionalEvent === 'pandown') {
        const newTop = this._startPositionTop + ev.deltaY;
        if (newTop >= this.distanceTop) this._setTranslateY(newTop + 'px');
        else if (newTop < this.distanceTop) this._setTranslateY(this.distanceTop + 'px');
        if (newTop > this._platform.height() - this.minimumHeight) this._setTranslateY((this._platform.height() - this.minimumHeight) + 'px');
      }


      this.modificaopacita();
/*
    this._renderer.setStyle(this._element.nativeElement.querySelector('.ion-bottom-drawer-scrollable-content .scroll-content'),"border-top-left-radius", "200px");
    this._renderer.setStyle(this._element.nativeElement.querySelector('.ion-bottom-drawer-scrollable-content .scroll-content'),"border-top-right-radius", "200px");*/
    }
  }

  private _setTranslateY(value) {
    this._domCtrl.write(() => {
      this._renderer.setStyle(this._element.nativeElement, 'transform', 'translateY(' + value + ')');
    });
  }
}
