import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  id: number = 1
  name: string = "Nike Air Max 270 React"
  description: string = "A combination of Nike's two best cushioning technologies: string = React foam and Max Air unit."  
  price: number = 10999
  image: string = "Nike.jpg"


 shoes: any[]=[
  {
      id: 1,
      name: "Nike Air Max 270 React",
      description: "A combination of Nike's two best cushioning technologies: React foam and Max Air unit.",
      price: 10999,
      image: "Nike.jpg"
  },
  {
      id: 2,
      name: "Puma RS-0 Sound Sneakers",
      description: "Inspired by the Puma RS-0 running shoes from the '80s, with modern updates and bold colors.",
      price: 8999,
      image: "Puma.jpg"
  },
  {
      id: 3,
      name: "Adidas Ultraboost 21",
      description: "The latest version of the popular Ultraboost series, with more boost cushioning and a sleek new design.",
      price: 14999,
      image: "Adidas.jpg"
  },
  {
      id: 4,
      name: "Reebok Classic Leather Sneakers",
      description: "A timeless design that's been popular since the '80s, with a soft leather upper and comfortable cushioning.",
      price: 6999,
      image: "Reebok.jpg"
  }

]
}
