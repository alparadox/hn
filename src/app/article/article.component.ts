import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {DataService} from "../services/data.service";
import {switchMap} from "rxjs";

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
export class ArticleComponent implements OnInit {
  tree!: TreeNode[];
  item: any;

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
        })
      )
      .subscribe((data) => {
        this.item = data;
        this.tree = data.children;
        this.cdr.detectChanges();
      });
  }

}
