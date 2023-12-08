export interface Movie {
  id: number;
  title: string;
  description: string;
  rating: number;
  duration: number;
  genre: Genre[];
  date: Date;
  trailer: string;
  poster: string;
}

export enum Genre {
  Action = 'Action',
  Adventure = 'Adventure',
  Animation = 'Animation',
  Comedy = 'Comedy',
  Crime = 'Crime',
  Drama = 'Drama',
  Documentary = 'Documentary',
  Fantasy = 'Fantasy',
  Horror = 'Horror',
  Mistery = 'Mistery',
  Romance = 'Romance',
  SciFi = 'Sci-Fi',
  Thriller = 'Thriller',
}
