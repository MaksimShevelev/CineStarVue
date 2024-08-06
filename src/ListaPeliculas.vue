<template>
    <div>
      <div v-if="mensajeAlerta" :class="[mensajeAlerta.tipo]" role="alert">
        {{ mensajeAlerta.texto }}
      </div>         
      <div class="container-fluid py-4">
        <div class="container">
          <div class="mb-4">
            <input type="text" v-model="consulta" class="form-control" placeholder="Buscar películas...">
            <div class="d-flex justify-content-center mt-2">
              <button @click="buscarPeliculas" class="btn1">Buscar</button>
            </div>
          </div>
          <h2>Filtros</h2>
          <div class="row mb-4">
            <div class="col-6 mb-4">
              <h6>Género</h6>
              <select v-model="generoSeleccionado" class="form-select">
                <option value="">Todos</option>
                <option v-for="genero in generos" :key="genero.id" :value="genero.id">{{ genero.name }}</option>
              </select>
              <div class="d-flex justify-content-center mt-2">
                <button @click="filtrarPorGenero" class="btn1">Filtrar</button>
              </div>
            </div>
            <div class="col-6 mb-4">
              <h6>Edad</h6>
              <select v-model="edadSeleccionada" class="form-select">
                <option value="">Todas</option>
                <option v-for="edad in edades" :key="edad.value" :value="edad.value">{{ edad.text }}</option>
              </select>
              <div class="d-flex justify-content-center mt-2">
                <button @click="filtrarPorEdad" class="btn1">Filtrar</button>
              </div>
            </div>
          </div>
          <div v-if="mensajeError" class="alert alert-warning" role="alert">
            {{ mensajeError }}
          </div>
          <h1 v-if="mostrarPeliculasPopulares" class="titulo">Películas populares</h1>
          <div class="row" v-if="mostrarPeliculasPopulares">
            <div class="col-lg-4 col-md-6 col-sm-12 mb-3" v-for="pelicula in peliculasPopulares.slice(0, 6)" :key="pelicula.id">
              <div class="card card-pelicula mb-3" v-if="pelicula.poster_path && pelicula.overview">
                <img :src="'https://image.tmdb.org/t/p/w300_and_h450_bestv2' + pelicula.poster_path" class="card-img-top" alt="...">
                <div class="card-body">
                  <h5 class="card-title">{{ pelicula.title }}</h5>
                  <p class="card-text">{{ pelicula.overview }}</p>
                  <router-link :to="{ name: 'detalles', params: { id: pelicula.id } }" class="btn1">Detalles</router-link>
                  <button v-if="!esFavorita(pelicula.id)" @click="agregarAFavoritos(pelicula)" class="btn1">Agregar a favoritos</button>
                  <button v-else @click="eliminarDeFavoritos(pelicula.id)" class="btn">Eliminar de favoritos</button>
                </div>
              </div>
              <div v-else class="alert alert-warning" role="alert">
                Datos incompletos para la película: {{ pelicula.title }}
              </div>
            </div>
          </div>
          <h2 v-else>Resultados de búsqueda</h2>
          <div class="row pb-5">
            <div class="col-lg-4 col-md-6 col-sm-12 mb-3 pb-5" v-for="pelicula in peliculas" :key="pelicula.id">
              <div class="card card-pelicula mb-3" v-if="pelicula.poster_path && pelicula.overview">
                <img :src="'https://image.tmdb.org/t/p/w300_and_h450_bestv2' + pelicula.poster_path" class="card-img-top" alt="...">
                <div class="card-body">
                  <h5 class="card-title">{{ pelicula.title }}</h5>
                  <p class="card-text">{{ pelicula.overview }}</p>
                  <router-link :to="{ name: 'detalles', params: { id: pelicula.id } }" class="btn1">Detalles</router-link>
                  <button v-if="!esFavorita(pelicula.id)" @click="agregarAFavoritos(pelicula)" class="btn1">Agregar a favoritos</button>
                  <button v-else @click="eliminarDeFavoritos(pelicula.id)" class="btn">Eliminar de favoritos</button>
                </div>
              </div>
              <div v-else class="alert alert-warning" role="alert">
                Datos incompletos para la película: {{ pelicula.title }}
              </div>
              </div>
            </div>
            <div v-if="peliculaSeleccionada" class="mt-5 pb-5">
              <div class="card card-detalles mb-3">
                <div class="card-body">
                  <h2 class="card-title">{{ peliculaSeleccionada.title }}</h2>
                  <p class="card-text"><strong>Fecha de Estreno:</strong> {{ peliculaSeleccionada.release_date }}</p>
                  <p class="card-text"><strong>Descripción:</strong> {{ peliculaSeleccionada.overview }}</p>
                  <img v-if="peliculaSeleccionada.poster_path" :src="'https://image.tmdb.org/t/p/w300_and_h450_bestv2' + peliculaSeleccionada.poster_path" alt="Póster de la Película" class="img-fluid">
                  <button v-if="!esFavorita(peliculaSeleccionada.id)" @click="agregarAFavoritos(peliculaSeleccionada)" class="btn1">Agregar a Favoritos</button>
                  <button v-else @click="eliminarDeFavoritos(peliculaSeleccionada.id)" class="btn">Eliminar de Favoritos</button>
                </div>
              </div>
            </div>
            <div class="mt-5">
              <h2>Favoritos</h2>
              <div class="row">
                <div class="col-lg-4 col-md-6 col-sm-12 mb-3 pb-5" v-for="fav in favoritos" :key="fav.id">
                  <div class="card card-pelicula mb-3" v-if="fav.poster_path && fav.overview">
                    <img :src="'https://image.tmdb.org/t/p/w300_and_h450_bestv2' + fav.poster_path" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">{{ fav.title }}</h5>
                      <p class="card-text">{{ fav.overview }}</p>
                      <button @click="eliminarDeFavoritos(fav.id)" class="btn">Eliminar</button>
                    </div>
                  </div>
                  <div v-else class="alert alert-warning" role="alert">
                    Datos incompletos para la película: {{ fav.title }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  </template>
  
  <script>
  const apiKey = '4bca1acc7fc125e6bd15772c2e0bc964';
  
  export default {
    data() {
      return {
        peliculas: [],
        peliculasPopulares: [],
        consulta: '',
        peliculaSeleccionada: null,
        favoritos: [],
        generoSeleccionado: '',
        edadSeleccionada: '', // Параметр для фильтра по возрасту
        generos: [
          { id: 28, name: 'Acción' },
          { id: 12, name: 'Aventura' },
          { id: 16, name: 'Animación' },
          { id: 35, name: 'Comedia' },
          { id: 80, name: 'Crimen' },
          { id: 99, name: 'Documental' },
          { id: 18, name: 'Drama' },
          { id: 10751, name: 'Familiar' },
          { id: 14, name: 'Fantasía' },
          { id: 36, name: 'Historia' },
          { id: 27, name: 'Terror' },
          { id: 10402, name: 'Música' },
          { id: 9648, name: 'Misterio' },
          { id: 10749, name: 'Romance' },
          { id: 878, name: 'Ciencia ficción' },
          { id: 10770, name: 'Película de TV' },
          { id: 53, name: 'Suspenso' },
          { id: 10752, name: 'Bélica' },
          { id: 37, name: 'Western' }
        ],
        edades: [
          { value: 'G', text: 'G - General Audience' },
          { value: 'PG', text: 'PG - Parental Guidance Suggested' },
          { value: 'PG-13', text: 'PG-13 - Parents Strongly Cautioned' },
          { value: 'R', text: 'R - Restricted' },
          { value: 'NC-17', text: 'NC-17 - Adults Only' }
        ],
        mostrarPeliculasPopulares: true,
        mensajeError: '',
        mensajeAlerta: null
      };
    },
    methods: {
      async buscarPeliculas() {
        try {
          const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${this.consulta}&language=es-ES&page=1&api_key=${apiKey}`);
          const data = await response.json();
          this.peliculas = data.results;
          this.mostrarPeliculasPopulares = false;
          if (this.peliculas.length === 0) {
            this.mostrarAlerta('warning', 'No se encontraron resultados para tu búsqueda.');
          } else {
            this.mensajeError = '';
          }
        } catch (error) {
          console.error('Error al buscar películas:', error);
          this.mostrarAlerta('danger', 'Ocurrió un error al realizar la búsqueda. Intenta nuevamente.');
        }
      },
      async obtenerPeliculasPopulares() {
        try {
          const response = await fetch(`https://api.themoviedb.org/3/movie/popular?language=es-ES&page=1&api_key=${apiKey}`);
          const data = await response.json();
          this.peliculasPopulares = data.results;
        } catch (error) {
          console.error('Error al obtener películas populares:', error);
          this.mostrarAlerta('danger', 'Error al obtener películas populares. Intenta nuevamente.');
        }
      },
      async obtenerDetallesPelicula(id) {
        try {
          const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=es-ES&api_key=${apiKey}`);
          const data = await response.json();
          window.location.href = `detalles.html?id=${data.id}`;
        } catch (error) {
          console.error('Información detallada de la película:', error);
          this.mostrarAlerta('danger', 'Error al recuperar los detalles de la película. Intentar otra vez.');
        }
      },
      agregarAFavoritos(pelicula) {
        if (!this.esFavorita(pelicula.id)) {
          this.favoritos.push(pelicula);
          localStorage.setItem('favoritos', JSON.stringify(this.favoritos));
          this.mostrarAlerta('success', 'Película agregada a favoritos');
        }
      },
      eliminarDeFavoritos(id) {
        this.favoritos = this.favoritos.filter(pelicula => pelicula.id !== id);
        localStorage.setItem('favoritos', JSON.stringify(this.favoritos));
        this.mostrarAlerta('danger', 'Película eliminada de favoritos');
      },
      esFavorita(id) {
        return this.favoritos.some(p => p.id === id);
      },
      cargarFavoritos() {
        const favoritosGuardados = localStorage.getItem('favoritos');
        if (favoritosGuardados) {
          this.favoritos = JSON.parse(favoritosGuardados);
        }
      },
      filtrarPorGenero() {
        if (!this.generoSeleccionado) {
          this.obtenerPeliculasPopulares();
        } else {
          this.buscarPeliculasPorGenero();
        }
      },
      async buscarPeliculasPorGenero() {
        try {
          const response = await fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${this.generoSeleccionado}&language=es-ES&page=1&api_key=${apiKey}`);
          const data = await response.json();
          this.peliculas = data.results;
          this.mostrarPeliculasPopulares = false;
        } catch (error) {
          console.error('Error al buscar películas por género:', error);
          this.mostrarAlerta('danger', 'Ocurrió un error al realizar la búsqueda por género. Intenta nuevamente.');
        }
      },
      async filtrarPorEdad() {
        try {
          const response = await fetch(`https://api.themoviedb.org/3/discover/movie?certification_country=US&certification=${this.edadSeleccionada}&language=es-ES&page=1&api_key=${apiKey}`);
          const data = await response.json();
          this.peliculas = data.results;
          this.mostrarPeliculasPopulares = false;
          if (this.peliculas.length === 0) {
            this.mostrarAlerta('warning', 'No se encontraron resultados para la edad seleccionada.');
          } else {
            this.mensajeError = '';
          }
        } catch (error) {
          console.error('Error al filtrar películas por edad:', error);
          this.mostrarAlerta('danger', 'Ocurrió un error al realizar la búsqueda por edad. Intenta nuevamente.');
        }
      },
      mostrarAlerta(tipo, texto) {
        this.mensajeAlerta = { tipo: `alert-${tipo}`, texto: texto };
        setTimeout(() => {
          this.mensajeAlerta = null;
        }, 3000);
      }    
    },
    created() {
      this.obtenerPeliculasPopulares();
      this.cargarFavoritos();
    }
  }
  </script>
  
  