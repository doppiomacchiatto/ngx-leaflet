import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LeafletModule } from '../../../leaflet/leaflet.module';

import { LeafletDemoComponent } from './leaflet-demo.component';
import { LeafletCoreDemoComponent } from './core/core-demo.component';
import { LeafletLayersDemoComponent } from './layers/layers-demo.component';
import { LeafletBaseLayersDemoComponent } from './layers/baselayers-demo.component';
import { LeafletMarkersDemoComponent } from './layers/markers-demo.component';
import { LeafletPerformanceDemoComponent } from './performance/performance-demo.component';
import { LeafletWrapperComponent } from './performance/leaflet-wrapper.component';


@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		LeafletModule.forRoot()
	],
	declarations: [
		LeafletDemoComponent,
		LeafletCoreDemoComponent,
		LeafletLayersDemoComponent,
		LeafletBaseLayersDemoComponent,
		LeafletMarkersDemoComponent,
		LeafletPerformanceDemoComponent,
		LeafletWrapperComponent
	],
	exports: [
		LeafletDemoComponent
	],
	bootstrap: [ LeafletDemoComponent ],
	providers: [ ]
})
export class LeafletDemoModule { }
