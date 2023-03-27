import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {DataService} from "../services/data.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {EMPTY, switchMap} from "rxjs";
import {PageInfo} from "../Interfaces/page-info";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit {
  public pageInfo: any = {};
  public list: any = [];

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(
        switchMap((queryParams: Params) => {
          const page: number = queryParams['page'];
          if (!page) {
            this.router.navigate(['/list'], {queryParams: {page: 0}});
            return EMPTY;
          }
          return this.dataService.getList(page);
        })
      )
      .subscribe(data => {
        this.pageInfo.page = data.page;
        this.pageInfo.hitsPerPage = data.hitsPerPage;
        this.pageInfo.nbHits = data.nbHits;
        this.pageInfo.nbPages = data.nbPages;
        this.list = data.hits;
        this.cdr.detectChanges();
      });
  }

  onPageChange(pageInfo: PageEvent) {
    console.log(pageInfo)
    this.router.navigate(['/list'], {queryParams: {page: pageInfo.pageIndex}});

  }
}
