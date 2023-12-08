import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Movie } from '../interfaces/movie.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private moviesUrl = 'assets/movies.json';
  private watchlist: number[] = [];

  constructor(private httpClient: HttpClient, private snackBar: MatSnackBar) {
    // Get local storage watchlist
    let lsWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    this.watchlist = lsWatchlist;
  }

  getMovies(): Observable<Movie[]> {
    return this.httpClient.get<Movie[]>(this.moviesUrl).pipe(
      map((data) =>
        data.map((movie) => {
          // Format date from json
          movie.date = new Date(movie.date);
          return movie;
        })
      )
    );
  }

  getMovieById(id: number): Observable<Movie> {
    return this.getMovies().pipe(
      map((movies) => movies.filter((movie) => movie.id === id)[0])
    );
  }

  isMovieInWatchlist(movieId: number): boolean {
    return !!this.watchlist.filter((id) => id === movieId).length;
  }

  addToWatchlist(movieId: number): void {
    this.watchlist.push(movieId);
    this.updateWatchlist();
    this.openSnackBar('Movie added to watchlist!');
  }

  removeFromWatchlist(movieId: number): void {
    this.watchlist = this.watchlist.filter((id) => id !== movieId);
    this.updateWatchlist();
    this.openSnackBar('Movie removed from watchlist!');
  }

  updateWatchlist(): void {
    localStorage.setItem('watchlist', JSON.stringify(this.watchlist));
  }

  openSnackBar(message: string): void {
    this.snackBar.open(message, 'close', {
      duration: 3000,
    });
  }
}
