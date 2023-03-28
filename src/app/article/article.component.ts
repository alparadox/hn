import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {DataService} from "../services/data.service";
import {Subject, switchMap, takeUntil} from "rxjs";

interface TreeNode {
  text: string;
  children?: TreeNode[];
}

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleComponent implements OnInit, OnDestroy {
  tree!: TreeNode[];
  item: any;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params: Params) => {
          const id: string = params['id'];
          return this.dataService.getComments(id);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (data) => {
          this.item = data;
          this.tree = data.children;
          this.cdr.detectChanges();
        },
        error: err => console.log(err)
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
