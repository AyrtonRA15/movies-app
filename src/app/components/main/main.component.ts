import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { Genre, Movie } from '../../interfaces/movie.interface';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatButtonToggleChange } from '@angular/material/button-toggle';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MainComponent implements OnInit {
  moviesSubscription!: Subscription;
  movies: Movie[] = [];
  filteredMovies: Movie[] = [];
  genreList = Genre;
  selectedGenre = '';
  searchText = '';

  constructor(private movie: MovieService, private router: Router) {}

  ngOnInit(): void {
    this.moviesSubscription = this.movie.getMovies().subscribe((movies) => {
      this.movies = movies;
      this.resetMovies();
    });
  }

  private resetMovies(): void {
    this.filteredMovies = [...this.movies];
  }

  sortBy(event: MatButtonToggleChange): void {
    let sortOpt = Number(event.value);
    switch (sortOpt) {
      case 0:
        // Sort by Title
        this.movies.sort((a: Movie, b: Movie) =>
          a.title.localeCompare(b.title)
        );
        break;
      case 1:
        // Sort by Release Date
        this.movies.sort(
          (a: Movie, b: Movie) => b.date.getTime() - a.date.getTime()
        );
        break;
    }
    this.filterMovies();
  }

  private containsSelectedGenre(genres: Genre[]): boolean {
    if (!this.selectedGenre) return true;
    return !!genres.filter((genre: string) => genre === this.selectedGenre)
      .length;
  }

  private titleMatchesSearch(title: string): boolean {
    if (!this.searchText) return true;
    return title
      .toLocaleLowerCase()
      .includes(this.searchText.toLocaleLowerCase());
  }

  filterMovies(): void {
    if (!this.selectedGenre && !this.searchText) {
      // No need to apply any filters
      this.resetMovies();
    } else {
      this.filteredMovies = this.movies.filter(
        (movie: Movie) =>
          this.containsSelectedGenre(movie.genre) &&
          this.titleMatchesSearch(movie.title)
      );
    }
  }

  selectGenre(event: any, selectedGenre: string): void {
    this.selectedGenre = event.selected ? selectedGenre : '';
    this.filterMovies();
  }

  isMovieInWatchlist(movieId: number): boolean {
    return this.movie.isMovieInWatchlist(movieId);
  }

  addToWatchlist(movieId: number): void {
    this.movie.addToWatchlist(movieId);
  }

  removeFromWatchlist(movieId: number): void {
    this.movie.removeFromWatchlist(movieId);
  }

  openDetails(movieId: number): void {
    this.router.navigate(['detail', movieId]);
  }

  ngOnDestroy(): void {
    this.moviesSubscription.unsubscribe();
  }
}
