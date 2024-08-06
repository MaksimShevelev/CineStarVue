<template>
    <div class="container mt-5">
      <h2>{{ pelicula.title }}</h2>
      <div class="row mt-4">
        <div class="col-lg-4">
          <img :src="'https://image.tmdb.org/t/p/w300_and_h450_bestv2' + pelicula.poster_path" alt="..." class="img-fluid">
        </div>
        <div class="col-lg-8">
          <p><strong>Descripción:</strong> {{ pelicula.overview }}</p>
          <p><strong>Fecha de lanzamiento:</strong> {{ pelicula.release_date }}</p>
          <p><strong>Puntuación:</strong> {{ pelicula.vote_average }}</p>
          <p><strong>Géneros:</strong> 
            <span v-for="(genero, index) in pelicula.genres" :key="index">
              {{ genero.name }}{{ index < pelicula.genres.length - 1 ? ', ' : '' }}
            </span>
          </p>
          <router-link :to="{ name: 'listaPeliculas' }" class="btn1">Volver a la lista</router-link>
        </div>
      </div>
  
    </div>
  </template>
  
  <script>
  const apiKey = '4bca1acc7fc125e6bd15772c2e0bc964';
  
  export default {
    data() {
      return {
        pelicula: {}
      };
    },
    
    methods: {
      async obtenerDetallesPelicula() {
        try {
          const response = await fetch(`https://api.themoviedb.org/3/movie/${this.$route.params.id}?language=es-ES&api_key=${apiKey}`);
          const data = await response.json();
          this.pelicula = data;
        } catch (error) {
          console.error('Error al obtener detalles de la película:', error);
          // Manejo de errores
        }
      }
    },
    mounted() {
      this.obtenerDetallesPelicula();
    }
  };
  </script>
  