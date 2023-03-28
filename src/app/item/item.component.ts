import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';
import {Item} from "../Interfaces/item";

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemComponent implements OnInit {

  @Input() item!: Item;

  constructor(
  ) { }

  ngOnInit(): void {}

}
