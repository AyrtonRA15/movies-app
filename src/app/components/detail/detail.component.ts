import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { ActivatedRoute } from '@angular/router';
import { Movie } from '../../interfaces/movie.interface';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DetailComponent implements OnInit, OnDestroy {
  selectedMovie: Movie = {
    id: 0,
    title: '',
    description: '',
    rating: 0,
    duration: 0,
    genre: [],
    date: new Date(),
    trailer: '',
    poster: '',
  };
  ytVideoID = '';
  movieSubscription!: Subscription;
  isMovieInWatchlist: boolean = false;

  constructor(
    private movie: MovieService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    const movieId = Number(this.route.snapshot.paramMap.get('movieId'));
    this.movieSubscription = this.movie
      .getMovieById(movieId)
      .subscribe((movie: Movie) => {
        this.ytVideoID = movie.trailer.split('v=')[1]; // Get youtube video ID from trailer url
        this.selectedMovie = movie;
        this.isMovieInWatchlist = this.movie.isMovieInWatchlist(
          this.selectedMovie.id
        );
      });
  }

  toggleMovieInWatchlist(): void {
    if (this.isMovieInWatchlist) {
      this.movie.removeFromWatchlist(this.selectedMovie.id);
    } else {
      this.movie.addToWatchlist(this.selectedMovie.id);
    }
    this.isMovieInWatchlist = !this.isMovieInWatchlist;
  }

  close(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.movieSubscription.unsubscribe();
  }
}
