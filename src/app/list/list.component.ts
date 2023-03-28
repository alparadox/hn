import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {DataService} from "../services/data.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {EMPTY, Subject, Subscription, switchMap, takeUntil} from "rxjs";
import {PageInfo} from "../Interfaces/page-info";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit, OnDestroy {
  public pageInfo: any = {};
  public list: any = [];
  public loading = true;

  private destroy$ = new Subject<void>();

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  public ngOnInit(): void {
    this.route.queryParams
      .pipe(
        switchMap((queryParams: Params) => {
          const page: number = queryParams['page'];
          if (!page) {
            this.router.navigate(['/list'], {queryParams: {page: 0}});
            return EMPTY;
          }
          return this.dataService.getList(page);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: data => {
          this.pageInfo.page = data.page;
          this.pageInfo.hitsPerPage = data.hitsPerPage;
          this.pageInfo.nbHits = data.nbHits;
          this.pageInfo.nbPages = data.nbPages;
          this.loading = false;
          this.list = data.hits;
          this.cdr.detectChanges();
        },
        error: err => console.log(err)
      });
  }

  public onPageChange(pageInfo: PageEvent): void {
    this.loading = true;
    this.router.navigate(['/list'], {queryParams: {page: pageInfo.pageIndex}});
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
