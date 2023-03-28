import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {DataService} from "../services/data.service";
import {switchMap} from "rxjs";
import {NestedTreeControl} from "@angular/cdk/tree";
import {MatTreeNestedDataSource} from "@angular/material/tree";

interface TreeNode {
  text: string;
  children?: TreeNode[];
}

const TREE_DATA: TreeNode[] = [
  {
    text: 'Fruit',
    children: [{text: 'Apple'}, {text: 'Banana'}, {text: 'Fruit loops'}],
  },
  {
    text: 'Vegetables',
    children: [
      {
        text: 'Green',
        children: [{text: 'Broccoli'}, {text: 'Brussels sprouts'}],
      },
      {
        text: 'Orange',
        children: [{text: 'Pumpkins'}, {text: 'Carrots'}],
      },
    ],
  },
];


@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleComponent implements OnInit {

  tree!: TreeNode[];
  treeControl = new NestedTreeControl<TreeNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<TreeNode>();

  hasChild = (_: number, node: TreeNode) => !!node.children && node.children.length > 0;

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
        this.dataSource.data = data.children;
        this.tree = data.children;
        console.log(data);
        this.cdr.detectChanges();
      });
  }

}
