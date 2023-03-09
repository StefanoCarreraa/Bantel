import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PlanService } from '../../../../../../../../../libs/ose-commons/src/lib/services/plan/plan.service';
import { Plan } from '../../../interfaces/plan.interface';

@Component({
  selector: 'app-homepage-plans',
  templateUrl: './homepage-plans.component.html',
  styleUrls: ['./homepage-plans.component.scss']
})
export class HomepagePlansComponent implements OnInit {

  plans: Plan[];
	
	responsiveOptions;

	constructor(private planService: PlanService) { 
		this.responsiveOptions = [
            {
                breakpoint: '1024px',
                numVisible: 3,
                numScroll: 3
            },
            {
                breakpoint: '768px',
                numVisible: 2,
                numScroll: 2
            },
            {
                breakpoint: '560px',
                numVisible: 1,
                numScroll: 1
            }
        ];
	}

	ngOnInit() {
		this.planService.getProducts().then(plans => {
			this.plans = plans;
		});
	}

}
